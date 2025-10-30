import UploadService from '../service/UploadService.js';
import CommonResponse from '../../utils/helpers/CommonResponse.js';
import CustomError from '../../utils/helpers/CustomError.js';
import HttpStatusCodes from '../../utils/helpers/HttpStatusCodes.js';
import path from 'path';

class UploadController {
    constructor() {
        this.uploadService = new UploadService();
    }

    /**
     * Faz upload de uma foto para uma demanda.
     * @param {Object} req - Requisição Express.
     * @param {Object} res - Resposta Express.
     * @param {Function} next - Próximo middleware.
     */
    async uploadFotoDemanda(req, res, next) {
        try {
            const { id, tipo } = req.params;
            const file = req.files?.file;
            if (!file) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file',
                    customMessage: 'Nenhum arquivo enviado.'
                });
            }

            const { url, metadata } = await this.uploadService.processarFoto(file);

            return CommonResponse.success(res, {
                message: 'Arquivo enviado com sucesso.',
                dados: {
                    [`link_imagem${tipo === "resolucao" ? "_resolucao" : ""}`]: url
                },
                metadados: metadata
            });
        } catch (error) {
            console.error('Erro no uploadFotoDemanda:', error);
            return next(error);
        }
    }

    /**
     * Faz upload de uma foto para um usuário.
     */
    async uploadFotoUsuario(req, res, next) {
        try {
            const { id } = req.params;
            const file = req.files?.file;
            if (!file) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file',
                    customMessage: 'Nenhum arquivo enviado.'
                });
            }

            const { url, metadata } = await this.uploadService.processarFoto(file);

            return CommonResponse.success(res, {
                message: 'Arquivo enviado com sucesso.',
                dados: {
                    link_imagem: url
                },
                metadados: metadata
            });
        } catch (error) {
            console.error('Erro no uploadFotoUsuario:', error);
            return next(error);
        }
    }

    /**
     * Faz upload de uma foto para um tipo demanda.
     */
    async uploadFotoTipoDemanda(req, res, next) {
        try {
            const { id } = req.params;
            const file = req.files?.file;
            if (!file) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file',
                    customMessage: 'Nenhum arquivo enviado.'
                });
            }

            const { url, metadata } = await this.uploadService.processarFoto(file);

            return CommonResponse.success(res, {
                message: 'Arquivo enviado com sucesso.',
                dados: {
                    link_imagem: url
                },
                metadados: metadata
            });
        } catch (error) {
            console.error('Erro no uploadFotoTipoDemanda:', error);
            return next(error);
        }
    }
}

export default UploadController;
