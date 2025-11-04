// src/models/Secretaria.js

import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import brazilianDatePlugin from "../utils/helpers/mongooseBrazilianDatePlugin.js";

class Secretaria {
    constructor() {
        const secretariaSchema = new mongoose.Schema({
                nome: {
                    type: String
                },
                sigla: {
                    type: String
                },
                email: {
                    type: String
                },
                telefone: {
                    type: String
                },
                tipo: {
                    type: String
                }
            },

            {
                timestamps: true,
                versionKey: false
            }
        );

        secretariaSchema.plugin(mongoosePaginate);
        secretariaSchema.plugin(brazilianDatePlugin);
        this.model = mongoose.model('secretarias', secretariaSchema);
    }
}

export default new Secretaria().model;