import UploadService from '../../service/UploadService.js';
import UploadRepository from '../../repository/UploadRepository.js';
import CustomError from '../../utils/helpers/CustomError.js';
import HttpStatusCodes from '../../utils/helpers/HttpStatusCodes.js';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

// Mock das dependências
jest.mock('../../repository/UploadRepository.js');
jest.mock('sharp');
jest.mock('uuid');

describe('UploadService', () => {
    let service;
    let uploadRepositoryMock;

    beforeEach(() => {
        // Limpar mocks
        jest.clearAllMocks();

        // Configurar mocks
        uploadRepositoryMock = {
            uploadFile: jest.fn(),
            deleteFile: jest.fn(),
        };

        UploadRepository.mockImplementation(() => uploadRepositoryMock);

        // Mock do Sharp
        const sharpMock = {
            resize: jest.fn().mockReturnThis(),
            jpeg: jest.fn().mockReturnThis(),
            png: jest.fn().mockReturnThis(),
            toBuffer: jest.fn(),
        };
        sharp.mockReturnValue(sharpMock);

        // Mock do UUID
        uuidv4.mockReturnValue('test-uuid-123');

        service = new UploadService();
    });

    describe('processarFoto', () => {
        describe('Validação de extensão', () => {
            it('deve aceitar extensões válidas (jpg, jpeg, png, svg)', async () => {
                const validExtensions = ['jpg', 'jpeg', 'png', 'svg'];

                for (const ext of validExtensions) {
                    const file = {
                        name: `test.${ext}`,
                        size: 1024,
                        data: Buffer.from('fake-image-data'),
                        md5: 'fake-md5-hash'
                    };

                    uploadRepositoryMock.uploadFile.mockResolvedValue(`http://minio.example.com/bucket/test-uuid-123.${ext}`);

                    sharp.mockReturnValue({
                        resize: jest.fn().mockReturnThis(),
                        jpeg: jest.fn().mockReturnThis(),
                        png: jest.fn().mockReturnThis(),
                        toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
                    });

                    const result = await service.processarFoto(file);

                    expect(result).toHaveProperty('url');
                    expect(result).toHaveProperty('metadata');
                    expect(result.metadata.fileExtension).toBe(ext);
                }
            });

            it('deve rejeitar extensão inválida', async () => {
                const file = {
                    name: 'test.exe',
                    size: 1024,
                    data: Buffer.from('fake-data')
                };

                await expect(service.processarFoto(file)).rejects.toThrow(CustomError);
                await expect(service.processarFoto(file)).rejects.toMatchObject({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file'
                });
            });

            it('deve ser case insensitive para extensões', async () => {
                const file = {
                    name: 'test.JPG',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
                });

                const result = await service.processarFoto(file);

                expect(result.metadata.fileExtension).toBe('jpg');
            });
        });

        describe('Validação de tamanho', () => {
            it('deve aceitar arquivos dentro do limite (50MB)', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 50 * 1024 * 1024, // Exatamente 50MB
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
                });

                const result = await service.processarFoto(file);

                expect(result).toHaveProperty('url');
            });

            it('deve rejeitar arquivos maiores que 50MB', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 51 * 1024 * 1024, // 51MB
                    data: Buffer.from('fake-data')
                };

                await expect(service.processarFoto(file)).rejects.toThrow(CustomError);
                await expect(service.processarFoto(file)).rejects.toMatchObject({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'file',
                    customMessage: 'Arquivo excede 50MB.'
                });
            });
        });

        describe('Processamento de imagem', () => {
            it('deve processar JPG com compressão', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                const sharpInstance = {
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-jpg')),
                };

                sharp.mockReturnValue(sharpInstance);
                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                await service.processarFoto(file);

                expect(sharpInstance.resize).toHaveBeenCalledWith(400, 400, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                });
                expect(sharpInstance.jpeg).toHaveBeenCalledWith({ 
                    quality: 80,
                    progressive: true,
                    mozjpeg: true
                });
                expect(sharpInstance.toBuffer).toHaveBeenCalled();
            });

            it('deve processar PNG sem compressão JPG', async () => {
                const file = {
                    name: 'test.png',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                const sharpInstance = {
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-png')),
                };

                sharp.mockReturnValue(sharpInstance);
                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.png');

                await service.processarFoto(file);

                expect(sharpInstance.resize).toHaveBeenCalledWith(400, 400, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                });
                expect(sharpInstance.png).toHaveBeenCalledWith({ compressionLevel: 6 });
                expect(sharpInstance.jpeg).not.toHaveBeenCalled();
                expect(sharpInstance.toBuffer).toHaveBeenCalled();
            });

            it('deve processar SVG com redimensionamento (igual às outras imagens)', async () => {
                const file = {
                    name: 'test.svg',
                    size: 1024,
                    data: Buffer.from('fake-svg-data'),
                    md5: 'fake-md5-hash'
                };

                const sharpInstance = {
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-svg')),
                };

                sharp.mockReturnValue(sharpInstance);
                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.svg');

                await service.processarFoto(file);

                // SVG também é processado pelo Sharp (redimensionado)
                expect(sharp).toHaveBeenCalledWith(Buffer.from('fake-svg-data'));
                expect(sharpInstance.resize).toHaveBeenCalledWith(400, 400, {
                    fit: sharp.fit.cover,
                    position: sharp.strategy.entropy
                });
                // SVG não recebe compressão JPEG
                expect(sharpInstance.jpeg).not.toHaveBeenCalled();
                expect(uploadRepositoryMock.uploadFile).toHaveBeenCalledWith(
                    Buffer.from('processed-svg'),
                    'test-uuid-123.svg',
                    'image/svg+xml'
                );
            });
        });

        describe('Upload para MinIO', () => {
            it('deve fazer upload com content-type correto', async () => {
                const testCases = [
                    { ext: 'jpg', expectedMime: 'image/jpeg' },
                    { ext: 'jpeg', expectedMime: 'image/jpeg' },
                    { ext: 'png', expectedMime: 'image/png' },
                    { ext: 'svg', expectedMime: 'image/svg+xml' },
                ];

                for (const { ext, expectedMime } of testCases) {
                    const file = {
                        name: `test.${ext}`,
                        size: 1024,
                        data: Buffer.from('fake-image-data'),
                        md5: 'fake-md5-hash'
                    };

                    const sharpInstance = {
                        resize: jest.fn().mockReturnThis(),
                        jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                    };

                    if (ext !== 'svg') {
                        sharp.mockReturnValue(sharpInstance);
                    }

                    uploadRepositoryMock.uploadFile.mockResolvedValue(`http://minio.example.com/bucket/test-uuid-123.${ext}`);

                    await service.processarFoto(file);

                    expect(uploadRepositoryMock.uploadFile).toHaveBeenCalledWith(
                        expect.any(Buffer),
                        `test-uuid-123.${ext}`,
                        expectedMime
                    );
                }
            });

            it('deve gerar nome único com UUID', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                await service.processarFoto(file);

                expect(uuidv4).toHaveBeenCalled();
                expect(uploadRepositoryMock.uploadFile).toHaveBeenCalledWith(
                    expect.any(Buffer),
                    'test-uuid-123.jpg',
                    'image/jpeg'
                );
            });
        });

        describe('Retorno de metadados', () => {
            it('deve retornar URL e metadados completos', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 2048,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                const result = await service.processarFoto(file);

                expect(result).toEqual({
                    url: 'http://minio.example.com/bucket/test-uuid-123.jpg',
                    metadata: {
                        fileExtension: 'jpg',
                        fileSize: 2048,
                        md5: 'fake-md5-hash',
                        fileName: 'test-uuid-123.jpg'
                    }
                });
            });
        });

        describe('Tratamento de erros', () => {
            it('deve propagar erro do Sharp', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                const sharpError = new Error('Sharp processing failed');
                sharp.mockReturnValue({
                    resize: jest.fn().mockImplementation(() => {
                        throw sharpError;
                    }),
                });

                await expect(service.processarFoto(file)).rejects.toThrow('Sharp processing failed');
            });

            it('deve propagar erro do MinIO', async () => {
                const file = {
                    name: 'test.jpg',
                    size: 1024,
                    data: Buffer.from('fake-image-data'),
                    md5: 'fake-md5-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                const minioError = new Error('MinIO upload failed');
                uploadRepositoryMock.uploadFile.mockRejectedValue(minioError);

                await expect(service.processarFoto(file)).rejects.toThrow('MinIO upload failed');
            });
        });
    });

    describe('deleteFoto', () => {
        describe('Validação de entrada', () => {
            it('deve rejeitar entrada nula', async () => {
                await expect(service.deleteFoto(null)).rejects.toThrow(CustomError);
                await expect(service.deleteFoto(null)).rejects.toMatchObject({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'fileName',
                    customMessage: 'Nome do arquivo não pode ser nulo ou indefinido.'
                });
            });

            it('deve rejeitar entrada undefined', async () => {
                await expect(service.deleteFoto(undefined)).rejects.toThrow(CustomError);
                await expect(service.deleteFoto(undefined)).rejects.toMatchObject({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'fileName',
                    customMessage: 'Nome do arquivo não pode ser nulo ou indefinido.'
                });
            });

            it('deve rejeitar string vazia', async () => {
                await expect(service.deleteFoto('')).rejects.toThrow(CustomError);
                await expect(service.deleteFoto('   ')).rejects.toThrow(CustomError);
            });
        });

        describe('Extração de key de URL', () => {
            it('deve extrair key de URL HTTP completa', async () => {
                const url = 'http://minio.example.com/bucket-name/file.jpg';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(url);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('file.jpg');
            });

            it('deve extrair key de URL HTTPS completa', async () => {
                const url = 'https://minio.example.com/bucket-name/subfolder/file.png';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(url);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('subfolder/file.png');
            });

            it('deve usar string diretamente se não for URL', async () => {
                const fileName = 'direct-file-name.jpg';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(fileName);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith(fileName);
            });

            it('deve usar string diretamente se URL for inválida', async () => {
                const invalidUrl = 'not-a-url-at-all';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(invalidUrl);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith(invalidUrl);
            });

            it('deve extrair apenas o nome do arquivo quando há múltiplas barras', async () => {
                const url = 'https://minio.example.com/bucket/very/deep/path/file.svg';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(url);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('very/deep/path/file.svg');
            });
        });

        describe('Chamada do repositório', () => {
            it('deve chamar deleteFile do repositório com a key correta', async () => {
                const url = 'http://minio.example.com/bucket/file.jpg';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(url);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(1);
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('file.jpg');
            });

            it('deve propagar erro do repositório', async () => {
                const url = 'http://minio.example.com/bucket/file.jpg';
                const repositoryError = new Error('MinIO delete failed');
                uploadRepositoryMock.deleteFile.mockRejectedValue(repositoryError);

                await expect(service.deleteFoto(url)).rejects.toThrow('MinIO delete failed');
            });
        });

        describe('Cenários especiais', () => {
            it('deve lidar com URLs sem bucket no path', async () => {
                const url = 'https://minio.example.com/file.jpg';
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                await service.deleteFoto(url);

                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('file.jpg');
            });

            it('deve rejeitar URLs com apenas bucket (sem arquivo)', async () => {
                const url = 'https://minio.example.com/bucket/';

                await expect(service.deleteFoto(url)).rejects.toThrow(CustomError);
                await expect(service.deleteFoto(url)).rejects.toMatchObject({
                    statusCode: HttpStatusCodes.BAD_REQUEST.code,
                    errorType: 'validationError',
                    field: 'fileName',
                    customMessage: 'Nome do arquivo inválido para exclusão.'
                });
            });
        });
    });

    describe('Integração geral', () => {
        it('deve funcionar corretamente com fluxo completo de upload', async () => {
            const file = {
                name: 'test.jpg',
                size: 1024,
                data: Buffer.from('fake-image-data'),
                md5: 'fake-md5-hash'
            };

            const sharpInstance = {
                resize: jest.fn().mockReturnThis(),
                jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-image')),
            };

            sharp.mockReturnValue(sharpInstance);
            uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

            const result = await service.processarFoto(file);

            expect(uuidv4).toHaveBeenCalledTimes(1);
            expect(sharp).toHaveBeenCalledWith(Buffer.from('fake-image-data'));
            expect(sharpInstance.resize).toHaveBeenCalledTimes(1);
            expect(sharpInstance.jpeg).toHaveBeenCalledTimes(1);
            expect(sharpInstance.toBuffer).toHaveBeenCalledTimes(1);
            expect(uploadRepositoryMock.uploadFile).toHaveBeenCalledTimes(1);

            expect(result).toHaveProperty('url');
            expect(result).toHaveProperty('metadata');
        });

        it('deve funcionar corretamente com fluxo completo de delete', async () => {
            const url = 'https://minio.example.com/bucket/test-file.jpg';
            uploadRepositoryMock.deleteFile.mockResolvedValue();

            await service.deleteFoto(url);

            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(1);
            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('test-file.jpg');
        });
    });

    describe('substituirFoto', () => {
        describe('Upload da nova imagem', () => {
            it('deve fazer upload da nova imagem com sucesso', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                const result = await service.substituirFoto(file, null);

                expect(result).toHaveProperty('url', 'http://minio.example.com/bucket/test-uuid-123.jpg');
                expect(result).toHaveProperty('metadata');
            });
        });

        describe('Deleção da imagem antiga com retry', () => {
            it('deve deletar a imagem antiga na primeira tentativa', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                const imagemAntiga = 'http://minio.example.com/bucket/antiga.jpg';

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                const result = await service.substituirFoto(file, imagemAntiga);

                expect(result).toHaveProperty('url', 'http://minio.example.com/bucket/test-uuid-123.jpg');
                
                // Aguarda um pouco para o retry em background processar
                await new Promise(resolve => setTimeout(resolve, 50));
                
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('antiga.jpg');
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(1);
            });

            it('deve tentar deletar 3 vezes com exponential backoff antes de desistir', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                const imagemAntiga = 'http://minio.example.com/bucket/antiga.jpg';

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');
                uploadRepositoryMock.deleteFile.mockRejectedValue(new Error('MinIO timeout'));

                const result = await service.substituirFoto(file, imagemAntiga);

                // Retorna sucesso mesmo que deleção falhe
                expect(result).toHaveProperty('url', 'http://minio.example.com/bucket/test-uuid-123.jpg');
                
                // Aguarda todas as tentativas: 0ms + 1000ms + 2000ms = 3s + margem
                await new Promise(resolve => setTimeout(resolve, 3500));
                
                // Deve ter tentado 3 vezes
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(3);
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('antiga.jpg');
            });

            it('deve deletar na segunda tentativa após falha temporária', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                const imagemAntiga = 'http://minio.example.com/bucket/antiga.jpg';

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');
                
                // Primeira tentativa falha, segunda sucede
                uploadRepositoryMock.deleteFile
                    .mockRejectedValueOnce(new Error('Network timeout'))
                    .mockResolvedValueOnce();

                const result = await service.substituirFoto(file, imagemAntiga);

                expect(result).toHaveProperty('url', 'http://minio.example.com/bucket/test-uuid-123.jpg');
                
                // Aguarda primeira tentativa falhar + delay de 1s + segunda tentativa
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Deve ter tentado 2 vezes (primeira falhou, segunda sucedeu)
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(2);
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('antiga.jpg');
            });

            it('não deve tentar deletar quando imagemAntiga é null', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                await service.substituirFoto(file, null);
                
                await new Promise(resolve => setTimeout(resolve, 50));

                expect(uploadRepositoryMock.deleteFile).not.toHaveBeenCalled();
            });

            it('não deve tentar deletar quando imagemAntiga é string vazia', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');

                await service.substituirFoto(file, "");
                
                await new Promise(resolve => setTimeout(resolve, 50));

                expect(uploadRepositoryMock.deleteFile).not.toHaveBeenCalled();
            });
        });

        describe('Tratamento de erros no upload', () => {
            it('deve propagar erro se o upload da nova imagem falhar', async () => {
                const file = {
                    name: 'nova.jpg',
                    size: 1024,
                    data: Buffer.from('nova-imagem'),
                    md5: 'novo-hash'
                };

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed')),
                });

                const uploadError = new Error('Falha no upload para MinIO');
                uploadRepositoryMock.uploadFile.mockRejectedValue(uploadError);

                await expect(service.substituirFoto(file, 'antiga.jpg')).rejects.toThrow('Falha no upload para MinIO');
                
                // Não deve tentar deletar a antiga se o upload falhou
                await new Promise(resolve => setTimeout(resolve, 50));
                expect(uploadRepositoryMock.deleteFile).not.toHaveBeenCalled();
            });
        });

        describe('Fluxo completo de substituição', () => {
            it('deve substituir com sucesso: upload nova + delete antiga', async () => {
                const file = {
                    name: 'substituicao.jpg',
                    size: 2048,
                    data: Buffer.from('nova-imagem-completa'),
                    md5: 'hash-completo'
                };

                const imagemAntiga = 'https://minio.example.com/bucket/fotos/imagem-antiga.jpg';

                sharp.mockReturnValue({
                    resize: jest.fn().mockReturnThis(),
                    jpeg: jest.fn().mockReturnThis(),
                    png: jest.fn().mockReturnThis(),
                    toBuffer: jest.fn().mockResolvedValue(Buffer.from('processed-completo')),
                });

                uploadRepositoryMock.uploadFile.mockResolvedValue('http://minio.example.com/bucket/test-uuid-123.jpg');
                uploadRepositoryMock.deleteFile.mockResolvedValue();

                const result = await service.substituirFoto(file, imagemAntiga);

                expect(result).toEqual({
                    url: 'http://minio.example.com/bucket/test-uuid-123.jpg',
                    metadata: {
                        fileExtension: 'jpg',
                        fileSize: 2048,
                        md5: 'hash-completo',
                        fileName: 'test-uuid-123.jpg'
                    }
                });

                expect(uploadRepositoryMock.uploadFile).toHaveBeenCalledTimes(1);
                
                // Aguarda um pouco para o retry em background processar
                await new Promise(resolve => setTimeout(resolve, 50));
                
                expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('fotos/imagem-antiga.jpg');
            });
        });
    });

    describe('deleteFotoComRetry', () => {
        it('deve deletar com sucesso na primeira tentativa', async () => {
            uploadRepositoryMock.deleteFile.mockResolvedValue();

            await service.deleteFotoComRetry('http://minio.example.com/bucket/file.jpg');

            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(1);
            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledWith('file.jpg');
        });

        it('deve tentar múltiplas vezes antes de desistir', async () => {
            uploadRepositoryMock.deleteFile.mockRejectedValue(new Error('Falha persistente'));

            // Executa em background (fire and forget)
            const promise = service.deleteFotoComRetry('http://minio.example.com/bucket/file.jpg', 3);

            // Aguarda todas as tentativas: 1s + 2s = 3s + margem
            await new Promise(resolve => setTimeout(resolve, 3500));

            // Deve ter tentado 3 vezes
            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(3);
            
            // Aguarda a promise terminar
            await promise;
        }, 6000); // Timeout de 6 segundos

        it('deve aplicar exponential backoff entre tentativas', async () => {
            const startTime = Date.now();
            
            uploadRepositoryMock.deleteFile
                .mockRejectedValueOnce(new Error('Tentativa 1'))
                .mockRejectedValueOnce(new Error('Tentativa 2'))
                .mockResolvedValueOnce();

            await service.deleteFotoComRetry('http://minio.example.com/bucket/file.jpg', 3);

            const endTime = Date.now();
            const elapsed = endTime - startTime;

            // Deve ter aguardado aproximadamente: 1000ms (1ª retry) + 2000ms (2ª retry) = 3000ms
            expect(elapsed).toBeGreaterThanOrEqual(2900); // Margem de 100ms
            expect(uploadRepositoryMock.deleteFile).toHaveBeenCalledTimes(3);
        });
    });
});