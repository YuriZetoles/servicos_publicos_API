// src/utils/validators/schemas/zod/LoginSchema.js

import {
    z
} from 'zod';

/** Definição da expressão regular para a senha
 * Padrão: 1 letra maiúscula, 1 letra minúscula, 1 número
 * Tamanho mínimo: 8 caracteres
 **/
const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

/** Definição de expressões regulares para validação de documentos */
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/;
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$|^\d{14}$/;

const LoginSchema = z.object({
    identificador: z
        .string()
        .min(1, 'Campo de identificação é obrigatório.')
        .refine((value) => {
            // Aceita email, CPF, CNPJ ou qualquer string (username)
            const isEmail = z.string().email().safeParse(value).success;
            const isCpf = cpfRegex.test(value);
            const isCnpj = cnpjRegex.test(value);
            const isUsername = value.length >= 3;
            
            return isEmail || isCpf || isCnpj || isUsername;
        }, {
            message: 'Identificador deve ser um email válido, CPF, CNPJ ou nome de usuário (mínimo 3 caracteres).',
        }),
    senha: z
        .string()
        .min(8, 'A senha deve ter pelo menos 8 caracteres.')
        .refine((senha) => {
            if (!senha) return true; // Senha é opcional
            return senhaRegex.test(senha);
        }, {
            message: 'A senha deve conter pelo menos 1 letra maiúscula, 1 letra minúscula, 1 número e no mínimo 8 caracteres.',
        }),
});

export {
    LoginSchema
};