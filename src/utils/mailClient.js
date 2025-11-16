// /src/utils/mailClient.js

import axios from 'axios';
import 'dotenv/config';

const MailService = process.env.URL_MAIL_SERVICE;
const apiKey = process.env.MAIL_API_KEY;

/**
 * Envia um email através do serviço de mailsender
 * @param {Object} email - Objeto contendo os dados do email (to, subject, template, data)
 * @returns {Promise<void>}
 */
export async function enviarEmail(email) {
    const url = MailService;

    try {
        const resposta = await axios.post(
            url,
            email,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                }
            }
        );
        console.log(`Resposta do envio de emails: ${resposta.data.message}`);
    } catch (erro) {
        console.error('Erro ao enviar email:', erro.response?.data || erro.message);
        // Não lançar erro para não quebrar o fluxo - apenas logar
    }
}
