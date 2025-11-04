// src/models/Demanda.js

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import brazilianDatePlugin from "../utils/helpers/mongooseBrazilianDatePlugin.js";

class Demanda {
    constructor() {
        const demandaSchema = new mongoose.Schema({
            tipo: {
                type: String,
                enum: ["Coleta", "Iluminação", "Saneamento", "Árvores", "Animais", "Pavimentação"]
            },
            status: {
                type: String,
                enum: ["Em aberto", "Em andamento", "Concluída", "Recusada"],
                default: "Em aberto"
            },
            data: {
                type: Date,
                default: new Date()
            },
            resolucao: {
                type: String
            },
            feedback: {
                type: Number
            },
            avaliacao_resolucao: {
                type: String
            },
            link_imagem: {
                type: String
            },
            descricao: {
                type: String
            },
            motivo_devolucao: {
                type: String
            },
            motivo_rejeicao: {
                type: String
            },
            link_imagem_resolucao: {
                type: String
            },
            endereco: {
                logradouro: {
                    type: String
                },
                cep: {
                    type: String
                },
                bairro: {
                    type: String
                },
                numero: {
                    type: String
                },
                complemento: {
                    type: String
                },
            },

            //referência para usuários
            usuarios: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'usuarios'
            }],

            secretarias: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'secretarias',
            }]
        }, {
            timestamps: true,
            versionKey: false
        });

        demandaSchema.plugin(mongoosePaginate);
        demandaSchema.plugin(brazilianDatePlugin);
        this.model = mongoose.model('demandas', demandaSchema);
    }
}

export default new Demanda().model;