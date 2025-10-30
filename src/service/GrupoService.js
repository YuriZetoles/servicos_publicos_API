// /src/services/GrupoService.js

import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import GrupoRepository from '../repository/GrupoRepository.js';

class GrupoService {
    constructor() {
        this.repository = new GrupoRepository();
    }

    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

    async criar(parsedData) {

        await this.validarNome(parsedData.nome);

        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData) {

        delete parsedData.email;

        await this.ensureGrupoExists(id);

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }


    async deletar(id) {

        await this.ensureGrupoExists(id);

        const data = await this.repository.deletar(id)
        return data;
    }

    async ensureGrupoExists(id) {
        const grupoExistente = await this.repository.buscarPorID(id);
        if (!grupoExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Grupo',
                details: [],
                customMessage: messages.error.resourceNotFound('Grupo'),
            });
        }

        return grupoExistente;
    }

    async validarNome(nome, id = null) {
        const grupoExistente = await this.repository.buscarPorNome(nome, id);
        if (grupoExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'nome',
                details: [{
                    path: 'nome',
                    message: 'Nome já está em uso.'
                }],
                customMessage: 'Nome já cadastrado.',
            });
        }
    }

}

export default GrupoService;