// Mock das dependências
jest.mock('../../config/minioConnect.js', () => ({
    putObject: jest.fn(),
    getObject: jest.fn(),
    removeObject: jest.fn(),
}));
jest.mock('dotenv/config');

import UploadRepository from '../../repository/UploadRepository.js';

// Obter a referência do mock
const mockMinioClient = require('../../config/minioConnect.js');

describe('UploadRepository', () => {
    let repository;
    let originalEnv;

    beforeEach(() => {
        // Salvar variáveis de ambiente originais
        originalEnv = { ...process.env };

        // Configurar variáveis de ambiente para os testes
        process.env.MINIO_BUCKET_FOTOS = 'test-bucket';
        process.env.MINIO_ENDPOINT = 'minio.example.com';
        process.env.MINIO_USE_SSL = 'true';

        // Limpar mocks
        jest.clearAllMocks();

        repository = new UploadRepository();
    });

    afterEach(() => {
        // Restaurar variáveis de ambiente
        process.env = originalEnv;
    });

    describe('constructor', () => {
        it('deve definir o bucket a partir da variável de ambiente', () => {
            expect(repository.bucket).toBe('test-bucket');
        });
    });

    describe('uploadFile', () => {
        const mockBuffer = Buffer.from('test file content');
        const mockFileName = 'test-file.jpg';
        const mockContentType = 'image/jpeg';

        it('deve fazer upload com sucesso e retornar URL HTTPS', async () => {
            mockMinioClient.putObject.mockResolvedValue();

            const result = await repository.uploadFile(mockBuffer, mockFileName, mockContentType);

            expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                'test-bucket',
                mockFileName,
                mockBuffer,
                mockBuffer.length,
                { 'Content-Type': mockContentType }
            );

            expect(result).toBe('https://minio.example.com/test-bucket/test-file.jpg');
        });

        it('deve fazer upload com sucesso e retornar URL HTTP quando SSL desabilitado', async () => {
            process.env.MINIO_USE_SSL = 'false';
            repository = new UploadRepository();

            mockMinioClient.putObject.mockResolvedValue();

            const result = await repository.uploadFile(mockBuffer, mockFileName, mockContentType);

            expect(result).toBe('http://minio.example.com/test-bucket/test-file.jpg');
        });

        it('deve fazer upload com diferentes tipos de conteúdo', async () => {
            const testCases = [
                { contentType: 'image/jpeg', expected: 'image/jpeg' },
                { contentType: 'image/png', expected: 'image/png' },
                { contentType: 'image/svg+xml', expected: 'image/svg+xml' },
                { contentType: 'application/pdf', expected: 'application/pdf' },
            ];

            for (const { contentType, expected } of testCases) {
                mockMinioClient.putObject.mockResolvedValue();

                await repository.uploadFile(mockBuffer, mockFileName, contentType);

                expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                    'test-bucket',
                    mockFileName,
                    mockBuffer,
                    mockBuffer.length,
                    { 'Content-Type': expected }
                );
            }
        });

        it('deve propagar erro do MinIO', async () => {
            const minioError = new Error('MinIO connection failed');
            mockMinioClient.putObject.mockRejectedValue(minioError);

            await expect(repository.uploadFile(mockBuffer, mockFileName, mockContentType))
                .rejects.toThrow('Falha ao fazer upload do arquivo.');
        });

        it('deve lidar com diferentes tamanhos de buffer', async () => {
            const testBuffers = [
                Buffer.from('small'),
                Buffer.from('a'.repeat(1024)), // 1KB
                Buffer.from('b'.repeat(1024 * 1024)), // 1MB
            ];

            for (const buffer of testBuffers) {
                mockMinioClient.putObject.mockResolvedValue();

                await repository.uploadFile(buffer, mockFileName, mockContentType);

                expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                    'test-bucket',
                    mockFileName,
                    buffer,
                    buffer.length,
                    { 'Content-Type': mockContentType }
                );
            }
        });

        it('deve aceitar nomes de arquivo com caracteres especiais', async () => {
            const specialFileNames = [
                'file with spaces.jpg',
                'file-with-dashes.png',
                'file_with_underscores.svg',
                'file.123.pdf',
                'çãéôü.jpg'
            ];

            for (const fileName of specialFileNames) {
                mockMinioClient.putObject.mockResolvedValue();

                const result = await repository.uploadFile(mockBuffer, fileName, mockContentType);

                expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                    'test-bucket',
                    fileName,
                    mockBuffer,
                    mockBuffer.length,
                    { 'Content-Type': mockContentType }
                );

                expect(result).toContain(fileName);
            }
        });

        it('deve gerar URLs corretas com diferentes endpoints', async () => {
            const endpoints = [
                'minio.example.com',
                'localhost:9000',
                's3.amazonaws.com',
                'storage.googleapis.com'
            ];

            for (const endpoint of endpoints) {
                process.env.MINIO_ENDPOINT = endpoint;
                repository = new UploadRepository();

                mockMinioClient.putObject.mockResolvedValue();

                const result = await repository.uploadFile(mockBuffer, mockFileName, mockContentType);

                expect(result).toBe(`https://${endpoint}/test-bucket/test-file.jpg`);
            }
        });
    });

    describe('getFile', () => {
        const mockFileName = 'test-file.jpg';

        it('deve fazer download com sucesso e retornar buffer', async () => {
            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    yield Buffer.from('chunk1');
                    yield Buffer.from('chunk2');
                    yield Buffer.from('chunk3');
                }
            };

            mockMinioClient.getObject.mockResolvedValue(mockStream);

            const result = await repository.getFile(mockFileName);

            expect(mockMinioClient.getObject).toHaveBeenCalledWith('test-bucket', mockFileName);
            expect(result).toBeInstanceOf(Buffer);
            expect(result.toString()).toBe('chunk1chunk2chunk3');
        });

        it('deve concatenar chunks corretamente', async () => {
            const chunks = [
                Buffer.from('Hello '),
                Buffer.from('World!'),
                Buffer.from(' This is a test.')
            ];

            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    for (const chunk of chunks) {
                        yield chunk;
                    }
                }
            };

            mockMinioClient.getObject.mockResolvedValue(mockStream);

            const result = await repository.getFile(mockFileName);

            expect(result.toString()).toBe('Hello World! This is a test.');
        });

        it('deve lidar com stream vazio', async () => {
            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    // Nenhum chunk
                }
            };

            mockMinioClient.getObject.mockResolvedValue(mockStream);

            const result = await repository.getFile(mockFileName);

            expect(result).toBeInstanceOf(Buffer);
            expect(result.length).toBe(0);
        });

        it('deve propagar erro quando arquivo não encontrado', async () => {
            const minioError = new Error('The specified key does not exist');
            mockMinioClient.getObject.mockRejectedValue(minioError);

            await expect(repository.getFile(mockFileName))
                .rejects.toThrow('Arquivo não encontrado.');
        });

        it('deve propagar outros erros do MinIO', async () => {
            const minioError = new Error('Network timeout');
            mockMinioClient.getObject.mockRejectedValue(minioError);

            await expect(repository.getFile(mockFileName))
                .rejects.toThrow('Arquivo não encontrado.');
        });

        it('deve aceitar diferentes nomes de arquivo', async () => {
            const fileNames = [
                'simple.jpg',
                'path/to/file.png',
                'file-with-uuid-123456.svg',
                'file with spaces.pdf'
            ];

            for (const fileName of fileNames) {
                const mockStream = {
                    [Symbol.asyncIterator]: async function* () {
                        yield Buffer.from('content');
                    }
                };

                mockMinioClient.getObject.mockResolvedValue(mockStream);

                await repository.getFile(fileName);

                expect(mockMinioClient.getObject).toHaveBeenCalledWith('test-bucket', fileName);
            }
        });
    });

    describe('deleteFile', () => {
        const mockFileName = 'test-file.jpg';

        it('deve deletar arquivo com sucesso', async () => {
            mockMinioClient.removeObject.mockResolvedValue();

            await expect(repository.deleteFile(mockFileName)).resolves.toBeUndefined();

            expect(mockMinioClient.removeObject).toHaveBeenCalledWith('test-bucket', mockFileName);
        });

        it('deve propagar erro quando arquivo não encontrado', async () => {
            const minioError = new Error('The specified key does not exist');
            mockMinioClient.removeObject.mockRejectedValue(minioError);

            await expect(repository.deleteFile(mockFileName))
                .rejects.toThrow('Falha ao deletar o arquivo.');
        });

        it('deve propagar outros erros do MinIO', async () => {
            const minioError = new Error('Access denied');
            mockMinioClient.removeObject.mockRejectedValue(minioError);

            await expect(repository.deleteFile(mockFileName))
                .rejects.toThrow('Falha ao deletar o arquivo.');
        });

        it('deve aceitar diferentes nomes de arquivo', async () => {
            const fileNames = [
                'simple.jpg',
                'path/to/file.png',
                'file-with-uuid-123456.svg',
                'file with spaces.pdf',
                'çãéôü.jpg'
            ];

            for (const fileName of fileNames) {
                mockMinioClient.removeObject.mockResolvedValue();

                await repository.deleteFile(fileName);

                expect(mockMinioClient.removeObject).toHaveBeenCalledWith('test-bucket', fileName);
            }
        });

        it('deve fazer apenas uma chamada por arquivo', async () => {
            mockMinioClient.removeObject.mockResolvedValue();

            await repository.deleteFile(mockFileName);

            expect(mockMinioClient.removeObject).toHaveBeenCalledTimes(1);
        });
    });

    describe('Integração e cenários especiais', () => {
        it('deve manter isolamento entre operações', async () => {
            // Upload
            mockMinioClient.putObject.mockResolvedValue();
            await repository.uploadFile(Buffer.from('content'), 'upload.jpg', 'image/jpeg');

            // Download
            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    yield Buffer.from('downloaded');
                }
            };
            mockMinioClient.getObject.mockResolvedValue(mockStream);
            await repository.getFile('download.jpg');

            // Delete
            mockMinioClient.removeObject.mockResolvedValue();
            await repository.deleteFile('delete.jpg');

            expect(mockMinioClient.putObject).toHaveBeenCalledTimes(1);
            expect(mockMinioClient.getObject).toHaveBeenCalledTimes(1);
            expect(mockMinioClient.removeObject).toHaveBeenCalledTimes(1);
        });

        it('deve funcionar com diferentes buckets', () => {
            const buckets = ['bucket1', 'bucket2', 'photos', 'documents'];

            for (const bucket of buckets) {
                process.env.MINIO_BUCKET_FOTOS = bucket;
                const repo = new UploadRepository();

                mockMinioClient.putObject.mockResolvedValue();

                repo.uploadFile(Buffer.from('content'), 'file.jpg', 'image/jpeg');

                expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                    bucket,
                    'file.jpg',
                    expect.any(Buffer),
                    expect.any(Number),
                    { 'Content-Type': 'image/jpeg' }
                );
            }
        });

        it('deve lidar com buffers de diferentes tipos', async () => {
            const bufferTypes = [
                Buffer.from('string content'),
                Buffer.from([1, 2, 3, 4, 5]),
                Buffer.alloc(1024), // Buffer vazio de 1KB
                Buffer.from(''),
            ];

            for (const buffer of bufferTypes) {
                mockMinioClient.putObject.mockResolvedValue();

                await repository.uploadFile(buffer, 'test.bin', 'application/octet-stream');

                expect(mockMinioClient.putObject).toHaveBeenCalledWith(
                    'test-bucket',
                    'test.bin',
                    buffer,
                    buffer.length,
                    { 'Content-Type': 'application/octet-stream' }
                );
            }
        });
    });

    describe('Tratamento de erros e edge cases', () => {
        it('deve lidar com erros de rede durante upload', async () => {
            const networkErrors = [
                new Error('ECONNREFUSED'),
                new Error('ETIMEDOUT'),
                new Error('ENOTFOUND'),
            ];

            for (const error of networkErrors) {
                mockMinioClient.putObject.mockRejectedValue(error);

                await expect(repository.uploadFile(Buffer.from('content'), 'file.jpg', 'image/jpeg'))
                    .rejects.toThrow('Falha ao fazer upload do arquivo.');
            }
        });

        it('deve lidar com erros de rede durante download', async () => {
            const networkErrors = [
                new Error('ECONNREFUSED'),
                new Error('ETIMEDOUT'),
                new Error('ENOTFOUND'),
            ];

            for (const error of networkErrors) {
                mockMinioClient.getObject.mockRejectedValue(error);

                await expect(repository.getFile('file.jpg'))
                    .rejects.toThrow('Arquivo não encontrado.');
            }
        });

        it('deve lidar com erros de rede durante delete', async () => {
            const networkErrors = [
                new Error('ECONNREFUSED'),
                new Error('ETIMEDOUT'),
                new Error('ENOTFOUND'),
            ];

            for (const error of networkErrors) {
                mockMinioClient.removeObject.mockRejectedValue(error);

                await expect(repository.deleteFile('file.jpg'))
                    .rejects.toThrow('Falha ao deletar o arquivo.');
            }
        });

        it('deve lidar com streams malformados', async () => {
            // Stream que lança erro durante iteração
            const mockStream = {
                [Symbol.asyncIterator]: async function* () {
                    throw new Error('Stream corrupted');
                }
            };

            mockMinioClient.getObject.mockResolvedValue(mockStream);

            await expect(repository.getFile('file.jpg'))
                .rejects.toThrow('Arquivo não encontrado.');
        });
    });
});