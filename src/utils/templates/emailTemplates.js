// /src/utils/templates/emailTemplates.js

import "dotenv/config";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BASE_URL = process.env.BASE_URL || "http://localhost:5011";

// Logo 
const LOGO_URL = `${BASE_URL}/public/logo.png`;
const COR_PRIMARIA = "#2C7A9B"; // Cor principal do gradiente da logo

const FOOTER_HTML = `
  Sistema de Serviços Públicos
  <br>
  Desenvolvido pela Fábrica de Software IFRO
`;

/**
 * Template de email de boas-vindas
 * @param {Object} data - Dados do usuário (nome, email, token)
 * @returns {Object} Objeto com dados para envio do email
 */
export const emailDeBoasVindas = (data) => ({
  to: data.email,
  subject: "Bem-vindo(a) ao Sistema de Serviços Públicos!",
  template: "generico",
  data: {
    // --- Header ---
    mostrarHeader: true,
    logoUrl: LOGO_URL,
    corPrimaria: COR_PRIMARIA,
    nomeSistema: "Serviços Públicos",
    mostrarDivisor: true,

    // --- Conteúdo ---
    titulo: "Bem-vindo(a) ao Sistema!",
    nome: data.nome,
    mensagem:
      "Sua conta foi criada com sucesso e estamos felizes em ter você conosco.<br><br>Para seu primeiro acesso, só falta um passo: <strong>definir sua senha para poder acessar a plataforma!</strong>. Clique no botão abaixo para começar.",

    // --- Ação ---
    mostrarBotao: true,
    textoBotao: "Definir minha senha",
    urlBotao: `${FRONTEND_URL}/nova-senha?token=${data.token}`,
    corBotao: COR_PRIMARIA,

    // --- Footer ---
    textoFooter: FOOTER_HTML
  }
});

/**
 * Template de email de recuperação de senha
 * @param {Object} data - Dados do usuário (nome, email, token)
 * @returns {Object} Objeto com dados para envio do email
 */
export const emailRecover = (data) => ({
  to: data.email,
  subject: "Redefinição de Senha - Serviços Públicos",
  template: "generico",
  data: {
    // --- Header ---
    mostrarHeader: true,
    logoUrl: LOGO_URL,
    corPrimaria: COR_PRIMARIA,
    nomeSistema: "Serviços Públicos",

    // --- Conteúdo ---
    nome: data.nome,
    titulo: "Redefina sua senha",
    mensagem:
      "Recebemos uma solicitação para redefinir a senha da sua conta.<br><br>Se foi você, clique no botão abaixo para criar uma nova senha. Se você não fez essa solicitação, pode ignorar este e-mail com segurança.",
    textoDestaque: "Por segurança, este link expira em <strong>1 hora</strong>.",

    // --- Ação ---
    mostrarBotao: true,
    textoBotao: "Criar nova senha",
    urlBotao: `${FRONTEND_URL}/nova-senha?token=${data.token}`,
    corBotao: COR_PRIMARIA,

    // --- Footer ---
    textoFooter: FOOTER_HTML
  },
});
