// src/routes/demandaRoutes.js

import express from 'express';
import DemandaController from '../controllers/DemandaController.js';
import {
    asyncWrapper
} from '../utils/helpers/index.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from '../middlewares/AuthPermission.js';
import { uploadRateLimit } from '../middlewares/RateLimitMiddleware.js';

const router = express.Router()

const demandaController = new DemandaController();

router
    .get('/demandas', AuthMiddleware, AuthPermission, asyncWrapper(demandaController.listar.bind(demandaController)))
    .get('/demandas/:id', AuthMiddleware, AuthPermission, asyncWrapper(demandaController.listar.bind(demandaController)))
    .post('/demandas', AuthMiddleware, AuthPermission, asyncWrapper(demandaController.criar.bind(demandaController)))
    .patch("/demandas/:id", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.atualizar.bind(demandaController)))
    .patch("/demandas/:id/atribuir", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.atribuir.bind(demandaController)))
    .patch("/demandas/:id/devolver", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.devolver.bind(demandaController)))
    .patch("/demandas/:id/resolver", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.resolver.bind(demandaController)))
    .delete("/demandas/:id", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.deletar.bind(demandaController)))

    .post("/demandas/:id/foto/:tipo", AuthMiddleware, AuthPermission, uploadRateLimit, asyncWrapper(demandaController.fotoUpload.bind(demandaController)))
    .delete("/demandas/:id/foto/:tipo", AuthMiddleware, AuthPermission, asyncWrapper(demandaController.fotoDelete.bind(demandaController)));

export default router;