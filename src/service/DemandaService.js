// /src/services/DemandaService.js

import DemandaRepository from "../repository/DemandaRepository.js";
import CustomError from "../utils/helpers/CustomError.js";
import UsuarioRepository from "../repository/UsuarioRepository.js";
import SecretariaRepository from "../repository/SecretariaRepository.js";
import UploadService from "./UploadService.js";
import {
    DemandaSchema,
    DemandaUpdateSchema
} from '../utils/validators/schemas/zod/DemandaSchema.js';
import HttpStatusCodes from "../utils/helpers/HttpStatusCodes.js";

class DemandaService {
    constructor() {
        this.repository = new DemandaRepository()
        this.userRepository = new UsuarioRepository()
        this.secretariaRepository = new SecretariaRepository()
        this.uploadService = new UploadService()
    }

    async listar(req) {
        const {
            id
        } = req.params;

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        // Verificar se é a rota /meus
        if (req.path.includes('/meus')) {
            const repoReqMeus = { params: req.params };
            repoReqMeus.query = {
                ...(req.query || {}),
                ...(nivel?.municipe ? { usuario: usuario._id.toString() } : {})
            };

            const data = await this.repository.listar(repoReqMeus);
            
            // Aplicar filtro específico para "meus pedidos"
            if (nivel && nivel.municipe) {
                const userId = usuario._id.toString();
                
                data.docs = data.docs.filter(demanda => {
                    const demandaUsuarios = (demanda.usuarios || []).map(user => user._id.toString());
                    return demandaUsuarios.includes(userId);
                });
                
            } else if (nivel && nivel.secretario) {
                const secretariasUsuario = usuario.secretarias?.map(s => s._id.toString());
                data.docs = data.docs.filter(demanda => {
                    const secretariasDemanda = (demanda.secretarias || []).map(s => s._id.toString());
                    return secretariasDemanda.some(id => secretariasUsuario.includes(id));
                });
            } else if (nivel && nivel.operador) {
                const secretariasUsuario = usuario.secretarias?.map(s => s._id.toString());
                const userId = usuario._id.toString();
                data.docs = data.docs.filter(demanda => {
                    const secretariasDemanda = (demanda.secretarias || []).map(s => s._id.toString());
                    const demandaUsuarios = (demanda.usuarios || []).map(user => user._id.toString());
                    return secretariasDemanda.some(id => secretariasUsuario.includes(id)) && demandaUsuarios.includes(userId);
                });
            }
            
            return data;
        }

        if (id) {
            let data = await this.repository.buscarPorID(id);
            
            // Aplicar filtros de permissão também para busca por ID
            if (nivel && nivel.secretario) {
                const secretariasUsuario = usuario.secretarias?.map(s => s._id.toString());
                const secretariasDemanda = (data.secretarias || []).map(s => s._id.toString());
                const temPermissao = secretariasDemanda.some(id => secretariasUsuario.includes(id));
                
                if (!temPermissao) {
                    throw new CustomError({
                        statusCode: HttpStatusCodes.FORBIDDEN.code,
                        errorType: 'permissionError',
                        field: 'Demanda',
                        details: [],
                        customMessage: "Você não tem permissão para acessar essa demanda."
                    });
                }
            }

            if (nivel && nivel.operador) {
                const secretariasUsuario = usuario.secretarias?.map(s => s._id.toString());
                const userId = usuario._id.toString();
                const secretariasDemanda = (data.secretarias || []).map(s => s._id.toString());
                const demandaUsuarios = (data.usuarios || []).map(user => user._id.toString());
                const temPermissao = secretariasDemanda.some(id => secretariasUsuario.includes(id)) && demandaUsuarios.includes(userId);
                
                if (!temPermissao) {
                    throw new CustomError({
                        statusCode: HttpStatusCodes.FORBIDDEN.code,
                        errorType: 'permissionError',
                        field: 'Demanda',
                        details: [],
                        customMessage: "Você não tem permissão para acessar essa demanda."
                    });
                }
            }

            if (nivel && nivel.municipe) {
                const userId = usuario._id.toString();
                const demandaUsuarios = (data.usuarios || []).map(user => user._id.toString());
                const temPermissao = demandaUsuarios.includes(userId);
                
                if (!temPermissao) {
                    throw new CustomError({
                        statusCode: HttpStatusCodes.FORBIDDEN.code,
                        errorType: 'permissionError',
                        field: 'Demanda',
                        details: [],
                        customMessage: "Você não tem permissão para acessar essa demanda."
                    });
                }
            }

            if (!nivel || (!nivel.administrador && !nivel.secretario && !nivel.operador && !nivel.municipe)) {
                data = await this.filtrarDemandaPorUser(data, usuario);
            }

            return data;
        }

        const repoReq = { params: req.params };
        repoReq.query = {
            ...(req.query || {}),
            ...(nivel?.municipe ? { usuario: usuario._id.toString() } : {})
        };

        // Se for operador e não houver filtro de usuario explícito,
        // pedir ao repository que filtre por usuário para que a paginação
        // seja aplicada no nível do banco (evita páginas vazias após filtro)
        if (nivel?.operador && !req.query?.usuario) {
            repoReq.query.usuario = usuario._id.toString();
        }
        
        // Para secretários, se não houver filtro de secretaria explícito na query,
        // adicionar os IDs das secretarias do usuário diretamente
        if (nivel?.secretario && usuario.secretarias?.length > 0 && !req.query?.secretaria) {
            const secretariasIDs = usuario.secretarias.map(s => s._id.toString());
            // Passar como array de IDs para o repository montar o filtro
            repoReq.query.secretaria = secretariasIDs;
        }

        const data = await this.repository.listar(repoReq);

        // Remover filtro manual pós-query para secretários quando não há filtro explícito
        // pois agora está sendo feito no repository
        if (nivel && nivel.secretario && req.query?.secretaria) {
            // Apenas filtrar se houver filtro explícito de secretaria
            const secretariasUsuario = usuario.secretarias?.map(s => s._id.toString());

            data.docs = data.docs.filter(demanda => {
                const secretariasDemanda = (demanda.secretarias || []).map(s => s._id.toString());
                return secretariasDemanda.some(id => secretariasUsuario.includes(id));
            });
            
            // Atualizar o totalDocs para refletir o número filtrado
            data.totalDocs = data.docs.length;
        }

        if (nivel && nivel.operador) {
            const secretariasUsuario = (usuario.secretarias || []).map(s => s._id ? s._id.toString() : (typeof s === 'string' ? s : String(s)));
            const userId = usuario._id.toString();

            data.docs = data.docs.filter(demanda => {
                const demandaUsuarios = (demanda.usuarios || []).map(user => user._id ? user._id.toString() : (typeof user === 'string' ? user : String(user)));
                // Operador deve ver apenas as demandas que foram atribuídas a ele
                return demandaUsuarios.includes(userId);
            });
        }

        if (nivel && nivel.municipe) {
            const userId = usuario._id.toString()

            data.docs = data.docs.filter(demanda => {
                const demandaUsuarios = (demanda.usuarios || []).map(user => user._id.toString());
                return demandaUsuarios.includes(userId);
            })
        }

        if (!nivel || (!nivel.administrador && !nivel.secretario && !nivel.operador && !nivel.municipe)) {
            data.docs = await Promise.all(
                data.docs.map(demanda => this.filtrarDemandaPorUser(demanda, usuario))
            );
        }

        return data;
    }


    async criar(parsedData, req) {

        const usuario = await this.userRepository.buscarPorID(req.user_id)
        const nivel = usuario?.nivel_acesso;

        if (nivel && nivel.operador) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Somente os munícipes podem criar uma demanda através dessa rota."
            });
        }

        if (nivel && nivel.municipe) {
            const secretaria = await this.secretariaRepository.buscarPorTipo(parsedData.tipo);

            parsedData.usuarios = [req.user_id]
            delete parsedData.feedback;
            delete parsedData.avaliacao_resolucao;
            delete parsedData.resolucao;
            delete parsedData.motivo_devolucao;
            delete parsedData.link_imagem_resolucao;

            parsedData.secretarias = [secretaria._id];
        }

        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData, req) {

        this.removerCampos(parsedData, ["tipo", "data"]);

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        const demanda = await this.repository.buscarPorID(id);

        if (!nivel || (!nivel.municipe && !nivel.administrador)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Somente os munícipes podem atualizar uma demanda através dessa rota."
            });
        }

        delete parsedData.resolucao;
        delete parsedData.motivo_devolucao;
        delete parsedData.link_imagem_resolucao;

        await this.ensureDemandaExists(id);

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async atribuir(id, parsedData, req) {

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        if (!nivel || !nivel.secretario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Apenas secretários podem atribuir operadores a uma demanda."
            });
        }

        const demanda = await this.repository.buscarPorID(id);
        const secretariasUsuario = (usuario?.secretarias).map(s => s._id.toString());
        const secretariasDemanda = (demanda?.secretarias).map(s => s._id.toString());

        const permited = secretariasDemanda.some(id => secretariasUsuario.includes(id));
        if (!permited) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você não tem permissão para atribuir essa demanda."
            });
        }

        if (!parsedData.usuarios || parsedData.usuarios.length === 0) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'Usuários',
                details: [],
                customMessage: "Você deve informar pelo menos um usuário operador para atribuir."
            });
        }

        const usuariosParaAssociar = await this.userRepository.buscarPorIDs(parsedData.usuarios);
        const todosSaoOperadores = usuariosParaAssociar.every(user => user.nivel_acesso?.operador);

        if (!todosSaoOperadores) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'Usuários',
                details: [],
                customMessage: "Só é possível associar usuários do tipo operador."
            });
        }

        const usuariosExistentes = await this.userRepository.buscarPorIDs(
            (demanda?.usuarios).map(u => u._id)
        );

        const usuariosMunicipes = usuariosExistentes
            .filter(user => user.nivel_acesso?.municipe)
            .map(user => user._id.toString());

        const usuariosFinais = new Set([
            ...parsedData.usuarios.map(id => id.toString()),
            ...usuariosMunicipes
        ]);

        await this.ensureDemandaExists(id);

        this.manterCampos(parsedData, ['usuarios'])

        const data = await this.repository.atribuir(id, {
            usuarios: Array.from(usuariosFinais),
            status: "Em andamento"
        });

        return data;
    }

    async devolver(id, parsedData, req) {

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const userId = usuario._id.toString();

        // Permitir operadores, administradores e secretários (com regras distintas)
        if (!nivel || (!nivel.operador && !nivel.administrador && !nivel.secretario)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                customMessage: "Você não tem permissão para devolver uma demanda."
            });
        }

        const demanda = await this.repository.buscarPorID(id);

        // Se for secretário: ele pode devolver (recusar) a demanda da sua secretaria
        if (nivel && nivel.secretario) {
            const secretariasUsuario = (usuario?.secretarias).map(s => s._id?.toString?.() || s.toString());
            const secretariasDemanda = (demanda?.secretarias || []).map(s => s._id?.toString?.() || s.toString());

            const permited = secretariasDemanda.some(sec => secretariasUsuario.includes(sec));
            if (!permited) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.FORBIDDEN.code,
                    errorType: 'permissionError',
                    field: 'Usuário',
                    details: [],
                    customMessage: "Você não tem permissão para devolver/recusar essa demanda."
                });
            }

            // Motivo de rejeição é obrigatório quando secretário recusa
            if (!parsedData.motivo_rejeicao || String(parsedData.motivo_rejeicao).trim() === '') {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'motivo_rejeicao',
                    details: [],
                    customMessage: 'Motivo da rejeição é obrigatório quando a devolução é feita por um secretário.'
                });
            }

            this.manterCampos(parsedData, ['motivo_rejeicao']);

            const data = await this.repository.devolver(id, {
                motivo_rejeicao: parsedData.motivo_rejeicao,
                status: 'Recusada'
            });

            return data;
        }

        // Se for operador (ou admin usando mesma rota): comportamento anterior para operador
        if ((nivel && nivel.operador) || (nivel && nivel.administrador)) {
            const usuariosDemanda = demanda?.usuarios || [];

            const novaListaUsuarios = usuariosDemanda.filter(u => u._id.toString() !== userId);

            this.manterCampos(parsedData, ['motivo_devolucao']);

            const data = await this.repository.devolver(id, {
                motivo_devolucao: parsedData.motivo_devolucao,
                usuarios: novaListaUsuarios,
                status: "Em aberto"
            });

            return data;
        }
    }

    async resolver(id, parsedData, req) {

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        if (!nivel || (!nivel.operador && !nivel.administrador)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                customMessage: "Apenas operadores podem resolver uma demanda."
            });
        }

        const demanda = await this.repository.buscarPorID(id);

        this.manterCampos(parsedData, ["link_imagem_resolucao", "resolucao"])

        // Validar que a descrição da resolução é obrigatória
        if (!parsedData.resolucao || parsedData.resolucao.trim() === '') {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'resolucao',
                details: [],
                customMessage: "A descrição da resolução é obrigatória para resolver uma demanda."
            });
        }

        const data = await this.repository.resolver(id, {
            link_imagem_resolucao: parsedData.link_imagem_resolucao || "",
            resolucao: parsedData.resolucao,
            motivo_devolucao: "",
            status: "Concluída"
        });

        return data;
    }

    async atualizarFoto(id, parsedData, req) {
        await this.ensureDemandaExists(id);
        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    async deletar(id, req) {

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        const demanda = await this.repository.buscarPorID(id);

        const userId = usuario._id.toString();

        const usuariosDemanda = (demanda?.usuarios).map(u => u._id.toString())

        if (nivel && nivel.municipe) {
            if (!usuariosDemanda.includes(userId)) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.FORBIDDEN.code,
                    errorType: 'permissionError',
                    field: 'Usuário',
                    details: [],
                    customMessage: "Você é apenas permitido à deletar as demandas que criou."
                });
            }
        }

        await this.ensureDemandaExists(id);

        const data = await this.repository.deletar(id);
        return data;
    }

    // ================================
    // MÉTODOS UTILITÁRIOS
    // ================================
    async ensureDemandaExists(id) {
        const demandaExistente = await this.repository.buscarPorID(id);

        return demandaExistente;
    }

    async nivelAcesso(nivelAcesso) {
        const permissoes = {
            secretario: ["_id", "tipo", "status", "data", "resolucao", "feedback", "descricao", "avaliacao_resolucao", "link_imagem", "motivo_devolucao", "link_imagem_resolucao", "usuarios", "createdAt", "updatedAt", "estatisticas", "endereco"],
            administrador: ["_id", "tipo", "status", "data", "resolucao", "feedback", "descricao", "avaliacao_resolucao", "link_imagem", "motivo_devolucao", "link_imagem_resolucao", "usuarios", "secretarias", "createdAt", "updatedAt", "estatisticas", "endereco"],
            municipe: ["tipo", "_id", "status", "resolucao", "feedback", "descricao", "avaliacao_resolucao", "link_imagem_resolucao", "link_imagem", "endereco", "createdAt", "updatedAt", "estatisticas"],
            operador: ["_id", "tipo", "status", "data", "resolucao", "feedback", "descricao", "avaliacao_resolucao", "link_imagem", "motivo_devolucao", "link_imagem_resolucao", "createdAt", "updatedAt", "estatisticas", "endereco"]
        };

        const niveis = ['administrador', 'secretario', 'operador', 'municipe'];

        const nivelAtivo = niveis.find(nivel => nivelAcesso && nivelAcesso[nivel]);

        return permissoes[nivelAtivo] || [];
    }

    async filtrarDemandaPorUser(demanda, usuario) {
        const camposPermitidos = await this.nivelAcesso(usuario?.nivel_acesso);

        Object.keys(demanda).forEach(campo => {
            if (!camposPermitidos.includes(campo)) {
                delete demanda[campo];
            }
        });

        return demanda;
    }

    removerCampos(obj, campos) {
        for (const campo of campos) {
            delete obj[campo];
        }
    }

    manterCampos(obj, camposPermitidos) {
        Object.keys(obj).forEach((key) => {
            if (!camposPermitidos.includes(key)) {
                delete obj[key];
            }
        });
    }

    /**
     * Processa e faz upload de foto(s) para MinIO, atualiza a demanda e retorna metadados.
     * Suporta upload único ou múltiplo.
     */
    async processarFotos(demandaId, files, tipo, req) {
        // Verificar permissões antes de processar upload
        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const userId = usuario._id.toString();

        const demanda = await this.repository.buscarPorID(demandaId);
        const usuariosDemanda = (demanda?.usuarios).map(u => u._id.toString());

        const isAdmin = nivel && nivel.administrador;
        const isMunicipe = nivel && nivel.municipe;
        const isOperador = nivel && nivel.operador;

        // Para imagem de solicitação: admin ou munícipe dono da demanda
        // Para imagem de resolução: admin ou operador atribuído à demanda
        let temPermissao = false;
        
        if (isAdmin) {
            temPermissao = true;
        } else if (tipo === "resolucao" && isOperador && usuariosDemanda.includes(userId)) {
            // Operador pode enviar imagem de resolução se estiver atribuído à demanda
            temPermissao = true;
        } else if (tipo === "solicitacao" && isMunicipe && usuariosDemanda.includes(userId)) {
            // Munícipe pode enviar imagem de solicitação se for dono da demanda
            temPermissao = true;
        }

        if (!temPermissao) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você não tem permissão para atualizar a imagem dessa demanda."
            });
        }

        // Define dinamicamente o campo a ser atualizado
        const campo = tipo === "resolucao" ? "link_imagem_resolucao" : "link_imagem";
        const imagensAntigas = demanda[campo] || [];

        // Usa o método para múltiplas imagens que substitui todas (upload novas + delete antigas)
        const { urls, metadados } = await this.uploadService.substituirMultiplasFotos(files, imagensAntigas);

        const dados = {
            [campo]: urls
        };

        DemandaUpdateSchema.parse(dados);

        try {
            await this.atualizarFoto(demandaId, dados, req);
        } catch (error) {
            // Se falhar ao atualizar DB, deletar todas as novas do MinIO
            for (const url of urls) {
                await this.uploadService.deleteFoto(url).catch(err => 
                    console.error('Erro ao deletar arquivo durante rollback:', err)
                );
            }
            throw error;
        }

        return {
            urls,
            metadados
        };
    }

    /**
     * Deleta todas as fotos de uma demanda (solicitação ou resolução).
     */
    async deletarFoto(demandaId, tipo, req) {
        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const userId = usuario._id.toString();

        const demanda = await this.repository.buscarPorID(demandaId);
        const usuariosDemanda = (demanda?.usuarios).map(u => u._id.toString());

        const isAdmin = nivel && nivel.administrador;
        const isMunicipe = nivel && nivel.municipe;
        const isOperador = nivel && nivel.operador;

        // Para imagem de solicitação: admin ou munícipe dono da demanda
        // Para imagem de resolução: admin ou operador atribuído à demanda
        let temPermissao = false;
        
        if (isAdmin) {
            temPermissao = true;
        } else if (tipo === "resolucao" && isOperador && usuariosDemanda.includes(userId)) {
            // Operador pode deletar imagem de resolução se estiver atribuído à demanda
            temPermissao = true;
        } else if (tipo === "solicitacao" && isMunicipe && usuariosDemanda.includes(userId)) {
            // Munícipe pode deletar imagem de solicitação se for dono da demanda
            temPermissao = true;
        }

        if (!temPermissao) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Você não tem permissão para deletar a imagem dessa demanda."
            });
        }

        const campo = tipo === "resolucao" ? "link_imagem_resolucao" : "link_imagem";
        const imagens = demanda[campo] || [];

        if (!imagens || imagens.length === 0) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: campo,
                customMessage: `Nenhuma imagem de ${tipo} encontrada.`
            });
        }

        // Atualizar no banco primeiro (limpar array)
        const dados = { [campo]: [] };
        DemandaUpdateSchema.parse(dados);
        await this.repository.atualizar(demandaId, dados);

        // Deletar todas do MinIO
        for (const imagem of imagens) {
            if (imagem && imagem !== "") {
                await this.uploadService.deleteFoto(imagem).catch(err =>
                    console.error('Erro ao deletar imagem:', err)
                );
            }
        }
    }

}

export default DemandaService;