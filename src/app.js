// src/app.js

import cors from "cors";
import helmet from "helmet";
import errorHandler from './utils/helpers/errorHandler.js';
import logger from './utils/logger.js';
import DbConnect from './config/dbConnect.js';
import setupMinio from './config/setupMinio.js';
import routes from './routes/index.js';
import CommonResponse from './utils/helpers/CommonResponse.js';
import express from "express";
import expressFileUpload from 'express-fileupload';
import compression from 'compression';
import { authRateLimit, publicRateLimit } from './middlewares/RateLimitMiddleware.js';

const app = express();

await DbConnect.conectar();
await setupMinio();

// Middlewares de segurança
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
        }
    }
}));

// Habilitando CORS
app.use(cors());

// Habilitando a compressão de respostas
app.use(compression());

// Habilitando o uso de json pelo express
app.use(express.json());

// Habilitando o uso de arquivos pelo express
app.use(expressFileUpload());

// Habilitando o uso de urlencoded pelo express
app.use(express.urlencoded({ extended: true }));

// Rate limiting para endpoints públicos (antes da autenticação)
app.use('/api/auth', publicRateLimit);

// Rate limiting para endpoints autenticados
app.use('/api', authRateLimit);

// Passando para o arquivo de rotas o app
routes(app);

// Middleware para lidar com rotas não encontradas (404)
app.use((req, res, next) => {
    return CommonResponse.error(
        res,
        404,
        'resourceNotFound',
        null,
        [{
            message: 'Rota não encontrada.'
        }]
    );
});

// Listener para erros não tratados (opcional, mas recomendado)
process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Não finalizar o processo para evitar interrupção da API
});

process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
    // Não finalizar o processo para evitar interrupção da API
    // Considerar reiniciar a aplicação em caso de exceções críticas
});

// Middleware de Tratamento de Erros (deve ser adicionado após as rotas)
app.use(errorHandler);

// Exportando para o server.js fazer uso
export default app;