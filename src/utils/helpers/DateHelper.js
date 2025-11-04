// src/utils/helpers/DateHelper.js

/**
 * Helper para manipulação de datas no formato brasileiro
 */
class DateHelper {
    /**
     * Converte data do formato brasileiro (DD/MM/AAAA) para ISO (AAAA-MM-DD)
     * @param {string} dataBR - Data no formato DD/MM/AAAA
     * @returns {string} Data no formato AAAA-MM-DD
     */
    static brToIso(dataBR) {
        if (!dataBR) return null;
        
        const [dia, mes, ano] = dataBR.split('/');
        return `${ano}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
    }

    /**
     * Converte data do formato ISO (AAAA-MM-DD) para brasileiro (DD/MM/AAAA)
     * @param {string|Date} dataIso - Data no formato ISO ou objeto Date
     * @returns {string} Data no formato DD/MM/AAAA
     */
    static isoToBr(dataIso) {
        if (!dataIso) return null;
        
        let date;
        if (typeof dataIso === 'string') {
            // Se for string no formato AAAA-MM-DD, extrair manualmente para evitar problemas de timezone
            const [ano, mes, dia] = dataIso.split('T')[0].split('-');
            date = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
        } else {
            date = new Date(dataIso);
        }
        
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Valida se a data está no formato brasileiro (DD/MM/AAAA)
     * @param {string} dataBR - Data no formato DD/MM/AAAA
     * @returns {boolean}
     */
    static isValidBrFormat(dataBR) {
        if (!dataBR) return false;
        
        const regex = /^(0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
        if (!regex.test(dataBR)) return false;
        
        const [dia, mes, ano] = dataBR.split('/').map(Number);
        const date = new Date(ano, mes - 1, dia);
        
        return date.getDate() === dia && 
               date.getMonth() === mes - 1 && 
               date.getFullYear() === ano;
    }

    /**
     * Valida se o usuário tem pelo menos 18 anos
     * @param {string} dataNascimento - Data de nascimento no formato DD/MM/AAAA
     * @returns {boolean}
     */
    static isMaiorDeIdade(dataNascimento) {
        if (!dataNascimento) return false;
        
        const hoje = new Date();
        const [dia, mes, ano] = dataNascimento.split('/').map(Number);
        const nascimento = new Date(ano, mes - 1, dia);
        
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mesAtual = hoje.getMonth();
        const diaAtual = hoje.getDate();
        
        if (mesAtual < mes - 1 || (mesAtual === mes - 1 && diaAtual < dia)) {
            idade--;
        }
        
        return idade >= 18;
    }

    /**
     * Converte objeto Date para formato brasileiro
     * @param {Date} date - Objeto Date
     * @returns {string} Data no formato DD/MM/AAAA
     */
    static dateToBr(date) {
        if (!date || !(date instanceof Date)) return null;
        
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0');
        const ano = date.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
    }

    /**
     * Converte string de data brasileira para objeto Date
     * @param {string} dataBR - Data no formato DD/MM/AAAA
     * @returns {Date}
     */
    static brToDate(dataBR) {
        if (!dataBR) return null;
        
        const [dia, mes, ano] = dataBR.split('/').map(Number);
        return new Date(ano, mes - 1, dia);
    }
}

export default DateHelper;
