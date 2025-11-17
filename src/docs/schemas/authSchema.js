// src/docs/schemas/authSchema.js

import {
  generateExample
} from '../utils/schemaGenerate.js';
import {
  estadosBrasil
} from '../../models/Usuario.js';

const authSchemas = {
  RespostaRecuperaSenha: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem indicando o status da recuperação de senha",
        example: "Solicitação de recuperação de senha recebida. Um e-mail foi enviado com instruções."
      }
    },
  },
  RequisicaoRecuperaSenha: {
    type: "object",
    properties: {
      email: {
        type: "string",
        format: "email",
        description: "Endereço de email do usuário para recuperação de senha",
        example: "usuario@exemplo.com"
      }
    },
    required: ["email"],
    example: {
      email: "usuario@exemplo.com"
    }
  },
  RequisicaoRedefinirSenha: {
    type: "object",
    properties: {
      senha: {
        type: "string",
        description: "Nova senha do usuário (mínimo 8 caracteres, deve conter maiúsculas, minúsculas, números e caracteres especiais)",
        example: "NovaSenha@123",
        minLength: 8
      }
    },
    required: ["senha"],
    example: {
      senha: "NovaSenha@123"
    }
  },
  RespostaRedefinirSenha: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "Mensagem confirmando a redefinição de senha",
        example: "Senha atualizada com sucesso."
      }
    }
  },
  loginPost: {
    type: "object",
    properties: {
      identificador: {
        type: "string",
        description: "Identificador do usuário (email, username, CPF ou CNPJ)"
      },
      senha: {
        type: "string",
        description: "Senha do usuário"
      }
    },
    required: ["identificador", "senha"],
    example: {
      identificador: "admin@exemplo.com",
      senha: "Senha@123"
    }
  },
  RespostaPass: {
    type: "object",
    properties: {
      active: {
        type: "boolean",
        description: "Indica se o token ainda é válido (não expirado)",
        example: true
      },
      client_id: {
        type: "string",
        description: "ID do cliente OAuth",
        example: "1234567890abcdef"
      },
      token_type: {
        type: "string",
        description: "Tipo de token, conforme RFC 6749",
        example: "Bearer"
      },
      exp: {
        type: "string",
        description: "Timestamp UNIX de expiração do token",
        example: 1672531199
      },
      iat: {
        type: "string",
        description: "Timestamp UNIX de emissão do token",
        example: 1672527600
      },
      nbf: {
        type: "string",
        description: "Timestamp UNIX de início de validade do token",
        example: 1672527600
      }
    }
  },
  signupPost: {
    type: "object",
    properties: {
      nome: {
        type: "string",
        description: "Nome do usuário",
        example: "João Silva"
      },
      email: {
        type: "string",
        format: "email",
        description: "Email do usuário",
        example: "joao.silva@exemplo.com"
      },
      senha: {
        type: "string",
        description: "Senha do usuário",
        example: "Senha@123"
      },
      cpf: {
        type: "string",
        description: "CPF do usuário",
        example: "12345678901"
      },
      cnh: {
        type: "string",
        description: "CNH do usuário",
        example: "98765432100"
      },
      data_nascimento: {
        type: "string",
        format: "date",
        description: "Data de nascimento do usuário no formato DD/MM/YYYY",
        example: "15/01/1990"
      },
      celular: {
        type: "string",
        description: "Celular do usuário",
        example: "69999998888"
      },
      endereco: {
        type: "object",
        properties: {
          logradouro: {
            type: "string",
            example: "Rua das Flores"
          },
          cep: {
            type: "string",
            example: "76800-000"
          },
          bairro: {
            type: "string",
            example: "Centro"
          },
          numero: {
            type: "number",
            example: 1234
          },
          complemento: {
            type: "string",
            example: "Apto 202"
          },
          cidade: {
            type: "string",
            example: "Porto Velho"
          },
          estado: {
            type: "string",
            enum: estadosBrasil,
            example: "RO"
          }
        },
        required: ["logradouro", "cep", "bairro", "numero", "cidade", "estado"]
      }
    },
    required: ["nome", "email", "senha", "cpf", "cnh", "data_nascimento", "endereco"],
    example: {
      nome: "João Silva",
      email: "joao.silva@exemplo.com",
      senha: "Senha@123",
      cpf: "12345678901",
      cnh: "98765432100",
      data_nascimento: "15/01/1990",
      celular: "69999998888",
      endereco: {
        logradouro: "Rua das Flores",
        cep: "76800-000",
        bairro: "Centro",
        numero: 1234,
        complemento: "Apto 202",
        cidade: "Porto Velho",
        estado: "RO"
      }
    }
  }
};

const addExamples = async () => {
  for (const key of Object.keys(authSchemas)) {
    // Pula signupPost porque já tem exemplo completo definido manualmente
    if (key === 'signupPost') continue;
    
    const schema = authSchemas[key];
    if (schema.properties) {
      for (const [propKey, propertySchema] of Object.entries(schema.properties)) {
        if (!propertySchema.example) {
          propertySchema.example = await generateExample(propertySchema, propKey);
        }
      }
    }
    if (!schema.example) {
      schema.example = await generateExample(schema);
    }
  }
};

await addExamples();

export default authSchemas;