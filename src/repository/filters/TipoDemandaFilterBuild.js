// src/repositories/filters/TipoDemandaFilterBuild.js

import TipoDemanda from '../../models/TipoDemanda.js'
import TipoDemandaRepository from '../TipoDemandaRepository.js';

class TipoDemandaFilterBuild {
    constructor() {
        this.filtros = {};
        this.TipoDemandaRepository = new TipoDemandaRepository();
        this.TipoDemandaModel = new TipoDemanda()
    }

    /**
     * Normaliza o nome do tipo para corresponder aos valores do banco
     */
    normalizarTipo(tipo) {
        const tipoLower = tipo.toLowerCase();
        const mapeamento = {
            'arvores': 'Árvores',
            'árvores': 'Árvores',
            'coleta': 'Coleta',
            'iluminacao': 'Iluminação',
            'iluminação': 'Iluminação',
            'pavimentacao': 'Pavimentação',
            'pavimentação': 'Pavimentação',
            'saneamento': 'Saneamento',
            'animais': 'Animais'
        };
        
        return mapeamento[tipoLower] || tipo;
    }

    comTitulo(titulo) {
        if (titulo) {
            this.filtros.titulo = {
                $regex: titulo,
                $options: 'i'
            };
        }
        return this;
    }

    comTipo(tipo) {
        if (tipo) {
            // Normaliza o tipo para corresponder ao valor no banco
            const tipoNormalizado = this.normalizarTipo(tipo);
            // Busca exata case-insensitive para tipos de demanda
            this.filtros.tipo = {
                $regex: `^${tipoNormalizado}$`,
                $options: 'i'
            };
        }
        return this;
    }

    build() {
        return this.filtros;
    }
}

export default TipoDemandaFilterBuild;