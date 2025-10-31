// src/utils/validators/schemas/zod/querys/DemandaQuerySchema.js

import {
    z
} from "zod";
import mongoose from 'mongoose';
import {
    enderecoSchema
} from "../DemandaSchema.js";

export const TipoDemandaEnum = z.enum([
    "Coleta",
    "Iluminação",
    "Saneamento",
    "Árvores",
    "Animais",
    "Pavimentação"
]);

// Função para normalizar string: remover acentos e converter para minúsculo
const normalizeString = (str) => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
};

// Enum normalizado para validação
const normalizedTipoValues = TipoDemandaEnum.options.map(val => normalizeString(val));

export const TipoDemandaQueryEnum = z.string()
    .transform((val) => normalizeString(val))
    .refine((val) => normalizedTipoValues.includes(val), {
        message: "Tipo inválido. Valores aceitos: Coleta, Iluminação, Saneamento, Árvores, Animais, Pavimentação"
    })
    .transform((val) => {
        // Retornar o valor original do enum correspondente
        const index = normalizedTipoValues.indexOf(val);
        return TipoDemandaEnum.options[index];
    });

export const StatusDemandaEnum = z.enum([
    "Em aberto",
    "Em andamento",
    "Concluída",
    "Recusada"
]);

export const DemandaIdSchema = z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
    message: "ID inválido",
});

export const DemandaQuerySchema = z.object({
    tipo: TipoDemandaQueryEnum
        .optional(),
    status: StatusDemandaEnum
        .optional(),
    data_inicio: z
        .string()
        .optional(),
    data_fim: z
        .string()
        .optional(),
    usuarios: z
        .string()
        .optional()
        .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
            message: "Usuário inválido. Tente novamente!",
        }),
    secretarias: z
        .string()
        .optional()
        .refine((val) => !val || mongoose.Types.ObjectId.isValid(val), {
            message: "Secretaria inválida. Tente novamente!",
        }),
    endereco: enderecoSchema
        .optional(),
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => Number.isInteger(val) && val > 0, {
            message: "Page deve ser um número inteiro maior que 0",
        }),
    limite: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 10))
        .refine((val) => Number.isInteger(val) && val > 0 && val <= 100, {
            message: "Limite deve ser um número inteiro entre 1 e 100",
        }),
});