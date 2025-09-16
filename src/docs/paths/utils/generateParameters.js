// /src/docs/routes/utils/routeGenerateparameters.js

export function generateParameters(schema, baseRef = '', parentKey = '') {
  const params = [];
  const properties = schema.properties || {};

  for (const [key, value] of Object.entries(properties)) {
    // Se value estiver indefinido, pula para o próximo
    if (!value) continue;

    const paramName = parentKey ? `${parentKey}.${key}` : key;

    if (value.type === 'object' && value.properties) {
      params.push(...generateParameters(value, baseRef, paramName));
    } else {
      params.push({
        name: paramName,
        in: 'query',
        required: false,
        schema: value, // Use o schema diretamente em vez de $ref
        description: `Filtro por ${paramName}`
      });
    }
  }
  return params;
}