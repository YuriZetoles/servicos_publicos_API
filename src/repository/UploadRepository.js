import minioClient from '../config/minioConnect.js';
import 'dotenv/config';

class UploadRepository {
    constructor() {
        this.bucket = process.env.MINIO_BUCKET_FOTOS;
    }

    /**
     * Faz upload de um arquivo para o MinIO.
     * @param {Buffer} buffer - Buffer do arquivo.
     * @param {string} fileName - Nome do arquivo.
     * @param {string} contentType - Tipo MIME do arquivo.
     * @returns {Promise<string>} - URL do arquivo no MinIO.
     */
    async uploadFile(buffer, fileName, contentType) {
        try {
            await minioClient.putObject(this.bucket, fileName, buffer, buffer.length, {
                'Content-Type': contentType,
            });
            // Retorna a URL pública (assumindo que o bucket é público)
            const protocol = process.env.MINIO_USE_SSL === 'true' ? 'https' : 'http';
            const url = `${protocol}://${process.env.MINIO_ENDPOINT}/${this.bucket}/${fileName}`;
            return url;
        } catch (error) {
            console.error('Erro no upload para MinIO:', error);
            throw new Error('Falha ao fazer upload do arquivo.');
        }
    }

    /**
     * Faz download de um arquivo do MinIO.
     * @param {string} fileName - Nome do arquivo.
     * @returns {Promise<Buffer>} - Buffer do arquivo.
     */
    async getFile(fileName) {
        try {
            const stream = await minioClient.getObject(this.bucket, fileName);
            const chunks = [];
            for await (const chunk of stream) {
                chunks.push(chunk);
            }
            return Buffer.concat(chunks);
        } catch (error) {
            console.error('Erro no download do MinIO:', error);
            throw new Error('Arquivo não encontrado.');
        }
    }

    /**
     * Deleta um arquivo do MinIO.
     * @param {string} fileName - Nome do arquivo.
     * @returns {Promise<void>}
     */
    async deleteFile(fileName) {
        try {
            await minioClient.removeObject(this.bucket, fileName);
        } catch (error) {
            console.error('Erro ao deletar arquivo do MinIO:', error);
            throw new Error('Falha ao deletar o arquivo.');
        }
    }
}

export default UploadRepository;
