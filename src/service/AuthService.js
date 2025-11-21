// /src/services/AuthService.js

import jwt from 'jsonwebtoken';
import {
    CommonResponse,
    CustomError,
    HttpStatusCodes,
    errorHandler,
    messages,
    StatusService,
    asyncWrapper
} from '../utils/helpers/index.js';
import tokenUtil from '../utils/TokenUtil.js';
import bcrypt from 'bcrypt';
import { enviarEmail } from '../utils/mailClient.js';
import { emailRecover, emailBoasVindasMunicipe } from '../utils/templates/emailTemplates.js';
import AuthHelper from '../utils/AuthHelper.js';

import UsuarioRepository from "../repository/UsuarioRepository.js";

class AuthService {
    constructor(params = {}) {
        const {
            tokenUtil: injectedToken
        } = params;
        this.TokenUtil = injectedToken || tokenUtil;
        this.repository = new UsuarioRepository();
    }

    async carregatokens(id, token) {
        const data = await this.repository.buscarPorID(id, {
            includeTokens: true
        })
        return {
            data
        };
    }

    async login(body) {
        // Busca por email, username, CPF ou CNPJ
        const userEncontrado = await this.repository.buscarPorIdentificador(body.identificador);
        if (!userEncontrado) {
            throw new CustomError({
                statusCode: 401,
                errorType: 'notFound',
                field: "Identificador",
                details: [],
                customMessage: messages.error.unauthorized("Credenciais inválidas")
            })
        }

        const senhaValida = await bcrypt.compare(body.senha, userEncontrado.senha);
        if (!senhaValida) {
            throw new CustomError({
                statusCode: 401,
                errorType: 'notFound',
                field: 'Senha',
                details: [],
                customMessage: messages.error.unauthorized('Credenciais inválidas')
            })
        }

        console.log('Login attempt - User:', {
            email: userEncontrado.email,
            nivel_acesso: userEncontrado.nivel_acesso,
            email_verificado: userEncontrado.email_verificado,
            isMunicipe: userEncontrado.nivel_acesso?.municipe
        });

        // Verificar se o email foi verificado (apenas para munícipes)
        if (userEncontrado.nivel_acesso?.municipe && !userEncontrado.email_verificado) {
            throw new CustomError({
                statusCode: 403,
                errorType: 'emailNotVerified',
                field: 'Email',
                details: [],
                customMessage: 'Email não verificado. Por favor, verifique seu email antes de fazer login.'
            })
        }

        // Gerar novo access token com instância injetada
        const accessToken = await this.TokenUtil.generateAccessToken(userEncontrado._id);

        // Buscar user com os tokens já armazenados
        const userComToken = await this.repository.buscarPorID(userEncontrado._id, true);
        let refreshtoken = userComToken.refreshtoken;

        if (refreshtoken) {
            try {
                jwt.verify(refreshtoken, process.env.JWT_SECRET_REFRESH_TOKEN);
            } catch (error) {
                if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
                    refreshtoken = await this.TokenUtil.generateRefreshToken(userEncontrado._id);
                } else {
                    throw new CustomError({
                        statusCode: 500,
                        errorType: "ServerError",
                        field: "Token",
                        details: [],
                        customMessage: messages.error.unauthorized('Falha na criação do token')
                    })
                }
            }
        } else {
            refreshtoken = await this.TokenUtil.generateRefreshToken(userEncontrado._id)
        }

        await this.repository.armazenarTokens(userEncontrado._id, accessToken, refreshtoken);

        // Busca o usuário atualizado por ID em vez de email
        const userLogado = await this.repository.buscarPorID(userEncontrado._id, false);
        delete userLogado.senha;

        const userObject = userLogado.toObject();

        return {
            user: {
                accessToken,
                refreshtoken,
                ...userObject
            }
        }

    }

    async logout(id) {
        const data = await this.repository.removerTokens(id);
        return {
            data
        };
    }

    async revoke(id) {
        const data = await this.repository.removerTokens(id);
        return {
            data
        };
    }

    async refresh(id, token) {
        const userEncontrado = await this.repository.buscarPorID(id, {
            includeTokens: true
        });

        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Token',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        }

        if (userEncontrado.refreshtoken !== token) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'invalidToken',
                field: 'Token',
                details: [],
                customMessage: messages.error.unauthorized('Token')
            });
        }


        // Gerar novo access token utilizando a instância injetada
        const accesstoken = await this.TokenUtil.generateAccessToken(id);

        /**
         * Se SINGLE_SESSION_REFRESH_TOKEN for true, gera um novo refresh token
         * Senão, mantém o token armazenado
         */
        let refreshtoken = '';
        if (process.env.SINGLE_SESSION_REFRESH_TOKEN === 'true') {
            refreshtoken = await this.TokenUtil.generateRefreshToken(id);
        } else {
            refreshtoken = userEncontrado.refreshtoken;
        }

        // Atualiza o usuário com os novos tokens
        await this.repository.armazenarTokens(id, accesstoken, refreshtoken);

        // Monta o objeto de usuário com os tokens para resposta
        const userLogado = await this.repository.buscarPorID(id, {
            includeTokens: true
        });
        delete userLogado.senha;
        const userObjeto = userLogado.toObject();

        const userComTokens = {
            accesstoken,
            refreshtoken,
            ...userObjeto
        };

        return {
            user: userComTokens
        };
    }

    // RecuperaSenhaService.js
    async recuperaSenha(body) {
        // ───────────────────────────────────────────────
        // Passo 1 – Buscar usuário pelo e-mail informado
        // ───────────────────────────────────────────────
        const userEncontrado = await this.repository.buscarPorEmail(body.email);

        // Se não encontrar, lança erro 404
        if (!userEncontrado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Email',
                details: [],
                customMessage: HttpStatusCodes.NOT_FOUND.message
            });
        }

        // ───────────────────────────────────────────────
        // Passo 2 – Gerar token único (JWT) p/ recuperação
        // ───────────────────────────────────────────────
        const tokenUnico =
            await this.TokenUtil.generatePasswordRecoveryToken(userEncontrado._id);

        // ───────────────────────────────────────────────
        // Passo 3 – Persistir token no usuário
        // ───────────────────────────────────────────────
        const expMs = Date.now() + 60 * 60 * 1000; // 1 hora de expiração
        const data = await this.repository.atualizar(userEncontrado._id, {
            tokenUnico,
            exp_codigo_recupera_senha: new Date(expMs)
        });

        if (!data) {
            // Falha ao atualizar → erro 500
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                field: 'Recuperação de Senha',
                details: [],
                customMessage: HttpStatusCodes.INTERNAL_SERVER_ERROR.message
            });
        }

        // ───────────────────────────────────────────────
        // Passo 4 – Enviar e-mail com o link de recuperação
        // ───────────────────────────────────────────────
        await enviarEmail(emailRecover({
            nome: userEncontrado.nome,
            email: userEncontrado.email,
            token: tokenUnico
        }));

        // ───────────────────────────────────────────────
        // Passo 5 – Retornar resposta ao cliente
        // ───────────────────────────────────────────────
        return {
            message: 'Solicitação de recuperação de senha recebida. Um e-mail foi enviado com instruções.'
        };
    }

    /**
     * Atualiza a senha do próprio usuário em um cenário NÃO autenticado:
     */
    async atualizarSenhaToken(tokenRecuperacao, senhaBody) {
        // 1) Decodifica o token para obter o ID do usuário
        const usuarioId = await this.TokenUtil.decodePasswordRecoveryToken(
            tokenRecuperacao,
            process.env.JWT_SECRET_PASSWORD_RECOVERY
        );

        // 2) Buscar usuário pelo token unico
        const usuario = await this.repository.buscarPorTokenUnico(tokenRecuperacao);
        if (!usuario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                field: 'Token',
                details: [],
                customMessage: "Token de recuperação já foi utilizado ou é inválido."
            });
        }

        // 3) Verifica expiração
        if (usuario.exp_codigo_recupera_senha < new Date()) {
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                field: 'Token de Recuperação',
                details: [],
                customMessage: 'Token de recuperação expirado.'
            });
        }

        // 4) Gera o hash da senha pura
        const senhaHasheada = await AuthHelper.hashPassword(senhaBody.senha);

        // 5) Atualiza no repositório (já com hash)
        const usuarioAtualizado = await this.repository.atualizarSenha(usuarioId, senhaHasheada);
        if (!usuarioAtualizado) {
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                field: 'Senha',
                details: [],
                customMessage: 'Erro ao atualizar a senha.'
            });
        }

        return { message: 'Senha atualizada com sucesso.' };
    }

    // Verificar email do usuário usando token
    async verificarEmail(token) {
        console.log('Verificação de email - Token recebido:', token);
        
        // Buscar usuário pelo token de verificação
        const usuario = await this.repository.buscarPorTokenVerificacao(token);
        
        console.log('Usuário encontrado:', usuario ? {
            id: usuario._id,
            email: usuario.email,
            token_verificacao_email: usuario.token_verificacao_email,
            exp_token_verificacao_email: usuario.exp_token_verificacao_email,
            email_verificado: usuario.email_verificado
        } : 'null');
        
        if (!usuario) {
            throw new CustomError({
                statusCode: HttpStatusCodes.NOT_FOUND.code,
                errorType: 'notFound',
                field: 'Token',
                details: [],
                customMessage: 'Token de verificação inválido ou já utilizado.'
            });
        }

        // Verificar se o token expirou
        const dataExpiracao = usuario.get('exp_token_verificacao_email', null, { getters: false });
        const dataAtual = new Date();
        
        console.log('   Verificação de expiração:');
        console.log('  - Data de expiração (original):', dataExpiracao);
        console.log('  - Data atual:', dataAtual);
        console.log('  - Token expirado?', dataExpiracao < dataAtual);

        if (dataExpiracao < dataAtual) {
            console.log('Token expirado, gerando novo token e reenviando email...');
            
            // Gerar novo token
            const novoToken = await AuthHelper.generateRandomToken();
            const novaExpiracao = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
            
            // Atualizar no banco
            await this.repository.atualizarTokenVerificacao(usuario._id, novoToken, novaExpiracao);
            
            // Enviar novo email
            const linkVerificacao = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verificar-email?token=${novoToken}`;
            const emailData = emailBoasVindasMunicipe({
                nome: usuario.nome,
                email: usuario.email,
                linkVerificacao
            });
            
            await enviarEmail(emailData);
            
            console.log('Novo email de verificação enviado para:', usuario.email);
            
            throw new CustomError({
                statusCode: HttpStatusCodes.UNAUTHORIZED.code,
                errorType: 'tokenExpired',
                field: 'Token',
                details: [],
                customMessage: 'Token de verificação expirado. Enviamos um novo link para seu email. Verifique sua caixa de entrada.'
            });
        }

        // Atualizar usuário: marcar email como verificado e limpar token
        const usuarioAtualizado = await this.repository.atualizarVerificacaoEmail(usuario._id);
        
        console.log('Email verificado com sucesso para:', usuarioAtualizado.email);

        return {
            message: 'Email verificado com sucesso!',
            email: usuarioAtualizado.email
        };
    }

}

export default AuthService;

