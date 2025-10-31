// src/docs/paths/tipoDemanda.js

import tipoDemandaSchemas from "../schemas/tipoDemandaSchema.js";
import commonResponses from "../schemas/swaggerCommonResponses.js";
import {
    generateParameters
} from "./utils/generateParameters.js"; 

const tipoDemandaRoutes = {
    "/tipoDemanda": {
        get: {
            tags: ["TipoDemanda"],
            summary: "Lista todos os tipos Demanda",
            description: `
        + Caso de uso: Permitir que o sistema ou um usuário autorizado liste todos os tipos de demanda disponíveis no sistema.
        
        + Função de Negócio:
            - Permitir à front-end obter uma lista dos tipos de Demanda cadastrados.
            + Recebe como query parameters (opcionais):
                • filtros: titulo e/ou tipo.

        + Regras de Negócio:
            - Validar formatos e valores dos filtros fornecidos.  
            - A listagem deve ocorrer mesmo se nenhuma query (filtro) for enviada.

        + Resultado Esperado:
            - 200 OK com corpo conforme schema **tipoDemandaListagem**, contendo:
                • **items**: array de tipoDemandas. 
      `,
            security: [{
                bearerAuth: []
            }],
            parameters: generateParameters(tipoDemandaSchemas.TipoDemandaFiltro),
            responses: {
                200: commonResponses[200]("#/components/schemas/TipoDemandaListagem"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        post: {
            tags: ["TipoDemanda"],
            summary: "Cadastro de novos tipoDemanda",
            description: `
            + Caso de uso: Permitir que o administrador cadastre um novo tipo de demanda no sistema.
            
            + Função de Negócio:
                - Permitir à front-end permitir cadastrar um tipoDemanda.
                + Recebe no corpo da requisição os seguintes campos:
                    - **titulo**: titulo do tipoDemanda.
                    - **descricao**: descrição do tipoDemanda.
                    - **link_imagem**: link da imagem do tipoDemanda.
                    - **icone**: link do icone do tipoDemanda.
                    - **subdescricao**: subdescrição do tipoDemanda.
                    - **tipo**: tipo do tipoDemanda.

            + Regras de Negócio:
                - O corpo da requisição deve seguir o TipoDemandaSchema.
                - Campos obrigatórios como nome, descricao, subdescricao e tipo devem ser enviados.
                - Não deve permitir a criação de tipos de demanda com nomes duplicados.

            + Resultado Esperado:
                - HTTP 200 OK retornando a mensagem de tipo de demanda criado com sucesso e retorna os dados do registro recém-criado, incluindo seu ID.
        `,
            security: [{
                bearerAuth: []
            }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/TipoDemandaPost"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/TipoDemandaDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
    },
    "/tipoDemanda/{id}": {
        get: {
            tags: ["TipoDemanda"],
            summary: "Obtém detalhes de um tipo Demanda",
            description: `
            + Caso de uso: Consulta de detalhes de um tipoDemanda específico.
            
            + Função de Negócio:
                - Permitir à front-end obter todas as informações de um tipoDemanda cadastrado.
                + Recebe como path parameter:
                    - **id**: identificador do tipoDemanda (MongoDB ObjectId).

            + Regras de Negócio:
                - Validação do formato do ID.

            + Resultado Esperado:
                - HTTP 200 OK com corpo conforme **tipoDemandaDetalhes**, contendo dados completos do tipoDemanda.
        `,
            security: [{
                bearerAuth: []
            }],
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "string",
                }
            }],
            responses: {
                200: commonResponses[200]("#/components/schemas/TipoDemandaDetalhes"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        patch: {
            tags: ["TipoDemanda"],
            summary: "Atualização de tipoDemanda (PATCH)",
            description: `
            + Caso de uso: - Permitir que o administrador atualize parcialmente ou totalmente os dados de um tipo de demanda existente.
            
            + Função de Negócio:
                - Permitir à front-end permitir atualizar um tipoDemanda.
                + Recebe como path parameter:
                    - **id**: identificador do tipoDemanda (MongoDB ObjectId).

            + Regras de Negócio:
                - O ID deve ser validado com o TipoDemandaIDSchema.
                - Os dados enviados devem seguir o TipoDemandaUpdateSchema.
                - Não deve permitir a criação de tipos de demanda com nomes duplicados.

            + Resultado Esperado:
                - HTTP 200 OK e os dados do tipo de demanda são atualizados com sucesso e o sistema retorna os novos dados com uma mensagem de confirmação.
        `,
            security: [{
                bearerAuth: []
            }],
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "string"
                }
            }],
            requestBody: {
                content: {
                    "application/json": {
                        schema: {
                            $ref: "#/components/schemas/TipoDemandaPatch"
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]("#/components/schemas/TipoDemandaPatch"),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        delete: {
            tags: ["TipoDemanda"],
            summary: "Deleta um tipoDemanda",
            description: `
            + Caso de uso: - Permitir que o administrador exclua um tipo de demanda do sistema, caso ele não esteja vinculado a nenhuma demanda ativa.
            
            + Função de Negócio:
                - Permitir à front-end permitir atualizar um tipoDemanda.
                + Recebe como path parameter:
                    - **id**: identificador do tipoDemanda (MongoDB ObjectId).

            + Regras de Negócio:
                - O ID deve ser validado com o TipoDemandaIDSchema.
                - Caso o tipo de demanda esteja associado a demandas existentes, a exclusão deve ser impedida.
                - A existência do tipo de demanda deve ser verificada antes de excluí-lo.

            + Resultado Esperado:
                - HTTP 200 OK e o tipo de demanda é removido com sucesso do banco de dados e o sistema retorna uma mensagem de sucesso e os dados do TipoDemanda excluído.
        `,
            security: [{
                bearerAuth: []
            }],
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "string",
                }
            }],
            responses: {
                200: commonResponses[200](),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
    },
    "/tipoDemanda/{id}/foto": {
        post: {
            tags: ["TipoDemanda"],
            summary: "Faz upload da foto do tipo demanda",
            description: `
            + Caso de uso: Recebe um arquivo de imagem e faz upload para MinIO, atualizando o link_imagem do tipo demanda.
            + Função de Negócio:
                - Validar extensão (jpg, jpeg, png, svg).
                - Redimensionar para 400×400.
                - Fazer upload para MinIO e atualizar o campo link_imagem com a URL.
            + Regras de Negócio:
                - Apenas administradores podem fazer upload.
                - Garantir que o arquivo seja uma imagem válida.
            + Resultado Esperado:
                - 200 OK com mensagem de sucesso, link_imagem atualizado e metadados do arquivo.
        `,
            security: [{
                bearerAuth: []
            }],
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "string"
                }
            }, ],
            requestBody: {
                content: {
                    "multipart/form-data": {
                        schema: {
                            type: "object",
                            properties: {
                                file: {
                                    type: "string",
                                    format: "binary",
                                    description: "Arquivo de imagem a ser enviado"
                                }
                            },
                            required: ["file"]
                        }
                    }
                }
            },
            responses: {
                200: commonResponses[200]('#/components/schemas/TipoDemandaFotoPayload'),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        },
        delete: {
            tags: ["TipoDemanda"],
            summary: "Deleta a foto do tipo demanda",
            description: `
            + Caso de uso: Remove a imagem associada ao tipo demanda do MinIO e limpa o campo link_imagem.
            + Função de Negócio:
                - Verificar permissões (apenas admin).
                - Deletar arquivo do MinIO.
                - Atualizar link_imagem para null.
            + Regras de Negócio:
                - Apenas administradores podem deletar.
            + Resultado Esperado:
                - 200 OK com mensagem de sucesso.
        `,
            security: [{
                bearerAuth: []
            }],
            parameters: [{
                name: "id",
                in: "path",
                required: true,
                schema: {
                    type: "string"
                }
            }],
            responses: {
                200: commonResponses[200](),
                400: commonResponses[400](),
                401: commonResponses[401](),
                404: commonResponses[404](),
                498: commonResponses[498](),
                500: commonResponses[500]()
            }
        }
    }
};

export default tipoDemandaRoutes;