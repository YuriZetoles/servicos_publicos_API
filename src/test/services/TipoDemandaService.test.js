import TipoDemandaService from '../../service/TipoDemandaService.js';
import TipoDemandaRepository from '../../repository/TipoDemandaRepository.js';
import UsuarioRepository from '../../repository/UsuarioRepository.js';
import UploadService from '../../service/UploadService.js';
import { CustomError, HttpStatusCodes } from '../../utils/helpers/index.js';

jest.mock('../../repository/TipoDemandaRepository.js');
jest.mock('../../repository/UsuarioRepository.js');
jest.mock('../../service/UploadService.js');

describe('TipoDemandaService', () => {
  let service;
  let repositoryMock;
  let userRepositoryMock;
  let uploadServiceMock;

  beforeEach(() => {
    repositoryMock = {
      listar: jest.fn(),
      criar: jest.fn(),
      atualizar: jest.fn(),
      deletar: jest.fn(),
      buscarPorID: jest.fn(),
      buscarPorTitulo: jest.fn(),
    };
    userRepositoryMock = {
      buscarPorID: jest.fn(),
    };
    uploadServiceMock = {
      processarFoto: jest.fn(),
      deleteFoto: jest.fn(),
    };

    TipoDemandaRepository.mockImplementation(() => repositoryMock);
    UsuarioRepository.mockImplementation(() => userRepositoryMock);
    UploadService.mockImplementation(() => uploadServiceMock);

    service = new TipoDemandaService();
  });

  it('Deve listar tipos de demanda', async () => {
    repositoryMock.listar.mockResolvedValue([{ titulo: 'Coleta de lixo' }]);

    const resultado = await service.listar({});

    expect(resultado).toEqual([{ titulo: 'Coleta de lixo' }]);
    expect(repositoryMock.listar).toHaveBeenCalled();
  });

  it('Deve criar um tipo de demanda com título único e tipo válido', async () => {
    const dados = { titulo: 'Nova Demanda', tipo: 'Coleta' };
    const req = { user_id: '507f1f77bcf86cd799439011' };

    repositoryMock.buscarPorTitulo.mockResolvedValue(null);
    repositoryMock.criar.mockResolvedValue(dados);

    const resultado = await service.criar(dados, req);

    expect(repositoryMock.buscarPorTitulo).toHaveBeenCalledWith('Nova Demanda', null);
    expect(repositoryMock.criar).toHaveBeenCalledWith({ ...dados, usuarios: [req.user_id] });
    expect(resultado).toEqual(dados);
  });

  it('Deve lançar erro ao tentar criar tipo de demanda com título já existente', async () => {
    const req = { user_id: '507f1f77bcf86cd799439011' };
    repositoryMock.buscarPorTitulo.mockResolvedValue({ titulo: 'Existente' });

    await expect(service.criar({ titulo: 'Existente', tipo: 'Coleta' }, req)).rejects.toThrow(CustomError);
  });

  it('Deve lançar erro ao tentar criar tipo de demanda com tipo inválido', async () => {
    const req = { user_id: '507f1f77bcf86cd799439011' };
    repositoryMock.buscarPorTitulo.mockResolvedValue(null);

    const dados = { titulo: 'Nova Demanda', tipo: 'Transporte' };

    await expect(service.criar(dados, req)).rejects.toThrow(CustomError);
  });

  it('Deve atualizar um tipo de demanda existente com dados válidos', async () => {
    const id = '123';
    const dados = { titulo: 'Atualizado', tipo: 'Saneamento' };

    repositoryMock.buscarPorID.mockResolvedValue({ _id: id });
    repositoryMock.buscarPorTitulo.mockResolvedValue(null);
    repositoryMock.atualizar.mockResolvedValue({ _id: id, ...dados });

    const resultado = await service.atualizar(id, dados);

    expect(repositoryMock.buscarPorID).toHaveBeenCalledWith(id);
    expect(repositoryMock.buscarPorTitulo).toHaveBeenCalledWith('Atualizado', id);
    expect(repositoryMock.atualizar).toHaveBeenCalledWith(id, dados);
    expect(resultado).toEqual({ _id: id, ...dados });
  });

  it('Deve lançar erro ao tentar atualizar tipo de demanda inexistente', async () => {
    repositoryMock.buscarPorID.mockResolvedValue(null);

    await expect(service.atualizar('id_invalido', { titulo: 'Teste', tipo: 'Coleta' })).rejects.toThrow(CustomError);
  });

  it('Deve deletar um tipo de demanda existente', async () => {
    const id = '123';
    repositoryMock.buscarPorID.mockResolvedValue({ _id: id });
    repositoryMock.deletar.mockResolvedValue({ acknowledged: true });

    const resultado = await service.deletar(id);

    expect(repositoryMock.buscarPorID).toHaveBeenCalledWith(id);
    expect(repositoryMock.deletar).toHaveBeenCalledWith(id);
    expect(resultado).toEqual({ acknowledged: true });
  });

  it('Deve lançar erro ao tentar deletar tipo de demanda inexistente', async () => {
    repositoryMock.buscarPorID.mockResolvedValue(null);

    await expect(service.deletar('id_invalido')).rejects.toThrow(CustomError);
  });

  // ================================
  // Testes para atualizarFoto
  // ================================
  describe('atualizarFoto', () => {
    it('deve atualizar foto com sucesso quando tipo demanda existe', async () => {
      const id = '123';
      const dados = { link_imagem: 'http://example.com/image.jpg' };
      const req = { user_id: 'user123' };

      repositoryMock.buscarPorID.mockResolvedValue({ _id: id });
      repositoryMock.atualizar.mockResolvedValue({ _id: id, ...dados });

      const resultado = await service.atualizarFoto(id, dados, req);

      expect(repositoryMock.buscarPorID).toHaveBeenCalledWith(id);
      expect(repositoryMock.atualizar).toHaveBeenCalledWith(id, dados);
      expect(resultado).toEqual({ _id: id, ...dados });
    });

    it('deve lançar erro quando tipo demanda não existe', async () => {
      repositoryMock.buscarPorID.mockResolvedValue(null);

      await expect(service.atualizarFoto('invalid_id', {}, {})).rejects.toThrow(CustomError);
    });
  });

  // ================================
  // Testes para processarFoto
  // ================================
  describe('processarFoto', () => {
    const mockFile = { buffer: Buffer.from('test'), mimetype: 'image/jpeg' };
    const mockReq = { user_id: 'user123' };
    const mockTipoDemandaId = 'tipo123';

    it('deve processar foto com sucesso para administrador', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { administrador: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        usuarios: [{ _id: 'user123' }]
      };
      const mockUploadResult = {
        url: 'http://minio.example.com/bucket/image.jpg',
        metadata: { size: 1024, format: 'jpeg' }
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);
      uploadServiceMock.processarFoto.mockResolvedValue(mockUploadResult);
      repositoryMock.atualizar.mockResolvedValue({});

      const resultado = await service.processarFoto(mockTipoDemandaId, mockFile, mockReq);

      expect(userRepositoryMock.buscarPorID).toHaveBeenCalledWith('user123');
      expect(repositoryMock.buscarPorID).toHaveBeenCalledWith(mockTipoDemandaId);
      expect(uploadServiceMock.processarFoto).toHaveBeenCalledWith(mockFile);
      expect(repositoryMock.atualizar).toHaveBeenCalledWith(mockTipoDemandaId, { link_imagem: mockUploadResult.url });
      expect(resultado).toEqual({
        fileName: mockUploadResult.url,
        metadata: mockUploadResult.metadata
      });
    });

    it('deve processar foto com sucesso para secretário relacionado', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { secretario: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        usuarios: [{ _id: 'user123' }]
      };
      const mockUploadResult = {
        url: 'http://minio.example.com/bucket/image.jpg',
        metadata: { size: 1024, format: 'jpeg' }
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);
      uploadServiceMock.processarFoto.mockResolvedValue(mockUploadResult);
      repositoryMock.atualizar.mockResolvedValue({});

      const resultado = await service.processarFoto(mockTipoDemandaId, mockFile, mockReq);

      expect(resultado).toEqual({
        fileName: mockUploadResult.url,
        metadata: mockUploadResult.metadata
      });
    });

    it('deve lançar erro quando usuário não é administrador nem secretário relacionado', async () => {
      const mockUsuario = {
        _id: 'user456',
        nivel_acesso: { secretario: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        usuarios: [{ _id: 'user123' }] // Usuário diferente
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);

      await expect(service.processarFoto(mockTipoDemandaId, mockFile, mockReq)).rejects.toThrow(CustomError);
      expect(uploadServiceMock.processarFoto).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando usuário é munícipe', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { municipe: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        usuarios: [{ _id: 'user123' }]
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);

      await expect(service.processarFoto(mockTipoDemandaId, mockFile, mockReq)).rejects.toThrow(CustomError);
    });

    it('deve deletar foto do MinIO quando atualização do banco falhar', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { administrador: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        usuarios: [{ _id: 'user123' }]
      };
      const mockUploadResult = {
        url: 'http://minio.example.com/bucket/image.jpg',
        metadata: { size: 1024, format: 'jpeg' }
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);
      uploadServiceMock.processarFoto.mockResolvedValue(mockUploadResult);
      repositoryMock.atualizar.mockRejectedValue(new Error('Database error'));

      await expect(service.processarFoto(mockTipoDemandaId, mockFile, mockReq)).rejects.toThrow('Database error');
      expect(uploadServiceMock.deleteFoto).toHaveBeenCalledWith(mockUploadResult.url);
    });

    it('deve lançar erro quando tipo demanda não existe', async () => {
      repositoryMock.buscarPorID.mockResolvedValue(null);

      await expect(service.processarFoto('invalid_id', mockFile, mockReq)).rejects.toThrow(CustomError);
      expect(uploadServiceMock.processarFoto).not.toHaveBeenCalled();
    });
  });

  // ================================
  // Testes para deletarFoto
  // ================================
  describe('deletarFoto', () => {
    const mockReq = { user_id: 'user123' };
    const mockTipoDemandaId = 'tipo123';

    it('deve deletar foto com sucesso para administrador', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { administrador: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        link_imagem: 'http://minio.example.com/bucket/image.jpg'
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);
      repositoryMock.atualizar.mockResolvedValue({});
      uploadServiceMock.deleteFoto.mockResolvedValue();

      await expect(service.deletarFoto(mockTipoDemandaId, mockReq)).resolves.toBeUndefined();

      expect(repositoryMock.atualizar).toHaveBeenCalledWith(mockTipoDemandaId, { link_imagem: '' });
      expect(uploadServiceMock.deleteFoto).toHaveBeenCalledWith(mockTipoDemanda.link_imagem);
    });

    it('deve lançar erro quando usuário não é administrador', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { secretario: true }
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue({ _id: mockTipoDemandaId });

      await expect(service.deletarFoto(mockTipoDemandaId, mockReq)).rejects.toThrow(CustomError);
      expect(uploadServiceMock.deleteFoto).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando tipo demanda não tem foto', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { administrador: true }
      };
      const mockTipoDemanda = {
        _id: mockTipoDemandaId,
        link_imagem: null
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);

      await expect(service.deletarFoto(mockTipoDemandaId, mockReq)).rejects.toThrow(CustomError);
      expect(uploadServiceMock.deleteFoto).not.toHaveBeenCalled();
    });

    it('deve lançar erro quando tipo demanda não existe', async () => {
      const mockUsuario = {
        _id: 'user123',
        nivel_acesso: { administrador: true }
      };

      userRepositoryMock.buscarPorID.mockResolvedValue(mockUsuario);
      repositoryMock.buscarPorID.mockResolvedValue(null);

      await expect(service.deletarFoto('invalid_id', mockReq)).rejects.toThrow(CustomError);
    });
  });

  // ================================
  // Testes para validarTipo
  // ================================
  describe('validarTipo', () => {
    it('deve aceitar tipos válidos', async () => {
      const tiposValidos = ['Coleta', 'Iluminação', 'Saneamento', 'Árvores', 'Animais', 'Pavimentação'];
      
      for (const tipo of tiposValidos) {
        await expect(service.validarTipo(tipo)).resolves.toBeUndefined();
      }
    });

    it('deve aceitar tipos válidos em minúsculo', async () => {
      const tiposMinusculos = ['coleta', 'iluminação', 'saneamento', 'árvores', 'animais', 'pavimentação'];
      
      for (const tipo of tiposMinusculos) {
        await expect(service.validarTipo(tipo)).resolves.toBeUndefined();
      }
    });

    it('deve aceitar tipos válidos sem acentuação', async () => {
      const tiposSemAcento = ['coleta', 'iluminacao', 'saneamento', 'arvores', 'animais', 'pavimentacao'];
      
      for (const tipo of tiposSemAcento) {
        await expect(service.validarTipo(tipo)).resolves.toBeUndefined();
      }
    });

    it('deve aceitar tipos válidos com maiúsculas e minúsculas misturadas', async () => {
      const tiposMisturados = ['COLETA', 'Iluminação', 'saneamento', 'ÁRVORES', 'Animais', 'Pavimentação'];
      
      for (const tipo of tiposMisturados) {
        await expect(service.validarTipo(tipo)).resolves.toBeUndefined();
      }
    });

    it('deve aceitar tipos válidos com acentuação parcial', async () => {
      const tiposParciais = ['coléta', 'iluminacao', 'saneamento', 'arvores', 'animais', 'pavimentação'];
      
      for (const tipo of tiposParciais) {
        await expect(service.validarTipo(tipo)).resolves.toBeUndefined();
      }
    });

    it('deve lançar erro para tipo inválido', async () => {
      const tiposInvalidos = ['Transporte', 'Saúde', 'Educação', '', null, undefined, 'coleta de lixo', 'iluminação pública'];
      
      for (const tipo of tiposInvalidos) {
        if (tipo !== null && tipo !== undefined) {
          await expect(service.validarTipo(tipo)).rejects.toThrow(CustomError);
        }
      }
    });
  });  // ================================
  // Testes para ensureTipoDemandaExists
  // ================================
  describe('ensureTipoDemandaExists', () => {
    it('deve retornar tipo demanda quando existe', async () => {
      const mockTipoDemanda = { _id: '123', titulo: 'Teste' };
      repositoryMock.buscarPorID.mockResolvedValue(mockTipoDemanda);

      const resultado = await service.ensureTipoDemandaExists('123');

      expect(repositoryMock.buscarPorID).toHaveBeenCalledWith('123');
      expect(resultado).toEqual(mockTipoDemanda);
    });

    it('deve lançar erro quando tipo demanda não existe', async () => {
      repositoryMock.buscarPorID.mockResolvedValue(null);

      await expect(service.ensureTipoDemandaExists('invalid_id')).rejects.toThrow(CustomError);
    });
  });

  // ================================
  // Testes para validarTitulo
  // ================================
  describe('validarTitulo', () => {
    it('deve aceitar título único', async () => {
      repositoryMock.buscarPorTitulo.mockResolvedValue(null);

      await expect(service.validarTitulo('Novo Título')).resolves.toBeUndefined();
      expect(repositoryMock.buscarPorTitulo).toHaveBeenCalledWith('Novo Título', null);
    });

    it('deve aceitar título único com ID de exclusão', async () => {
      const excludeId = 'exclude123';
      repositoryMock.buscarPorTitulo.mockResolvedValue(null);

      await expect(service.validarTitulo('Novo Título', excludeId)).resolves.toBeUndefined();
      expect(repositoryMock.buscarPorTitulo).toHaveBeenCalledWith('Novo Título', excludeId);
    });

    it('deve lançar erro quando título já existe', async () => {
      repositoryMock.buscarPorTitulo.mockResolvedValue({ titulo: 'Existente' });

      await expect(service.validarTitulo('Existente')).rejects.toThrow(CustomError);
    });
  });
});
