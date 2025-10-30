// src/routes/tipoDemandaRoutes.js

import express from "express";
import TipoDemandaController from '../controllers/TipoDemandaController.js';
import {
    asyncWrapper
} from '../utils/helpers/index.js';
import AuthMiddleware from "../middlewares/AuthMiddleware.js";
import AuthPermission from "../middlewares/AuthPermission.js";

const router = express.Router();

const tipoDemandaController = new TipoDemandaController();

router
    .get("/tipoDemanda", AuthMiddleware, asyncWrapper(tipoDemandaController.listar.bind(tipoDemandaController)))
    .get("/tipoDemanda/:id", AuthMiddleware, asyncWrapper(tipoDemandaController.listar.bind(tipoDemandaController)))
    .post("/tipoDemanda", AuthMiddleware, AuthPermission, asyncWrapper(tipoDemandaController.criar.bind(tipoDemandaController)))
    .patch("/tipoDemanda/:id", AuthMiddleware, AuthPermission, asyncWrapper(tipoDemandaController.atualizar.bind(tipoDemandaController)))
    .delete("/tipoDemanda/:id", AuthMiddleware, AuthPermission, asyncWrapper(tipoDemandaController.deletar.bind(tipoDemandaController)))

    .post("/tipoDemanda/:id/foto", AuthMiddleware, AuthPermission, asyncWrapper(tipoDemandaController.fotoUpload.bind(tipoDemandaController)))
    .delete("/tipoDemanda/:id/foto", AuthMiddleware, AuthPermission, asyncWrapper(tipoDemandaController.fotoDelete.bind(tipoDemandaController)));

export default router;