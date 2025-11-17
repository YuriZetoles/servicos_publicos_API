// scripts/init-mailsender.js

// Script para inicializar a API Key do Mailsender
import { writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const MAILSENDER_URL = 'http://mailsender-servicos:5016';
const MAX_RETRIES = 30;
const RETRY_DELAY = 2000;

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function waitForMailsender() {
    console.log('Aguardando Mailsender estar pronto...');
    
    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            const response = await fetch(`${MAILSENDER_URL}/api/status`);
            if (response.ok) {
                console.log('Mailsender está pronto!');
                return true;
            }
        } catch (error) {
            console.log(`Tentativa ${i + 1}/${MAX_RETRIES} - Aguardando Mailsender...`);
        }
        await sleep(RETRY_DELAY);
    }
    
    throw new Error('Timeout aguardando Mailsender');
}

async function checkExistingKeyInEnv() {
    try {
        const envPath = join(__dirname, '..', '.env');
        const envContent = readFileSync(envPath, 'utf8');
        
        const match = envContent.match(/MAIL_API_KEY="?([^"\n]+)"?/);
        
        if (match && match[1] && match[1] !== 'AUTO_GENERATED_ON_STARTUP') {
            console.log('API Key encontrada no .env!');
            return match[1];
        }
        
        return null;
    } catch (error) {
        console.log('Erro ao verificar .env:', error.message);
        return null;
    }
}

async function checkExistingKeyInMailsender() {
    try {
        const response = await fetch(`${MAILSENDER_URL}/api/keys`);
        const data = await response.json();
        
        // Mailsender retorna array diretamente
        if (!Array.isArray(data)) {
            console.log('Formato de resposta inesperado');
            return null;
        }
        
        const existingKey = data.find(k => k.nome === 'servicos-publicos-api');
        
        if (existingKey && existingKey.ativa) {
            console.log('API Key já existe no Mailsender!');
            // Retorna o objeto completo com todas as informações
            return existingKey;
        }
        
        return null;
    } catch (error) {
        console.log('Erro ao verificar chave no Mailsender:', error.message);
        return null;
    }
}

async function deleteApiKey(keyName) {
    console.log(`Deletando API Key: ${keyName}...`);
    
    try {
        const response = await fetch(`${MAILSENDER_URL}/api/keys/${keyName}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        console.log('API Key antiga deletada!');
        return true;
    } catch (error) {
        console.error('Erro ao deletar API Key:', error.message);
        return false;
    }
}

async function generateApiKey() {
    console.log('Gerando nova API Key...');
    
    try {
        const response = await fetch(`${MAILSENDER_URL}/api/keys/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'servicos-publicos-api' })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        
        if (!data.apiKey) {
            throw new Error(`Resposta inválida: ${JSON.stringify(data)}`);
        }
        
        console.log(`API Key gerada: ${data.apiKey.substring(0, 16)}...`);
        return data.apiKey;
    } catch (error) {
        console.error('Erro detalhado ao gerar API Key:', error.message);
        throw error;
    }
}

function updateEnvFile(apiKey) {
    console.log('Salvando API Key no arquivo .env...');
    
    const envPath = join(__dirname, '..', '.env');
    
    try {
        let envContent = readFileSync(envPath, 'utf8');
        
        // Atualiza ou adiciona MAIL_API_KEY
        if (envContent.includes('MAIL_API_KEY=')) {
            envContent = envContent.replace(
                /MAIL_API_KEY=.*/,
                `MAIL_API_KEY="${apiKey}"`
            );
        } else {
            envContent += `\nMAIL_API_KEY="${apiKey}"\n`;
        }
        
        writeFileSync(envPath, envContent, 'utf8');
        console.log('API Key salva com sucesso!');
    } catch (error) {
        console.error('Erro ao salvar .env:', error.message);
        throw error;
    }
}

async function main() {
    try {
        console.log('Iniciando sincronização de API Key...');
        
        // Aguarda Mailsender estar pronto
        await waitForMailsender();
        
        // Lista todas as keys existentes
        const response = await fetch(`${MAILSENDER_URL}/api/keys`);
        const keys = await response.json();
        
        // Deleta TODAS as keys existentes
        if (Array.isArray(keys) && keys.length > 0) {
            console.log(`Deletando ${keys.length} chave(s) existente(s)...`);
            for (const key of keys) {
                await deleteApiKey(key.nome);
                await sleep(500);
            }
        }
        
        // Gera nova chave
        console.log('Gerando nova API Key...');
        const apiKey = await generateApiKey();
        
        if (!apiKey) {
            throw new Error('Falha ao gerar API Key');
        }
        
        // Atualiza o arquivo .env
        updateEnvFile(apiKey);
        
        process.env.MAIL_API_KEY = apiKey;
        
        console.log('API Key sincronizada com sucesso!');
        console.log(`Chave salva: ${apiKey.substring(0, 16)}...`);
        console.log('Variável de ambiente MAIL_API_KEY exportada!');
        process.exit(0);
    } catch (error) {
        console.error('Erro na inicialização:', error.message);
        process.exit(1);
    }
}

main();
