// /src/services/UsuarioService.js

import {
    UsuarioSchema,
    UsuarioUpdateSchema
} from '../utils/validators/schemas/zod/UsuarioSchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import AuthHelper from '../utils/AuthHelper.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import GrupoRepository from '../repository/GrupoRepository.js'
import SecretariaRepository from '../repository/SecretariaRepository.js'
import UploadService from './UploadService.js';

class UsuarioService {
    constructor() {
        this.repository = new UsuarioRepository();
        this.grupoRepository = new GrupoRepository;
        this.secretariaRepository = new SecretariaRepository();
        this.uploadService = new UploadService();
    }

    async listar(req) {

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        const nivel = usuarioLogado?.nivel_acesso;
        const usuarioID = usuarioLogado._id;
        // Se foi passado id como param, trata como busca por um usuário específico
        const idParam = req?.params?.id;

        if (idParam) {
            // Munícipe e Operador só podem acessar seu próprio registro
            if (nivel.municipe || nivel.operador) {
                if (String(usuarioID) !== String(idParam)) {
                    throw new CustomError({
                        statusCode: HttpStatusCodes.FORBIDDEN.code,
                        errorType: 'permissionError',
                        customMessage: 'Munícipes e operadores só podem acessar seus próprios dados.'
                    });
                }

                const data = await this.repository.buscarPorID(idParam);
                return data;
            }

            // Secretário pode acessar outro usuário somente se compartilhar alguma secretaria
            if (nivel.secretario) {
                const usuarioPesquisado = await this.repository.buscarPorID(idParam);

                const secretariasUsuarioLogado = (usuarioLogado?.secretarias).map(s => s.toString());
                const secretariasUsuarioPesquisado = (usuarioPesquisado?.secretarias).map(s => s.toString());

                const temAcesso = secretariasUsuarioPesquisado.some(sec => secretariasUsuarioLogado.includes(sec));

                if (!temAcesso) {
                    throw new CustomError({
                        statusCode: HttpStatusCodes.FORBIDDEN.code,
                        errorType: 'permissionError',
                        customMessage: 'Secretários só podem acessar usuários da mesma secretaria.'
                    });
                }
                return usuarioPesquisado;
            }

            // Administrador ou outros perfis podem buscar por id livremente
            const dataById = await this.repository.buscarPorID(idParam);
            return dataById;
        }

        // Sem id: listagem
        // Munícipe e Operador só podem listar (no caso) seus próprios dados
        if (nivel.municipe || nivel.operador) {
            const data = await this.repository.buscarPorID(usuarioID);
            return data;
        }

        // Secretário: limita a listagem às secretarias do usuário logado
        if (nivel.secretario) {
            const secretariasDoLogado = (usuarioLogado?.secretarias).map(s => s._id?.toString?.() || s.toString());
            req.query.secretaria = secretariasDoLogado;

            const requestedNivel = req.query.nivel_acesso;

            // Se pediu especificamente por secretarios, retorna apenas o próprio usuário
            if (requestedNivel === 'secretario') {
                const unico = await this.repository.buscarPorID(usuarioID);
                // Monta estrutura paginada compatível com o retorno padrão
                const paginated = {
                    docs: [typeof unico.toObject === 'function' ? unico.toObject() : unico],
                    totalDocs: 1,
                    limit: 1,
                    page: 1,
                    totalPages: 1,
                    pagingCounter: 1,
                    hasPrevPage: false,
                    hasNextPage: false,
                    prevPage: null,
                    nextPage: null
                };
                return paginated;
            }

            // Por padrão ou se pediu por 'operador', traz apenas operadores das secretarias do logado
            if (!requestedNivel) {
                req.query.nivel_acesso = 'operador';
            }

            const resultado = await this.repository.listar(req);

            // Filtra qualquer secretário que não seja o próprio usuário (evita vazamento de outros secretários)
            if (resultado && Array.isArray(resultado.docs)) {
                const docsFiltered = resultado.docs.filter(doc => {
                    const isSecretario = !!(doc.nivel_acesso && doc.nivel_acesso.secretario);
                    const isSelf = String(doc._id) === String(usuarioID);
                    return !(isSecretario && !isSelf);
                });

                // Se o próprio usuário não estiver presente, adiciona-o no topo
                const containsSelf = docsFiltered.some(d => String(d._id) === String(usuarioID));
                if (!containsSelf) {
                    const self = await this.repository.buscarPorID(usuarioID);
                    const selfObj = typeof self.toObject === 'function' ? self.toObject() : self;
                    docsFiltered.unshift(selfObj);
                    resultado.totalDocs = (resultado.totalDocs || 0) + 1;
                }

                resultado.docs = docsFiltered;
            }

            return resultado;
        }

        const data = await this.repository.listar(req);
        return data;
    }

    async criar(parsedData, req) {

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        const nivel = usuarioLogado.nivel_acesso;

        if (nivel.municipe) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Munícipes não podem criar usuários."
            });
        }

        //valida email único
        await this.validateEmail(parsedData.email);

        //gerar senha hash
        if (parsedData.senha) {
            const {
                senha: senhaValidada
            } = await AuthHelper.hashPassword(parsedData.senha);
            parsedData.senha = senhaValidada;
        }

        //chama o repositório
        const data = await this.repository.criar(parsedData);
        return data;
    }

    async criarComSenha(parsedData) {

        delete parsedData.grupo;
        delete parsedData.nivel_acesso;

        await this.validateEmail(parsedData.email);

        if (parsedData.senha) {
            const {
                senha: senhaValidada
            } = await AuthHelper.hashPassword(parsedData.senha);
            parsedData.senha = senhaValidada;
        }

        parsedData.nivel_acesso = {
            municipe: true,
            operador: false,
            secretario: false,
            administrador: false
        };

        const grupo = await this.grupoRepository.buscarPorNome("Municipe");
        if (grupo) {
            parsedData.grupo = grupo._id;
        }

        const data = await this.repository.criar(parsedData);

        delete data.senha

        return data;
    }

    async atualizar(id, parsedData, req) {

        delete parsedData.email;
        delete parsedData.senha;

        await this.ensureUserExists(id);

        const usuario = await this.repository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const isAdmin = nivel.administrador;

        const atualizarOutroUser = String(usuario._id) !== String(id);

        if (!isAdmin && atualizarOutroUser) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você não tem permissões para atualizar outro usuário."
            });
        }

        if (!isAdmin) {
            delete parsedData.grupo;
            delete parsedData.nivel_acesso;
            delete parsedData.secretarias;
        }

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async deletar(id, req) {

        const usuario = await this.repository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const usuarioID = usuario._id;

        await this.ensureUserExists(id);

        if (nivel.municipe) {
            if (usuarioID.toString() !== id.toString()) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.FORBIDDEN.code,
                    errorType: 'permissionError',
                    field: 'Usuário',
                    details: [],
                    customMessage: "Munícipes só podem deletar seus próprios dados."
                });
            }
        }

        const data = await this.repository.deletar(id)
        return data;
    }

    async atualizarFoto(id, parsedData, req) {
        await this.ensureUserExists(id);
        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }
    
    // ================================
    // MÉTODOS UTILITÁRIOS
    // ================================
    async validateEmail(email, id = null) {
        const usuarioExistente = await this.repository.buscarPorEmail(email, id);
        if (usuarioExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'email',
                details: [{
                    path: 'email',
                    message: 'Email já está em uso.'
                }],
                customMessage: 'Email já cadastrado.',
            });
        }
    }

    async ensureUserExists(id) {
        const usuarioExistente = await this.repository.buscarPorID(id);

        if (!usuarioExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'resourceNotFound',
                field: 'Usuário',
                details: [],
                customMessage: 'Usuário não encontrado.'
            });
        }

        return usuarioExistente;
    }

    /**
     * Processa e faz upload da foto para MinIO, atualiza o usuário e retorna metadados.
     */
    async processarFoto(userId, file, req) {
        // Verificar permissões antes de processar upload
        const usuario = await this.ensureUserExists(userId);

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        const nivel = usuarioLogado.nivel_acesso;

        if (nivel.administrador && String(usuarioLogado._id) !== String(userId)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você só pode atualizar a sua própria foto."
            });
        }

        const imagemAntiga = usuario.link_imagem;

        // Usa o método centralizado que substitui a imagem (upload nova + delete antiga)
        const { url, metadata } = await this.uploadService.substituirFoto(file, imagemAntiga);

        const dados = {
            link_imagem: url
        };
        UsuarioUpdateSchema.parse(dados);

        try {
            await this.atualizarFoto(userId, dados, req);
        } catch (error) {
            // Se falhar ao atualizar DB, deletar do MinIO
            await this.uploadService.deleteFoto(url);
            throw error;
        }

        return {
            fileName: url,
            metadata
        };
    }

    /**
     * Deleta a foto de um usuário.
     */
    async deletarFoto(userId, req) {
        await this.ensureUserExists(userId);

        const usuarioLogado = await this.repository.buscarPorID(req.user_id);
        const nivel = usuarioLogado.nivel_acesso;

        if (nivel.administrador && String(usuarioLogado._id) !== String(userId)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você só pode deletar a sua própria foto."
            });
        }

        const usuario = await this.repository.buscarPorID(userId);
        const fileName = usuario.link_imagem;

        if (!fileName) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'link_imagem',
                customMessage: 'Foto do usuário não encontrada.'
            });
        }

        // Atualizar no banco primeiro
        const dados = { link_imagem: "" };
        UsuarioUpdateSchema.parse(dados);
        await this.repository.atualizar(userId, dados);

        // Deletar do MinIO
        await this.uploadService.deleteFoto(fileName);
    }

}

export default UsuarioService;