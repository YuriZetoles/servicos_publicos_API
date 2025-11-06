import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import UploadRepository from '../repository/UploadRepository.js';
import CustomError from '../utils/helpers/CustomError.js';
import HttpStatusCodes from '../utils/helpers/HttpStatusCodes.js';
import logger from '../utils/logger.js';

class UploadService {
    constructor() {
        this.uploadRepository = new UploadRepository();
    }

    /**
     * Processa, valida e faz upload de uma imagem com compressão aplicada.
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

        try {
            // 4) Processa imagem com compressão otimizada
            let transformer = sharp(file.data)
                .resize(400, 400, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                });

            // Compressão baseada no formato (apenas para imagens processáveis)
            if (['jpg', 'jpeg'].includes(ext)) {
                transformer = transformer.jpeg({
                    quality: 80,
                    progressive: true,
                    mozjpeg: true
                });
            } else if (ext === 'png') {
                transformer = transformer.png({
                    compressionLevel: 6
                });
            }
            // SVG é processado igual às outras imagens (redimensionado)

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

        } catch (error) {
            throw new CustomError({
                statusCode: HttpStatusCodes.INTERNAL_SERVER_ERROR.code,
                errorType: 'processingError',
                field: 'file',
                customMessage: 'Erro ao processar imagem: ' + error.message
            });
        }
    }

    /**
     * Substitui uma foto: faz upload da nova e deleta a antiga.
     * @param {Object} file - Arquivo do express-fileupload.
     * @param {string|null} imagemAntiga - URL ou nome da imagem antiga (pode ser null/empty).
     * @returns {Promise<Object>} - { url, metadata }
     */
    async substituirFoto(file, imagemAntiga = null) {
        // 1. Faz upload da nova imagem
        const { url, metadata } = await this.processarFoto(file);

        // 2. Deleta a imagem antiga (se existir) com retry em background
        if (imagemAntiga && imagemAntiga !== "") {
            this.deleteFotoComRetry(imagemAntiga);
        }

        return { url, metadata };
    }

    /**
     * Deleta uma foto com retry automático (exponential backoff).
     * Executa em background sem bloquear a resposta.
     * @param {string} imagemUrl - URL ou nome da imagem.
     * @param {number} maxTentativas - Número máximo de tentativas (padrão: 3).
     * @returns {Promise<void>}
     */
    async deleteFotoComRetry(imagemUrl, maxTentativas = 3) {
        for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
            try {
                await this.deleteFoto(imagemUrl);
                
                // Sucesso! Loga apenas se não foi na primeira tentativa
                if (tentativa > 1) {
                    logger.info(`Imagem antiga deletada com sucesso após ${tentativa} tentativa(s)`, {
                        imagemUrl,
                        tentativa
                    });
                }
                
                return; // Sai da função se deletou com sucesso
                
            } catch (error) {
                const ehUltimaTentativa = tentativa === maxTentativas;
                
                if (ehUltimaTentativa) {
                    // Última tentativa falhou - loga warning
                    logger.warn(`Falha ao deletar imagem antiga após ${maxTentativas} tentativa(s)`, {
                        imagemUrl,
                        tentativasRealizadas: maxTentativas,
                        error: error.message,
                        stack: error.stack
                    });
                } else {
                    // Ainda há tentativas restantes - aguarda antes de tentar novamente
                    const delayMs = Math.pow(2, tentativa - 1) * 1000; // 1s, 2s, 4s...
                    
                    logger.debug(`Tentativa ${tentativa} de deletar imagem falhou. Tentando novamente em ${delayMs}ms...`, {
                        imagemUrl,
                        tentativa,
                        proximaTentativaEm: `${delayMs}ms`,
                        error: error.message
                    });
                    
                    await new Promise(resolve => setTimeout(resolve, delayMs));
                }
            }
        }
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
