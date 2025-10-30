import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import UploadRepository from '../repository/UploadRepository.js';
import CustomError from '../utils/helpers/CustomError.js';
import HttpStatusCodes from '../utils/helpers/HttpStatusCodes.js';

class UploadService {
    constructor() {
        this.uploadRepository = new UploadRepository();
    }

    /**
     * Processa, valida e faz upload de uma foto.
     * @param {Object} file - Arquivo do express-fileupload.
     * @returns {Promise<Object>} - { url, metadata }
     */
    async processarFoto(file) {
        // 1) Valida extensão
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

        // 2) Valida tamanho (max 50MB)
        const MAX_BYTES = 50 * 1024 * 1024;
        if (file.size > MAX_BYTES) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'file',
                customMessage: 'Arquivo excede 50MB.'
            });
        }

        // 3) Gera nome único
        const fileName = `${uuidv4()}.${ext}`;

        // 4) Processa imagem (redimensiona e comprime)
        let transformer = sharp(file.data).resize(400, 400, {
            fit: sharp.fit.cover,
            position: sharp.strategy.entropy
        });

        if (['jpg', 'jpeg'].includes(ext)) {
            transformer = transformer.jpeg({ quality: 80 });
        }

        const buffer = await transformer.toBuffer();

        // 5) Define contentType
        const mimeTypes = {
            jpg: 'image/jpeg',
            jpeg: 'image/jpeg',
            png: 'image/png',
            svg: 'image/svg+xml'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        // 6) Faz upload para MinIO
        const url = await this.uploadRepository.uploadFile(buffer, fileName, contentType);

        // 7) Retorna metadados
        return {
            url,
            metadata: {
                fileExtension: ext,
                fileSize: file.size,
                md5: file.md5,
                fileName
            }
        };
    }

    /**
     * Deleta uma foto.
     * @param {string} fileName - Nome do arquivo ou URL completa.
     * @returns {Promise<void>}
     */
    async deleteFoto(fileName) {
        // Se for uma URL completa, extrair apenas o nome do arquivo (key)
        let key = fileName;
        if (fileName.startsWith('http')) {
            const url = new URL(fileName);
            const pathParts = url.pathname.substring(1).split('/');
            key = pathParts.slice(1).join('/'); // Remove o bucket e pega o resto
        }
        await this.uploadRepository.deleteFile(key);
    }
}

export default UploadService;
