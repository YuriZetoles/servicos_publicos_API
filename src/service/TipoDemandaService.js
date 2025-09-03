// /src/services/TipoDemandaService.js
//import bcrypt from 'bcrypt';
import { CommonResponse, CustomError, HttpStatusCodes, errorHandler, messages, StatusService, asyncWrapper } from '../utils/helpers/index.js';
//import AuthHelper from '../utils/AuthHelper.js';
import mongoose from 'mongoose';
import TipoDemandaRepository from '../repository/TipoDemandaRepository.js';
import TipoDemandaUpdateSchema from '../utils/validators/schemas/zod/TipoDemandaSchema.js';
import UsuarioRepository from '../repository/UsuarioRepository.js';
import { parse } from 'dotenv';

// Importações necessárias para o upload de arquivos
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import sharp from 'sharp';
// Helper para __dirname em módulo ES
const getDirname = () => path.dirname(fileURLToPath(import.meta.url));

class TipoDemandaService {
    constructor() {
        this.repository = new TipoDemandaRepository();
        this.userRepository = new UsuarioRepository();
    }

    async listar(req) {
        console.log("Estou no TipoDemandaService");
        const data = await this.repository.listar(req);
        console.log('Estou retornando os dados em TipoDemandaService para o controller');
        return data;
    }

    async criar(parsedData) {
        console.log("Estou no criar em TipoDemandaService")

        //validar nome unico e tipo
        await this.validarTitulo(parsedData.titulo);
        await this.validarTipo(parsedData.tipo);
        //chama o repositório
        const data = await this.repository.criar(parsedData);

        return data;
    }

    async atualizar(id, parsedData) {
        console.log('Estou no atualizar em TipoDemandaService');

        await this.ensureTipoDemandaExists(id);

        if (parsedData.titulo) {
        await this.validarTitulo(parsedData.titulo, id);
        }
        if (parsedData.tipo) {
            await this.validarTipo(parsedData.tipo);
        }
        const data = await this.repository.atualizar(id, parsedData);
        return data;
    }


    async deletar(id) {
        console.log('Estou no deletar em TipoDemandaService');

        await this.ensureTipoDemandaExists(id);

        const data = await this.repository.deletar(id)
        return data;
    }

    async atualizarFoto(id, parsedData, req) {
        await this.ensureTipoDemandaExists(id);

        const usuario = await this.userRepository.buscarPorID(req.user_id);
        const nivel = usuario?.nivel_acesso;
        const userId = usuario._id.toString();

        const tipoDemanda = await this.repository.buscarPorID(id);
        const usuariosTipoDemanda = (tipoDemanda?.usuarios).map(u => u._id.toString());
       
        const isAdmin = nivel.administrador;
        const isSecretario = nivel.secretario;

        if (!(isAdmin || (isSecretario && usuariosTipoDemanda.includes(userId)))) {
            throw new CustomError({
                statusCode: HttpStatusCodes.FORBIDDEN.code,
                errorType: 'permissionError',
                field: 'TipoDemanda',
                details: [],
                customMessage: "Você não tem permissão para atualizar a imagem dessa demanda."
            });
        }
        
        await this.ensureTipoDemandaExists(id);

        const data = await this.repository.atualizarFoto(id,parsedData);
        return data;
    }

    async ensureTipoDemandaExists(id){
        const TipoDemandaExistente = await this.repository.buscarPorID(id);
        if (!TipoDemandaExistente) {
            throw new CustomError({
                statusCode: 404,
                errorType: 'resourceNotFound',
                field: 'TipoDemanda',
                details: [],
                customMessage: messages.error.resourceNotFound('TipoDemanda'),
            });
        }

        return TipoDemandaExistente;
    }

    async validarTitulo(titulo, id=null) {
        const TipoDemandaExistente = await this.repository.buscarPorTitulo(titulo, id);
        if (TipoDemandaExistente) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'titulo',
                details: [{ path: 'titulo', message: 'Titulo já está em uso.' }],
                customMessage: 'Titulo já cadastrado.',
            });
        }
    }
    
    /**
     * Valida extensão, tamanho, redimensiona e salva a imagem,
     * atualiza o tipo demana e retorna nome do arquivo + metadados.
    */
    async processarFoto(tipoDemandaId, file, tipo, req) {
        const ext = path.extname(file.name).slice(1).toLowerCase();
        const validExts = ['jpg', 'jpeg', 'png', 'svg'];
        if (!validExts.includes(ext)) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'file',
                customMessage: 'Extensão inválida. Permitido: jpg, jpeg, png, svg.'
            });
        }

        const MAX_BYTES = 50 * 1024 * 1024;
        if (file.size > MAX_BYTES) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'file',
                customMessage: 'Arquivo excede 50MB.'
            });
        }

        const fileName = `${uuidv4()}.${ext}`;
        const uploadsDir = path.join(getDirname(), '..', '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const uploadPath = path.join(uploadsDir, fileName);

        const transformer = sharp(file.data).resize(400, 400, {
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy
        });
        if (['jpg', 'jpeg'].includes(ext)) {
            transformer.jpeg({ quality: 80 });
        }

        const buffer = await transformer.toBuffer();
        await fs.promises.writeFile(uploadPath, buffer);

        const dados = { link_imagem: fileName };
        TipoDemandaUpdateSchema.parse(dados);
        await this.atualizarFoto(tipoDemandaId, dados, req);

        return {
            fileName,
            metadata: {
                fileExtension: ext,
                fileSize: file.size,
                md5: file.md5,
            },
        };
    }

    async validarTipo(tipo) {
    const tiposPermitidos = [
        'Coleta',
        'Iluminação',
        'Saneamento',
        'Árvores',
        'Animais',
        'Pavimentação'
    ];

    if (!tiposPermitidos.includes(tipo)) {
        throw new CustomError({
            statusCode: HttpStatusCodes.BAD_REQUEST.code,
            errorType: 'validationError',
            field: 'tipo',
            details: [{ path: 'tipo', message: 'Tipo inválido. Valores permitidos: Coleta, Iluminação, Saneamento, Árvores, Animais, Pavimentação.' }],
            customMessage: 'Tipo de demanda não é válido.',
        });
    }
}

}

export default TipoDemandaService;