// /src/utils/TokenUtil.js

import jwt from 'jsonwebtoken';

class TokenUtil {
  generateAccessToken(id) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET_ACCESS_TOKEN,
        { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION || '1d' },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token);
        }
      );
    });
  }

  generateRefreshToken(id) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET_REFRESH_TOKEN,
        { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION || '7d' },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token);
        }
      );
    });
  }

  /**
   * Gera token único para recuperação de senha com validade de 1 hora (retorna Promise<string>)
   */
  generatePasswordRecoveryToken(id) {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET_PASSWORD_RECOVERY,
        { expiresIn: process.env.JWT_PASSWORD_RECOVERY_EXPIRATION || '1h' },
        (err, token) => {
          if (err) {
            return reject(err);
          }
          resolve(token);
        }
      );
    });
  }

  /**
   * Decodifica e valida o token de recuperação de senha
   * @param {string} token - Token de recuperação
   * @param {string} secret - Secret para validar o token
   * @returns {Promise<string>} ID do usuário
   */
  decodePasswordRecoveryToken(token, secret) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        resolve(decoded.id);
      });
    });
  }

}

export default new TokenUtil();
