// /src/controllers/DemandaController.js

import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import DemandaService from '../service/DemandaService.js';
import {
    DemandaIdSchema,
    DemandaQuerySchema
} from '../utils/validators/schemas/zod/querys/DemandaQuerySchema.js';
import {
    DemandaSchema,
    DemandaUpdateSchema
} from '../utils/validators/schemas/zod/DemandaSchema.js';

// Importações necessárias para o upload de arquivos
import path from 'path';
import {
    fileURLToPath
} from 'url';
// Helper para __dirname em módulo ES
const getDirname = () => path.dirname(fileURLToPath(
    import.meta.url));

class DemandaController {
    constructor() {
        this.service = new DemandaService();
    }

    async listar(req, res) {
        const {
            id
        } = req.params || {};

        // Verificar se é a rota /meus
        if (req.path.includes('/meus')) {
            // Para a rota /meus, não validamos ID
        } else if (id) {
            DemandaIdSchema.parse(id);
        }

        //Validação das queries (se existirem)
        const query = req.query || {};
        if (Object.keys(query).length !== 0) {
            // deve apenas validar o objeto query, tendo erro o zod será responsável por lançar o erro
            await DemandaQuerySchema.parseAsync(query);
        }

        const data = await this.service.listar(req);
        return CommonResponse.success(res, data);
    }

    async criar(req, res) {

        const parsedData = DemandaSchema.parse(req.body)
        let data = await this.service.criar(parsedData, req);

        let demandaLimpa = data.toObject();

        return CommonResponse.created(res, demandaLimpa);
    }

    async atualizar(req, res) {

        const {
            id
        } = req.params;
        DemandaIdSchema.parse(id)

        const parsedData = DemandaUpdateSchema.parse(req.body);

        const data = await this.service.atualizar(id, parsedData, req)

        let demandaLimpa = data.toObject();

        delete demandaLimpa.tipo;
        delete demandaLimpa.data;

        return CommonResponse.success(res, demandaLimpa, 200, "Demanda atualizada com sucesso!")
    }

    async atribuir(req, res) {

        const {
            id
        } = req.params;
        DemandaIdSchema.parse(id)

        const parsedData = DemandaUpdateSchema.parse(req.body);

        const data = await this.service.atribuir(id, parsedData, req)

        let demandaLimpa = data.toObject();

        return CommonResponse.success(res, demandaLimpa, 200, "Demanda atribuída com sucesso!")
    }

    async devolver(req, res) {

        const {
            id
        } = req.params;
        DemandaIdSchema.parse(id)

        const parsedData = DemandaUpdateSchema.parse(req.body);

        const data = await this.service.devolver(id, parsedData, req)

        let demandaLimpa = data.toObject();

        return CommonResponse.success(res, demandaLimpa, 200, "Demanda devolvida com sucesso!")
    }

    async resolver(req, res) {

        const {
            id
        } = req.params;
        DemandaIdSchema.parse(id)

        const parsedData = DemandaUpdateSchema.parse(req.body);

        const data = await this.service.resolver(id, parsedData, req)

        let demandaLimpa = data.toObject();

        return CommonResponse.success(res, demandaLimpa, 200, "Demanda resolvida com sucesso!")
    }

    async deletar(req, res) {

        const id = req?.params?.id;
        DemandaIdSchema.parse(id)

        if (!id) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'id',
                details: [],
                customMessage: 'ID da demanda é obrigatório para deletar.'
            });
        }

        const data = await this.service.deletar(id, req);
        return CommonResponse.success(res, data, 200, "Demanda excluída com sucesso!")
    }

    /**
     * Faz upload de uma foto para um usuário.
     */
    async fotoUpload(req, res, next) {
        const {
            id,
            tipo
        } = req.params;
        DemandaIdSchema.parse(id);

        // Normalizar tipo: remover acentos, minúsculo
        const normalizedTipo = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (!['solicitacao', 'resolucao'].includes(normalizedTipo)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'tipo',
                customMessage: 'Tipo deve ser "solicitacao" ou "resolucao".'
            });
        }

        const file = req.files?.file;
        if (!file) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'file',
                customMessage: 'Nenhum arquivo foi enviado.'
            });
        }

        const {
            fileName,
            metadata
        } = await this.service.processarFoto(id, file, normalizedTipo, req);

        return CommonResponse.success(res, {
            message: 'Arquivo enviado e salvo com sucesso.',
            dados: {
                [`link_imagem${normalizedTipo === "resolucao" ? "_resolucao" : ""}`]: fileName
            },
            metadados: metadata
        });
    }

    /**
     * Deleta a foto de uma demanda.
     */
    async fotoDelete(req, res, next) {
        const { id, tipo } = req.params;
        DemandaIdSchema.parse(id);

        // Normalizar tipo: remover acentos, minúsculo
        const normalizedTipo = tipo.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

        if (!['solicitacao', 'resolucao'].includes(normalizedTipo)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'tipo',
                customMessage: 'Tipo deve ser "solicitacao" ou "resolucao".'
            });
        }

        await this.service.deletarFoto(id, normalizedTipo, req);

        return CommonResponse.success(res, {
            message: 'Foto deletada com sucesso.'
        });
    }

}

export default DemandaController;