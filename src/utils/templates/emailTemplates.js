// /src/utils/templates/emailTemplates.js

import "dotenv/config";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const BASE_URL = process.env.BASE_URL || "http://localhost:5011";

// Logo 
const LOGO_URL = "https://objects.fslab.dev/fs3-public-services/452c02a9-7cdb-41f8-9fa7-705b93a27189.png";
const COR_PRIMARIA = "#2C7A9B"; // Cor principal do gradiente da logo

const FOOTER_HTML = `
  Sistema de Serviços Públicos
  <br>
  Desenvolvido pela Fábrica de Software IFRO
`;

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

/**
 * Template de email de boas-vindas para munícipe (signup)
 * @param {Object} data - Dados do usuário (nome, email, linkVerificacao)
 * @returns {Object} Objeto com dados para envio do email
 */
export const emailBoasVindasMunicipe = (data) => ({
  to: data.email,
  subject: "Bem-vindo(a) ao Sistema de Serviços Públicos de Vilhena!",
  template: "generico",
  data: {
    // --- Header ---
    mostrarHeader: true,
    logoUrl: LOGO_URL,
    corPrimaria: COR_PRIMARIA,
    nomeSistema: "Serviços Públicos",
    mostrarDivisor: true,

    // --- Conteúdo ---
    titulo: "Bem-vindo(a) ao Sistema de Serviços Públicos de Vilhena-RO!",
    nome: data.nome,
    mensagem:
      "Seja bem-vindo(a)! Estamos felizes em ter você conosco.<br><br>" +
      "O Sistema de Serviços Públicos de Vilhena foi criado para facilitar a comunicação entre você e a prefeitura, " +
      "tornando o processo de registro e acompanhamento de demandas mais transparente, rápido e eficiente.<br><br>" +
      "Aqui você pode:<br>" +
      "• Registrar demandas e solicitações<br>" +
      "• Acompanhar o andamento em tempo real<br>" +
      "• Comunicar-se diretamente com as secretarias responsáveis<br>" +
      "• Ter acesso ao histórico completo de suas solicitações<br><br>" +
      "<strong>Para começar a usar o sistema, você precisa verificar seu endereço de email.</strong><br>" +
      "Clique no botão abaixo para confirmar seu email e liberar o acesso à plataforma.",
    textoDestaque: "⚠️ Este link de verificação expira em <strong>24 horas</strong>. Verifique seu email o quanto antes!",

    // --- Ação ---
    mostrarBotao: true,
    textoBotao: "Verificar meu email",
    urlBotao: data.linkVerificacao,
    corBotao: COR_PRIMARIA,

    // --- Footer ---
    textoFooter: FOOTER_HTML
  }
});

/**
 * Template de email de boas-vindas para colaborador (cadastrado pelo admin)
 * @param {Object} data - Dados do usuário (nome, email, linkDefinirSenha, cargo)
 * @returns {Object} Objeto com dados para envio do email
 */
export const emailBoasVindasColaborador = (data) => ({
  to: data.email,
  subject: "Bem-vindo(a) à Equipe - Defina sua Senha de Acesso",
  template: "generico",
  data: {
    // --- Header ---
    mostrarHeader: true,
    logoUrl: LOGO_URL,
    corPrimaria: COR_PRIMARIA,
    nomeSistema: "Serviços Públicos",
    mostrarDivisor: true,

    // --- Conteúdo ---
    titulo: "Bem-vindo(a) à Equipe!",
    nome: data.nome,
    mensagem:
      "É um prazer tê-lo(a) em nossa equipe! Sua conta de colaborador foi criada com sucesso no Sistema de Serviços Públicos de Vilhena.<br><br>" +
      (data.cargo ? `<strong>Cargo:</strong> ${data.cargo}<br>` : "") +
      "<strong>Email de acesso:</strong> " + data.email + "<br><br>" +
      "Para começar a utilizar o sistema, você precisa definir sua senha de acesso.<br><br>" +
      "Como colaborador, você terá acesso a ferramentas de gestão de demandas, permitindo acompanhar e gerenciar as solicitações dos munícipes de forma eficiente e organizada.<br><br>" +
      "<strong>Clique no botão abaixo para criar sua senha e acessar a plataforma.</strong>",
    textoDestaque: "⚠️ Por segurança, este link expira em <strong>24 horas</strong>. Defina sua senha o quanto antes!",

    // --- Ação ---
    mostrarBotao: true,
    textoBotao: "Definir minha senha",
    urlBotao: data.linkDefinirSenha,
    corBotao: COR_PRIMARIA,

    // --- Footer ---
    textoFooter: FOOTER_HTML
  }
});
