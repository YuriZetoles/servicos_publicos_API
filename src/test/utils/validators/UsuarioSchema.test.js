import { UsuarioSchema, UsuarioUpdateSchema } from '../../../utils/validators/schemas/zod/UsuarioSchema.js';

describe('UsuarioSchema', () => {
  const dadosBase = {
    nome: "Maria da Silva",
    email: "maria@exemplo.com",
    senha: "Senha@123",
    link_imagem: "http://foto.com/maria.png",
    ativo: true,
    nome_social: "Maria",
    cpf: "12345678901",
    celular: "11987654321",
    cnh: "12345678901",
    data_nascimento: "15/03/1990",
    data_nomeacao: "01/01/2020",
    cargo: "Professora",
    formacao: "Pedagogia",
    nivel_acesso: {
      operador: true,
      administrador: false,
      secretario: false,
      municipe: true
    },
    portaria_nomeacao: "PORT123",
    endereco: {
      logradouro: "Rua das Flores",
      cep: "12345-678",
      bairro: "Centro",
      numero: 123,
      cidade: "São Paulo",
      estado: "SP"
    }
  };

  it('deve validar com dados completos e válidos', () => {
    const result = UsuarioSchema.safeParse(dadosBase);
    expect(result.success).toBe(true);
  });

  it('deve falhar se secretarias contiver ID inválido', () => {
    const invalido = { ...dadosBase, secretarias: ['1234'] };
    const result = UsuarioSchema.safeParse(invalido);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("ID inválido");
  });

  it('deve validar secretarias com IDs válidos', () => {
    const valido = { ...dadosBase, secretarias: ['507f1f77bcf86cd799439011'] };
    expect(UsuarioSchema.safeParse(valido).success).toBe(true);
  });

  it('deve falhar se grupo contiver ID inválido', () => {
    const invalido = { ...dadosBase, grupo: '1234' };
    const result = UsuarioSchema.safeParse(invalido);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toBe("ID de grupo inválido");
  });

  it('deve validar grupo com IDs válidos', () => {
    const valido = { ...dadosBase, grupo: '507f1f77bcf86cd799439011' };
    expect(UsuarioSchema.safeParse(valido).success).toBe(true);
  });


  describe('Validação da senha', () => {
    it('deve falhar se senha não tiver caractere especial', () => {
      const result = UsuarioSchema.safeParse({ ...dadosBase, senha: "Senha123" });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/A senha deve conter/);
    });

    it('deve permitir senha ausente (campo opcional)', () => {
      const { senha, ...dadosSemSenha } = dadosBase;
      const result = UsuarioSchema.safeParse(dadosSemSenha);
      expect(result.success).toBe(true);
    });
  });

  describe('Validações de CPF, celular e CNH', () => {
    const campos = ['cpf', 'celular', 'cnh'];
    campos.forEach((campo) => {
      it(`deve falhar se ${campo} não tiver 11 dígitos`, () => {
        const result = UsuarioSchema.safeParse({ ...dadosBase, [campo]: "12345" });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toMatch(/11 dígitos/);
      });
    });
  });

  describe('Validações do endereço', () => {
    it('deve falhar se o estado for inválido', () => {
      const result = UsuarioSchema.safeParse({
        ...dadosBase,
        endereco: { ...dadosBase.endereco, estado: "XX" }
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("Invalid enum value. Expected 'AC' | 'AL' | 'AP' | 'AM' | 'BA' | 'CE' | 'DF' | 'ES' | 'GO' | 'MA' | 'MT' | 'MS' | 'MG' | 'PA' | 'PB' | 'PR' | 'PE' | 'PI' | 'RJ' | 'RN' | 'RS' | 'RO' | 'RR' | 'SC' | 'SP' | 'SE' | 'TO', received 'XX'");
    });

    it('deve falhar com CEP inválido', () => {
      const result = UsuarioSchema.safeParse({
        ...dadosBase,
        endereco: { ...dadosBase.endereco, cep: "1234" }
      });
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toBe("CEP inválido");
    });
  });

  describe('Cenários Críticos - Relacionamento Singular com Grupo', () => {
    it('deve aceitar grupo como string (ObjectId singular)', () => {
      const valido = { ...dadosBase, grupo: '507f1f77bcf86cd799439011' };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.grupo).toBe('507f1f77bcf86cd799439011');
    });

    it('deve rejeitar grupo como array', () => {
      const invalido = { ...dadosBase, grupo: ['507f1f77bcf86cd799439011'] };
      const result = UsuarioSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });

    it('deve aceitar grupo como undefined (opcional)', () => {
      const valido = { ...dadosBase };
      delete valido.grupo;
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.grupo).toBeUndefined();
    });

    it('deve aceitar grupo como undefined', () => {
      const valido = { ...dadosBase, grupo: undefined };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.grupo).toBeUndefined();
    });

    it('deve rejeitar grupo com ObjectId inválido', () => {
      const invalido = { ...dadosBase, grupo: '1234' };
      const result = UsuarioSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });
  });

  describe('Cenários Críticos - Validação de Dados Obrigatórios', () => {
    it('deve falhar sem data_nascimento', () => {
      const { data_nascimento, ...dadosSemData } = dadosBase;
      const result = UsuarioSchema.safeParse(dadosSemData);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(i => i.path.includes('data_nascimento'))).toBe(true);
    });

    it('deve falhar sem email', () => {
      const { email, ...dadosSemEmail } = dadosBase;
      const result = UsuarioSchema.safeParse(dadosSemEmail);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(i => i.path.includes('email'))).toBe(true);
    });

    it('deve falhar sem nome', () => {
      const { nome, ...dadosSemNome } = dadosBase;
      const result = UsuarioSchema.safeParse(dadosSemNome);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(i => i.path.includes('nome'))).toBe(true);
    });
  });

  describe('Cenários Críticos - Validação de Arrays de Secretarias', () => {
    it('deve aceitar array vazio de secretarias', () => {
      const valido = { ...dadosBase, secretarias: [] };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.secretarias).toEqual([]);
    });

    it('deve aceitar múltiplos IDs válidos em secretarias', () => {
      const valido = {
        ...dadosBase,
        secretarias: [
          '507f1f77bcf86cd799439011',
          '507f1f77bcf86cd799439012',
          '507f1f77bcf86cd799439013'
        ]
      };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.secretarias.length).toBe(3);
    });

    it('deve rejeitar secretarias com um ID inválido', () => {
      const invalido = {
        ...dadosBase,
        secretarias: [
          '507f1f77bcf86cd799439011',
          'ID_INVALIDO'
        ]
      };
      const result = UsuarioSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });

    it('deve aceitar secretarias como undefined', () => {
      const { secretarias, ...dadosSemSecretarias } = dadosBase;
      const result = UsuarioSchema.safeParse(dadosSemSecretarias);
      expect(result.success).toBe(true);
    });
  });

  describe('Cenários Críticos - Validação de Dados de Acesso', () => {
    it('deve aceitar nivel_acesso com múltiplos perfis', () => {
      const valido = {
        ...dadosBase,
        nivel_acesso: {
          municipe: true,
          operador: true,
          secretario: true,
          administrador: false
        }
      };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
    });

    it('deve aceitar nivel_acesso com um único perfil', () => {
      const valido = {
        ...dadosBase,
        nivel_acesso: { municipe: true }
      };
      const result = UsuarioSchema.safeParse(valido);
      expect(result.success).toBe(true);
    });
  });

  describe('Cenários Críticos - Validação de Email', () => {
    it('deve rejeitar email sem @', () => {
      const invalido = { ...dadosBase, email: 'emailinvalido.com' };
      const result = UsuarioSchema.safeParse(invalido);
      expect(result.success).toBe(false);
      expect(result.error.issues[0].message).toMatch(/Formato de email inválido/);
    });

    it('deve rejeitar email vazio', () => {
      const invalido = { ...dadosBase, email: '' };
      const result = UsuarioSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });

    it('deve aceitar email válido com múltiplas extensões', () => {
      const validos = [
        'usuario@exemplo.com',
        'usuario@exemplo.co.uk',
        'usuario+tag@exemplo.com'
      ];

      validos.forEach(email => {
        const result = UsuarioSchema.safeParse({ ...dadosBase, email });
        expect(result.success).toBe(true);
      });
    });
  });
});
