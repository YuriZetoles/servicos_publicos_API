// src/middlewares/RateLimitMiddleware.js

import rateLimit from 'express-rate-limit';
import CommonResponse from '../utils/helpers/CommonResponse.js';
import HttpStatusCodes from '../utils/helpers/HttpStatusCodes.js';

// Rate limiter geral para todas as rotas autenticadas
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições por janela
  message: {
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
    data: null,
    errors: [{
      path: 'rate_limit',
      message: 'Limite de requisições excedido. Aguarde 15 minutos.'
    }]
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  // Handler personalizado para erros de rate limit
  handler: (req, res) => {
    return CommonResponse.error(
      res,
      HttpStatusCodes.TOO_MANY_REQUESTS.code,
      'validationError',
      'rate_limit',
      [{
        path: 'rate_limit',
        message: 'Limite de requisições excedido. Aguarde 15 minutos.'
      }],
      'Muitas requisições. Tente novamente em 15 minutos.'
    );
  },
  // Pula rate limit para admins (se necessário)
  skip: (req) => {
    // Pode ser implementado para pular rate limit para admins
    return false;
  }
});

// Rate limiter mais restritivo para operações sensíveis (login, upload, etc.)
export const strictRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos
  max: 15, // Limite de 15 requisições por janela
  message: {
    message: 'Muitas tentativas. Tente novamente em 5 minutos.',
    data: null,
    errors: [{
      path: 'rate_limit',
      message: 'Limite de requisições sensíveis excedido. Aguarde 5 minutos.'
    }]
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return CommonResponse.error(
      res,
      HttpStatusCodes.TOO_MANY_REQUESTS.code,
      'validationError',
      'rate_limit',
      [{
        path: 'rate_limit',
        message: 'Limite de requisições sensíveis excedido. Aguarde 5 minutos.'
      }],
      'Muitas tentativas. Tente novamente em 5 minutos.'
    );
  }
});

// Rate limiter específico para uploads (mais restritivo)
export const uploadRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 20, // Limite de 20 uploads por hora
  message: {
    message: 'Limite de uploads excedido. Tente novamente em 1 hora.',
    data: null,
    errors: [{
      path: 'upload_limit',
      message: 'Limite de uploads por hora excedido. Máximo 20 uploads/hora.'
    }]
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return CommonResponse.error(
      res,
      HttpStatusCodes.TOO_MANY_REQUESTS.code,
      'validationError',
      'upload_limit',
      [{
        path: 'upload_limit',
        message: 'Limite de uploads por hora excedido. Máximo 20 uploads/hora.'
      }],
      'Limite de uploads excedido. Tente novamente em 1 hora.'
    );
  }
});

// Rate limiter para endpoints públicos (menos restritivo)
export const publicRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 50, // Limite de 50 requisições por janela
  message: {
    message: 'Muitas requisições. Tente novamente em 15 minutos.',
    data: null,
    errors: [{
      path: 'rate_limit',
      message: 'Limite de requisições públicas excedido.'
    }]
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return CommonResponse.error(
      res,
      HttpStatusCodes.TOO_MANY_REQUESTS.code,
      'validationError',
      'rate_limit',
      [{
        path: 'rate_limit',
        message: 'Limite de requisições públicas excedido.'
      }],
      'Muitas requisições. Tente novamente em 15 minutos.'
    );
  }
});