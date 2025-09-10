// /src/controllers/TipoDemandaController.js

import TipoDemandaService from "../service/TipoDemandaService.js";
import {
    TipoDemandaUpdateSchema,
    TipoDemandaSchema
} from '../utils/validators/schemas/zod/TipoDemandaSchema.js';
import {
    TipoDemandaQuerySchema,
    TipoDemandaIDSchema
} from '../utils/validators/schemas/zod/querys/TipoDemandaQuerySchema.js';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';

// Importações necessárias para o upload de arquivos
import path from 'path';
import {
    fileURLToPath
} from 'url';
// Helper para __dirname em módulo ES
const getDirname = () => path.dirname(fileURLToPath(
    import.meta.url));


class TipoDemandaController {
    constructor() {
        this.service = new TipoDemandaService();
    }
    async listar(req, res) {
        console.log('Estou no listar em TipoDemandaController');

        const {
            id
        } = req.params || {}
        if (id) {
            TipoDemandaIDSchema.parse(id);
        }

        //Validação das queries (se existirem)
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            // deve apenas validar o objeto query, tendo erro o zod será responsável por lançar o erro
            await TipoDemandaQuerySchema.parseAsync(query);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);
    }

    async criar(req, res) {
        console.log('Estou no criar em TipoDemandaController');

        const parsedData = TipoDemandaSchema.parse(req.body);
        let data = await this.service.criar(parsedData, req);

        let tipoDemandaLimpo = data.toObject();

        return CommonResponse.created(res, tipoDemandaLimpo);
    }

    async atualizar(req, res) {
        console.log('Estou no atualizar em TipoDemandaController');

        const {
            id
        } = req.params;
        TipoDemandaIDSchema.parse(id);

        const parsedData = TipoDemandaUpdateSchema.parse(req.body);

        const data = await this.service.atualizar(id, parsedData);

        let tipoDemandaLimpo = data.toObject();

        delete tipoDemandaLimpo.senha;

        return CommonResponse.success(res, data, 200, 'TipoDemanda atualizada com sucesso.');
    }


    async deletar(req, res) {
        console.log('Estou no deletar em TipoDemandaController');

        const {
            id
        } = req.params || {};
        TipoDemandaIDSchema.parse(id);

        if (!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID da TipoDemanda é obrigatório para deletar.'
            });
        }

        const data = await this.service.deletar(id);
        return CommonResponse.success(res, data, 200, 'TipoDemanda excluída com sucesso.');
    }

    /**
     * Faz upload de uma foto para um usuário.
     */
    async fotoUpload(req, res, next) {
        try {
            const {
                id
            } = req.params;
            TipoDemandaIDSchema.parse(id);

            const file = req.files?.file;
            if (!file) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file',
                    details: [],
                    customMessage: 'Nenhum arquivo enviado para upload.'
                });
            }

            const {
                fileName,
                metadata
            } = await this.service.processarFoto(id, file, req);

            return CommonResponse.success(res, {
                message: 'Arquivo recebido e Tipo Demanda atualizada com sucesso.',
                dados: {
                    link_imagem: fileName
                },
                metadados: metadata
            });
        } catch (error) {
            console.error('Erro no fotoUpload:', error);
            return next(error);
        }
    }


    /**
     * Faz download da foto de um usuário.
     */
    async getFoto(req, res, next) {
        try {
            const {
                id
            } = req?.params;
            TipoDemandaIDSchema.parse(id);

            const tipoDemanda = await this.service.listar({
                params: {
                    id
                }
            });
            const {
                link_imagem
            } = tipoDemanda;

            if (!link_imagem) {
                throw new CustomError({
                    statusCode: HttpStatusCodes.NOT_FOUND.code,
                    errorType: 'notFound',
                    field: 'link_imagem',
                    details: [],
                    customMessage: "Tipo Demanda não possui foto cadastrada."
                });
            }

            const filename = link_imagem;
            const uploadDir = path.join(getDirname(), '..', '../uploads');
            const filePath = path.join(uploadDir, filename);

            const extensao = path.extname(filename).slice(1).toLowerCase();
            const mimeTypes = {
                jpg: 'image/jpeg',
                jpeg: 'image/jpeg',
                png: 'image/png',
                svg: 'image/svg+xml'
            };
            const contentType = mimeTypes[extensao] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            return res.sendFile(filePath);
        } catch (error) {
            console.error('Erro no getFoto:', error);
            return next(error);
        }
    }
}

export default TipoDemandaController;