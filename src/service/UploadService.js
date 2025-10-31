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
        // Validar entrada básica
        if (fileName == null) {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'fileName',
                customMessage: 'Nome do arquivo não pode ser nulo ou indefinido.'
            });
        }

        // Converter para string e validar
        const fileNameStr = String(fileName);
        if (!fileNameStr || fileNameStr.trim() === '') {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'fileName',
                customMessage: 'Nome do arquivo inválido para exclusão.'
            });
        }

        // Extrair a key (nome do arquivo) da URL ou usar diretamente se já for a key
        let key = fileNameStr;

        // Verificar se é uma URL (http ou https)
        if (fileNameStr.startsWith('http://') || fileNameStr.startsWith('https://')) {
            try {
                const url = new URL(fileNameStr);
                // Extrair o path: /bucket/file.jpg para bucket/file.jpg
                const pathName = url.pathname.substring(1);
                const pathParts = pathName.split('/');

                // Se tem pelo menos bucket e o arquivo, pegar do segundo elemento em diante
                if (pathParts.length >= 2) {
                    key = pathParts.slice(1).join('/'); // Remove bucket, mantém arquivo e subpastas
                } else {
                    // Fallback: usar o último segmento do path
                    key = pathParts[pathParts.length - 1];
                }
            } catch (urlError) {
                // Se não conseguir parsear como URL, assumir que já é a key
                // O middleware de erro global vai tratar isso se necessário
                key = fileNameStr;
            }
        }

        // Validar key final
        if (!key || key.trim() === '') {
            throw new CustomError({
                statusCode: HttpStatusCodes.BAD_REQUEST.code,
                errorType: 'validationError',
                field: 'fileName',
                customMessage: 'Nome do arquivo inválido para exclusão.'
            });
        }

        await this.uploadRepository.deleteFile(key);
    }
}

export default UploadService;
