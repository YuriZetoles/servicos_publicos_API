// src/app.js

import cors from "cors";
import helmet from "helmet";
import errorHandler from './utils/helpers/errorHandler.js';
// import logger from './utils/logger.js';
import DbConnect from './config/dbConnect.js';
import routes from './routes/index.js';
import CommonResponse from './utils/helpers/CommonResponse.js';
import express from "express";
import expressFileUpload from 'express-fileupload';
import compression from 'compression';

const app = express();

await DbConnect.conectar();

app.use(express.json()); // importante para ler JSON
app.use(expressFileUpload());
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));


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

app.use(errorHandler);

export default app;