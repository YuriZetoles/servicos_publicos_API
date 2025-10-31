// /src/services/SecretariaService.js

import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import SecretariaRepository from '../repository/SecretariaRepository.js';

class SecretariaService {
    constructor() {
        this.repository = new SecretariaRepository();
    }

    async listar(req) {
        const data = await this.repository.listar(req);
        return data;
    }

    async criar(parsedData) {

        //validar nome unico 
        await this.validarNome(parsedData.nome);
        //chama o repositório
        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData) {

        delete parsedData.email;

        await this.ensureSecretariaExists(id);
        await this.validarNome(parsedData.nome);

        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }


    async deletar(id) {

        await this.ensureSecretariaExists(id);

        const data = await this.repository.deletar(id)
        return data;
    }

    async ensureSecretariaExists(id) {
        const secretariaExistente = await this.repository.buscarPorID(id);
        if (!secretariaExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'Secretaria',
                details: [],
                customMessage: messages.error.resourceNotFound('Secretaria'),
            });
        }

        return secretariaExistente;
    }

    async validarNome(nome, id = null) {
        const secretariaExistente = await this.repository.buscarPorNome(nome, id);
        if (secretariaExistente) {
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

export default SecretariaService;