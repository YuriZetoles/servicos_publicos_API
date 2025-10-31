// src/routes/authRoutes.js

import express from 'express';
import AuthController from '../controllers/AuthController.js';
import UsuarioController from '../controllers/UsuarioController.js';
import {
    asyncWrapper
} from '../utils/helpers/index.js';
import { strictRateLimit } from '../middlewares/RateLimitMiddleware.js';

const router = express.Router();

const authController = new AuthController();
const usuarioController = new UsuarioController();

router
    .post("/login", strictRateLimit, asyncWrapper(authController.login.bind(authController)))
    .post("/logout", asyncWrapper(authController.logout.bind(authController)))
    .post("/revoke", asyncWrapper(authController.revoke.bind(authController)))
    .post("/refresh", asyncWrapper(authController.refresh.bind(authController)))
    .post("/recover", strictRateLimit, asyncWrapper(authController.recuperaSenha.bind(authController)))
    .post("/introspect", asyncWrapper(authController.pass.bind(authController)))
    .post("/signup", strictRateLimit, asyncWrapper(usuarioController.criarComSenha.bind(usuarioController)))

export default router;