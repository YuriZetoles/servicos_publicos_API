// /src/services/TipoDemandaService.js

import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import TipoDemandaRepository from '../repository/TipoDemandaRepository.js';
import {
    TipoDemandaUpdateSchema
} from '../utils/validators/schemas/zod/TipoDemandaSchema.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import UploadService from './UploadService.js';


class TipoDemandaService {
    constructor() {
        this.repository = new TipoDemandaRepository();
        this.userRepository = new UsuarioRepository();
        this.uploadService = new UploadService();
    }

    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

    async criar(parsedData, req) {

        parsedData.usuarios = [req.user_id]
        //validar nome unico e tipo
        await this.validarTitulo(parsedData.titulo);
        await this.validarTipo(parsedData.tipo);
        //chama o repositório
        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData) {

        await this.ensureTipoDemandaExists(id);

        if (parsedData.titulo) {
            await this.validarTitulo(parsedData.titulo, id);
        }
        if (parsedData.tipo) {
            await this.validarTipo(parsedData.tipo);
        }
        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }


    async deletar(id) {

        await this.ensureTipoDemandaExists(id);

        const data = await this.repository.deletar(id)
        return data;
    }

    // ================================
    // MÉTODOS UTILITÁRIOS
    // ================================
    async atualizarFoto(id, parsedData, req) {
        await this.ensureTipoDemandaExists(id);

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const userId = usuario._id.toString();

        const tipoDemanda = await this.repository.buscarPorID(id);
        const usuariosTipoDemanda = (tipoDemanda?.usuarios).map(u => u._id.toString());

        const isAdmin = nivel.administrador;
        const isSecretario = nivel.secretario;

        if (!(isAdmin || (isSecretario && usuariosTipoDemanda.includes(userId)))) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'TipoDemanda',
                details: [],
                customMessage: "Você não tem permissão para atualizar a imagem dessa demanda."
            });
        }

        await this.ensureTipoDemandaExists(id);

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }

    /**
     * Processa e faz upload da foto para MinIO, atualiza o tipo demanda e retorna metadados.
    */
    async processarFoto(tipoDemandaId, file, req) {
        const { url, metadata } = await this.uploadService.processarFoto(file);

        const dados = {
            link_imagem: url
        };
        TipoDemandaUpdateSchema.parse(dados);
        await this.atualizarFoto(tipoDemandaId, dados, req);

        return {
            fileName: url,
            metadata
        };
    }

    async validarTipo(tipo) {
        const tiposPermitidos = [
            'Coleta',
            'Iluminação',
            'Saneamento',
            'Árvores',
            'Animais',
            'Pavimentação'
        ];
        
        if (!tiposPermitidos.includes(tipo)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'tipo',
                details: [{
                    path: 'tipo',
                    message: 'Tipo inválido. Valores permitidos: Coleta, Iluminação, Saneamento, Árvores, Animais, Pavimentação.'
                }],
                customMessage: 'Tipo de demanda não é válido.',
            });
        }
    }

    async ensureTipoDemandaExists(id) {
        const TipoDemandaExistente = await this.repository.buscarPorID(id);
        if (!TipoDemandaExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'TipoDemanda',
                details: [],
                customMessage: messages.error.resourceNotFound('TipoDemanda'),
            });
        }

        return TipoDemandaExistente;
    }

    async validarTitulo(titulo, id = null) {
        const TipoDemandaExistente = await this.repository.buscarPorTitulo(titulo, id);
        if (TipoDemandaExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'titulo',
                details: [{
                    path: 'titulo',
                    message: 'Titulo já está em uso.'
                }],
                customMessage: 'Titulo já cadastrado.',
            });
        }
    }

    /**
     * Deleta a foto de um Tipo Demanda.
     */
    async deletarFoto(tipoDemandaId, req) {
        await this.ensureTipoDemandaExists(tipoDemandaId);

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;

        if (!nivel.administrador) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'Usuário',
                details: [],
                customMessage: "Apenas administradores podem deletar fotos de tipos de demanda."
            });
        }

        const tipoDemanda = await this.repository.buscarPorID(tipoDemandaId);
        const fileName = tipoDemanda.link_imagem;

        if (!fileName) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'link_imagem',
                customMessage: 'Foto do tipo demanda não encontrada.'
            });
        }

        // Deletar do MinIO
        await this.uploadService.deleteFoto(fileName);

        // Atualizar no banco
        const dados = { link_imagem: null };
        TipoDemandaUpdateSchema.parse(dados);
        await this.repository.atualizar(tipoDemandaId, dados);
    }

}

export default TipoDemandaService;