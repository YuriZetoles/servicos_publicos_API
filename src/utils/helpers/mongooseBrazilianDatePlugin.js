// src/utils/helpers/mongooseBrazilianDatePlugin.js

/**
 * Plugin do Mongoose para formatar automaticamente todas as datas para o formato brasileiro (DD/MM/AAAA)
 * e aceitar datas brasileiras na entrada (convertendo para Date antes de salvar).
 * 
 * Aplica-se a TODOS os campos do tipo Date no schema, incluindo:
 * - Campos personalizados (data_nascimento, data_nomeacao, etc.)
 * - Timestamps automáticos (createdAt, updatedAt)
 * 
 * @example
 * // No model:
 * import brazilianDatePlugin from '../utils/helpers/mongooseBrazilianDatePlugin.js';
 * usuarioSchema.plugin(brazilianDatePlugin);
 * 
 * // Entrada aceita DD/MM/AAAA:
 * { data_nascimento: "15/03/1990" } → armazenado como Date(1990, 2, 15)
 * 
 * // Saída retorna DD/MM/AAAA:
 * usuario.data_nascimento → "15/03/1990"
 * usuario.createdAt → "04/11/2025"
 */

function brazilianDatePlugin(schema) {
  // Habilita getters no toJSON e toObject para que as datas formatadas apareçam na saída
  schema.set('toJSON', { getters: true });
  schema.set('toObject', { getters: true });
  
  // Percorre todos os campos do schema
  schema.eachPath((pathname, schematype) => {
    // Aplica apenas em campos do tipo Date
    if (schematype.instance === 'Date') {
      
      /**
       * GETTER: Converte Date → DD/MM/AAAA (para saída da API)
       * Executado automaticamente quando o campo é acessado em toJSON() ou toObject()
       */
      schematype.get(function(date) {
        if (!date) return null;
        
        // Extrai dia, mês e ano do objeto Date
        const dia = String(date.getDate()).padStart(2, '0');
        const mes = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna 0-11
        const ano = date.getFullYear();
        
        return `${dia}/${mes}/${ano}`;
      });
      
      /**
       * SETTER: Converte DD/MM/AAAA → Date (para entrada/gravação no banco)
       * Executado automaticamente quando o campo recebe um valor
       */
      schematype.set(function(value) {
        if (!value) return null;
        
        // Se já for Date, retorna direto
        if (value instanceof Date) return value;
        
        // Se for string no formato DD/MM/AAAA, converte
        if (typeof value === 'string' && value.includes('/')) {
          const [dia, mes, ano] = value.split('/').map(Number);
          return new Date(ano, mes - 1, dia); // mes - 1 porque Date usa 0-11
        }
        
        // Se for string ISO ou outro formato, deixa o Mongoose converter
        return value;
      });
    }
  });
}

export default brazilianDatePlugin;
