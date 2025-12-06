import {
  DemandaSchema,
  DemandaUpdateSchema,
} from "../../../utils/validators/schemas/zod/DemandaSchema";
import mongoose from "mongoose";

const validObjectId = () => new mongoose.Types.ObjectId().toString();

const validDemanda = {
  tipo: "Coleta",
  status: "Em aberto",
  data: "2025-06-01T00:00:00Z",
  endereco: {
    logradouro: "Rua Exemplo",
    cep: "12345-678",
    bairro: "Centro",
    numero: 123,
    cidade: "Vilhena",
    estado: "RO",
  },
  usuarios: [validObjectId()],
  secretarias: [validObjectId()],
  resolucao: "Resolvido com sucesso.",
  feedback: 4,
  avaliacao_resolucao: "Ótima",
  link_imagem: ["https://exemplo.com/imagem.jpg"],
  motivo_devolucao: "Dados incompletos",
  link_imagem_resolucao: ["https://exemplo.com/imagem_resolucao.png"],
};

describe("DemandaSchema", () => {
  it("rejeita link_imagem_resolucao com extensão inválida", () => {
    const invalid = {
      ...validDemanda,
      link_imagem_resolucao: ["https://exemplo.com/arquivo.docx"],
    };
    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    // Procurar especificamente pelo campo com erro
    const issue = result.error.issues.find((i) =>
      i.path.includes("link_imagem_resolucao")
    );
    expect(issue?.message).toContain("extensão válida");
  });

  it("rejeita tipo inválido", () => {
    const invalid = { ...validDemanda, tipo: "Errado" };
    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain("Tipo inválido");
  });

  it("rejeita status inválido", () => {
    const invalid = { ...validDemanda, status: "Fechado" };
    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain("Status inválido");
  });

  it("rejeita CEP inválido", () => {
    const invalid = {
      ...validDemanda,
      endereco: { ...validDemanda.endereco, cep: "123" },
    };
    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    const issue = result.error.issues.find((i) => i.path.includes("cep"));
    expect(issue?.message).toContain("CEP inválido");
  });

  it("rejeita estado inválido", () => {
    const invalid = {
      ...validDemanda,
      endereco: { ...validDemanda.endereco, estado: "ZZ" },
    };
    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    const issue = result.error.issues.find((i) => i.path.includes("estado"));
    expect(issue?.message).toContain("Estado inválido");
  });

  it("rejeita link_imagem_resolucao com extensão inválida", () => {
    const invalid = {
      ...validDemanda,
      link_imagem_resolucao: ["https://exemplo.com/arquivo.exe"],
    };

    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    const issue = result.error.issues.find((i) =>
      i.path.includes("link_imagem_resolucao")
    );

    expect(issue?.message).toContain("extensão válida");
  });

  it("rejeita ID inválido em usuarios", () => {
    const invalid = {
      ...validDemanda,
      usuarios: ["id-invalido"],
    };

    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    const issue = result.error.issues.find((i) => i.path.includes("usuarios"));
    expect(issue?.message).toContain("ID inválido");
  });

  it("rejeita ID inválido em secretarias", () => {
    const invalid = {
      ...validDemanda,
      secretarias: ["12345"],
    };

    const result = DemandaSchema.safeParse(invalid);
    expect(result.success).toBe(false);

    const issue = result.error.issues.find((i) =>
      i.path.includes("secretarias")
    );
    expect(issue?.message).toContain("ID inválido");
  });
});

describe("DemandaUpdateSchema", () => {
  it("aceita objeto vazio (tudo opcional)", () => {
    const result = DemandaUpdateSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("valida um update parcial válido", () => {
    const update = {
      status: "Concluída",
      feedback: 5,
    };
    const result = DemandaUpdateSchema.safeParse(update);
    expect(result.success).toBe(true);
  });

  it("rejeita update parcial com tipo inválido", () => {
    const update = { tipo: "Errado" };
    const result = DemandaUpdateSchema.safeParse(update);
    expect(result.success).toBe(false);
    expect(result.error.issues[0].message).toContain("Tipo inválido");
  });

  describe('Cenários Críticos - Arrays de Imagens', () => {
    it('deve aceitar múltiplas imagens em link_imagem', () => {
      const valido = {
        ...validDemanda,
        link_imagem: [
          'https://exemplo.com/img1.jpg',
          'https://exemplo.com/img2.png',
          'https://exemplo.com/img3.jpeg'
        ]
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.link_imagem.length).toBe(3);
    });

    it('deve aceitar array vazio para link_imagem', () => {
      const valido = {
        ...validDemanda,
        link_imagem: []
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.link_imagem.length).toBe(0);
    });

    it('deve rejeitar link_imagem com extensão inválida', () => {
      const invalido = {
        ...validDemanda,
        link_imagem: [
          'https://exemplo.com/imagem.jpg',
          'https://exemplo.com/arquivo.exe' // Extensão inválida
        ]
      };
      const result = DemandaSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });

    it('deve aceitar múltiplas imagens em link_imagem_resolucao', () => {
      const valido = {
        ...validDemanda,
        link_imagem_resolucao: [
          'https://exemplo.com/before.jpg',
          'https://exemplo.com/after.jpg'
        ]
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.link_imagem_resolucao.length).toBe(2);
    });

    it('deve aceitar array vazio para link_imagem_resolucao', () => {
      const valido = {
        link_imagem_resolucao: []
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
    });

    it('deve rejeitar link_imagem_resolucao com extensão inválida', () => {
      const invalido = {
        link_imagem_resolucao: [
          'https://exemplo.com/resultado.jpg',
          'https://exemplo.com/documento.pdf' // Extensão inválida
        ]
      };
      const result = DemandaUpdateSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });
  });

  describe('Cenários Críticos - Validação de Usuários e Secretarias (Arrays)', () => {
    it('deve aceitar múltiplos usuários', () => {
      const valido = {
        ...validDemanda,
        usuarios: [validObjectId(), validObjectId(), validObjectId()]
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.usuarios.length).toBe(3);
    });

    it('deve aceitar array vazio de usuários', () => {
      const valido = {
        usuarios: []
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
    });

    it('deve aceitar múltiplas secretarias', () => {
      const valido = {
        secretarias: [validObjectId(), validObjectId()]
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
      expect(result.data.secretarias.length).toBe(2);
    });

    it('deve aceitar array vazio de secretarias', () => {
      const valido = {
        secretarias: []
      };
      const result = DemandaUpdateSchema.safeParse(valido);
      expect(result.success).toBe(true);
    });
  });

  describe('Cenários Críticos - Campos Obrigatórios', () => {
    it('deve rejeitar demanda sem tipo', () => {
      const { tipo, ...semTipo } = validDemanda;
      const result = DemandaSchema.safeParse(semTipo);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(i => i.path.includes('tipo'))).toBe(true);
    });

    it('deve rejeitar demanda sem endereco', () => {
      const { endereco, ...semEndereco } = validDemanda;
      const result = DemandaSchema.safeParse(semEndereco);
      expect(result.success).toBe(false);
      expect(result.error.issues.some(i => i.path.includes('endereco'))).toBe(true);
    });

    it('deve rejeitar demanda com endereco sem bairro', () => {
      const { bairro, ...enderecoInvalido } = validDemanda.endereco;
      const result = DemandaSchema.safeParse({
        ...validDemanda,
        endereco: enderecoInvalido
      });
      expect(result.success).toBe(false);
    });

    it('deve rejeitar demanda com endereco sem logradouro', () => {
      const { logradouro, ...enderecoInvalido } = validDemanda.endereco;
      const result = DemandaSchema.safeParse({
        ...validDemanda,
        endereco: enderecoInvalido
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Cenários Críticos - Status Válidos', () => {
    it('deve aceitar todos os status válidos', () => {
      const statusValidos = ['Em aberto', 'Em andamento', 'Concluída', 'Recusada'];

      statusValidos.forEach(status => {
        const result = DemandaUpdateSchema.safeParse({
          status
        });
        expect(result.success).toBe(true);
      });
    });

    it('deve rejeitar status não listado no enum', () => {
      const invalido = {
        status: 'Em espera' // Status não permitido
      };
      const result = DemandaUpdateSchema.safeParse(invalido);
      expect(result.success).toBe(false);
    });
  });
});

