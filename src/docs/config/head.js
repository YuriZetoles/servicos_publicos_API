// src/docs/config/head.js

// Função para obter as opções do Swagger
const getServersInCorrectOrder = () => {
    const prodUrl = {
        url: process.env.SWAGGER_PROD_URL || `http://localhost:5011/servicos`
    };
    const devUrl = {
        url: process.env.SWAGGER_DEV_URL || "http://localhost:5011"
    };

    if (process.env.NODE_ENV === "development") return [devUrl, prodUrl];
    else return [prodUrl, devUrl];
};


const getSwaggerOptions = async () => {
    const t = process.env.NODE_ENV === 'development' ? `?t=${Date.now()}` : '';
    const usuarioPaths = (await import(new URL("../paths/usuario.js",
        import.meta.url).href + t)).default;
    const usuarioSchemas = (await import(new URL("../schemas/usuarioSchema.js",
        import.meta.url).href + t)).default;
    const tipoDemandaPaths = (await import(new URL("../paths/tipoDemanda.js",
        import.meta.url).href + t)).default;
    const tipoDemandaSchemas = (await import(new URL("../schemas/tipoDemandaSchema.js",
        import.meta.url).href + t)).default;
    const secretariaPaths = (await import(new URL("../paths/secretaria.js",
        import.meta.url).href + t)).default;
    const secretariaSchemas = (await import(new URL("../schemas/secretariaSchema.js",
        import.meta.url).href + t)).default;
    const gruposPaths = (await import(new URL("../paths/grupos.js",
        import.meta.url).href + t)).default;
    const grupoSchemas = (await import(new URL("../schemas/gruposSchema.js",
        import.meta.url).href + t)).default;
    const authPaths = (await import(new URL("../paths/auth.js",
        import.meta.url).href + t)).default;
    const authSchemas = (await import(new URL("../schemas/authSchema.js",
        import.meta.url).href + t)).default;
    const demandaPaths = (await import(new URL("../paths/demanda.js",
        import.meta.url).href + t)).default;
    const demandaSchemas = (await import(new URL("../schemas/demandaSchema.js",
        import.meta.url).href + t)).default;

    return {
        swaggerDefinition: {
            openapi: "3.0.0",
            info: {
                title: "API de Serviços Públicos",
                version: "1.0.0",
                description: "Documentação da API para gerenciamento de serviços públicos",
                contact: {
                    name: "Serviços Públicos",
                    email: "servicosPublicos@ifro.edu.br",
                },
            },
            servers: getServersInCorrectOrder(),
            tags: [{
                    name: "Auth",
                    description: "Rotas para autenticação e autorização"
                },
                {
                    name: "Usuários",
                    description: "Rotas para o gerenciamento de usuarios"
                },
                {
                    name: "Demandas",
                    description: "Rotas para o gerenciamento de demandas"
                },
                {
                    name: "TipoDemanda",
                    description: "Rotas para o gerenciamento de tipoDemanda"
                },
                {
                    name: "Secretaria",
                    description: "Rotas para o gerenciamento das secretarias"
                },
                {
                    name: "Grupos",
                    description: "Rotas para gestão de grupos"
                }
            ],
            paths: {
                ...authPaths,
                ...usuarioPaths,
                ...demandaPaths,
                ...gruposPaths,
                ...tipoDemandaPaths,
                ...secretariaPaths,
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT"
                    }
                },
                schemas: {
                    ...authSchemas,
                    ...usuarioSchemas,
                    ...demandaSchemas,
                    ...grupoSchemas,
                    ...tipoDemandaSchemas,
                    ...secretariaSchemas
                }
            },
            security: [{
                bearerAuth: []
            }]
        },
        apis: ["./src/routes/*.js"]
    };
};

export default getSwaggerOptions;