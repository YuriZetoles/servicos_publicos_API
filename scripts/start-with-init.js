#!/usr/bin/env node

/**
 * Wrapper script que:
 * 1. Executa init-mailsender.js (gera API Key e exporta MAIL_API_KEY)
 * 2. Inicia o servidor com a variável de ambiente preservada
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runInit() {
    return new Promise((resolve, reject) => {
        console.log('Executando init-mailsender.js...\n');
        
        const initProcess = spawn('node', [join(__dirname, 'init-mailsender.js')], {
            stdio: 'inherit',
            env: { ...process.env }
        });
        
        initProcess.on('close', (code) => {
            if (code === 0) {
                console.log('\nInicialização concluída!\n');
                resolve();
            } else {
                reject(new Error(`init-mailsender.js falhou com código ${code}`));
            }
        });
    });
}

async function startServer() {
    const isDev = process.argv.includes('--dev');
    const command = isDev ? 'nodemon' : 'node';
    const script = isDev ? 'server.js' : 'server.js';
    
    console.log(`Iniciando servidor (${isDev ? 'desenvolvimento' : 'produção'})...\n`);
    
    // Lê a API Key do arquivo .env atualizado
    try {
        const { readFileSync } = await import('fs');
        const envPath = join(__dirname, '..', '.env');
        const envContent = readFileSync(envPath, 'utf8');
        const match = envContent.match(/MAIL_API_KEY="?([^"\n]+)"?/);
        
        if (match && match[1]) {
            process.env.MAIL_API_KEY = match[1];
            console.log(`MAIL_API_KEY carregada: ${match[1].substring(0, 16)}...\n`);
        }
    } catch (error) {
        console.warn('Não foi possível carregar MAIL_API_KEY do .env');
    }
    
    const serverProcess = spawn(command, [script], {
        stdio: 'inherit',
        env: { ...process.env }
    });
    
    serverProcess.on('close', (code) => {
        process.exit(code);
    });
}

async function main() {
    try {
        await runInit();
        await startServer();
    } catch (error) {
        console.error('Erro:', error.message);
        process.exit(1);
    }
}

main();
