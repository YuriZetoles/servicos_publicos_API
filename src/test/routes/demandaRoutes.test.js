import express from "express";
import demandaRoutes from "../../routes/demandaRoutes.js";
import DbConnect from "../../config/dbConnect.js";
import request from "supertest";
import errorHandler from "../../utils/helpers/errorHandler.js";
import fakebr from 'faker-br';
import { v4 as uuid } from 'uuid';
import authRoutes from '../../routes/authRoutes.js'

let app;
let token;
let DemandaID

beforeAll(async () => {
  app = express();
  await DbConnect.conectar();
  app.use(express.json());
  app.use(authRoutes);
  app.use(demandaRoutes);
  app.use(errorHandler);

    const loginRes = await request(app)
      .post('/login')
      .send({ identificador: "admin@exemplo.com", senha: "Senha@123" });
    
    token = loginRes.body.data.user.accessToken;    const Demandares = await request(app).get('/demandas').set('Authorization', `Bearer ${token}`)
          DemandaID = Demandares.body?.data?.docs[0]?._id;
          expect(DemandaID).toBeTruthy();
});

describe('Rotas de demanda', () => {
  it('GET - Deve retornar uma lista das demandas cadastradas', async () => {
    const res = await request(app).get("/demandas").set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Requisição bem-sucedida");
  });

  it('GET - Deve retornar uma demanda pelo ID', async () => {
    const res = await request(app).get(`/demandas/${DemandaID}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Requisição bem-sucedida");
    expect(res.body.data._id).toBe(DemandaID);
  });

  it('GET - Deve retornar erro de recurso não encontrado em demanda pelo ID não existente', async () => {
    const res = await request(app).get(`/demandas/686839b21eb194e97bf39133`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Recurso não encontrado em Demanda.");
  });

  it('POST - Deve cadastrar uma nova demanda com sucesso', async () => {
    const novaDemanda = {
      tipo: 'Coleta',
      status: 'Em andamento',
      data: new Date(),
      resolucao: "Teste de criação",
      descricao: "testando",
      feedback: 5,
      avaliacao_resolucao: "Excelente atendimento",
      link_imagem: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
      link_imagem_resolucao: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
      endereco: {
        logradouro: "Rua Nova",
        cep: "98765-432",
        bairro: "Jardim",
        numero: 200,
        complemento: "Casa",
        cidade: "Vilhena",
        estado: "RO"
      },
      usuarios: [],
    };
    const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message");
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("tipo", novaDemanda.tipo);
  });

  
  it('POST - Deve retornar erro ao cadastrar uma nova demanda com dados inválidos', async () => {
    const novaDemanda = {
      tipo: "",
      status: "Pendente",
      data: new Date(),
      resolucao: "Teste de criação",
      feedback: 5,
      avaliacao_resolucao: "Excelente atendimento",
      link_imagem_resolucao: ["https://via.placeholder.com/200.png"],
      endereco: {
        logradouro: "Rua Nova",
        cep: "98765-432",
        bairro: "Jardim",
        numero: 200,
        complemento: "Casa",
      },
      usuarios: [],
    };
    const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Erro de validação. 5 campo(s) inválido(s).");
  });
  
  // it('PATCH - Deve atualizar parcialmente uma demanda', async () => {
  //   const atualizacao = {
  //     status: "Concluída",
  //     descricao: fakebr.lorem.sentence()
  //   };
  //   const res = await request(app).patch(`/demandas/${DemandaID}`).send(atualizacao).set('Authorization', `Bearer ${token}`);
  //   expect(res.status).toBe(200);
  //   expect(res.body.data).toHaveProperty("status", atualizacao.status);
  // });

  it('PATCH - Deve retornar erro ao tentar atualizar uma demanda inexistente', async () => {
    const res = await request(app).patch(`/demandas/686839b21eb191e97bf39143`).send({
      status: "Em andamento"
    }).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Recurso não encontrado em Demanda.");
  });

  it('DELETE - Deve deletar uma demanda com sucesso', async () => {
    const novaDemanda = {
      tipo: 'Coleta',
      status: 'Em andamento',
      data: new Date(),
      resolucao: "Teste de criação",
      feedback: 5,
      descricao: "tests",
      avaliacao_resolucao: "Excelente atendimento",
      link_imagem: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
      link_imagem_resolucao: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
      endereco: {
        logradouro: "Rua Nova",
        cep: "98765-432",
        bairro: "Jardim",
        numero: 200,
        complemento: "Casa",
        cidade: "Vilhena",
        estado: "RO"
      },
      usuarios: [],
    };

    const post = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`)
    expect(post.status).toBe(201);

    const demandaId = post.body.data._id;

    const res = await request(app).delete(`/demandas/${demandaId}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Demanda excluída com sucesso!");
    expect(res.body.data._id).toBe(demandaId);
  });

  it('DELETE - Deve retornar erro ao tentar deletar uma demanda com id inválido', async () => {
    const res = await request(app).delete("/demandas/6839c69706ec18da71924bbb").set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Recurso não encontrado em Demanda.");
  });

  describe('Cenários Críticos - Arrays de Imagens', () => {
    it('POST - Deve aceitar múltiplas imagens em link_imagem como array', async () => {
      const novaDemanda = {
        tipo: 'Coleta',
        status: 'Em aberto',
        descricao: 'Teste com múltiplas imagens',
        link_imagem: [
          fakebr.internet.url() + "/" + uuid() + ".jpg",
          fakebr.internet.url() + "/" + uuid() + ".jpg",
          fakebr.internet.url() + "/" + uuid() + ".jpg"
        ],
        endereco: {
          logradouro: "Rua Teste",
          cep: "98765-432",
          bairro: "Centro",
          numero: 100,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      expect(Array.isArray(res.body.data.link_imagem)).toBe(true);
      expect(res.body.data.link_imagem.length).toBe(3);
    });

    it('POST - Deve aceitar demanda com array vazio de imagens', async () => {
      const novaDemanda = {
        tipo: 'Iluminação',
        status: 'Em aberto',
        descricao: 'Teste sem imagens',
        link_imagem: [],
        endereco: {
          logradouro: "Rua Escura",
          cep: "98765-432",
          bairro: "Periferia",
          numero: 50,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      expect(Array.isArray(res.body.data.link_imagem)).toBe(true);
      expect(res.body.data.link_imagem.length).toBe(0);
    });

    it('POST - Deve aceitar múltiplas imagens em link_imagem_resolucao', async () => {
      const novaDemanda = {
        tipo: 'Pavimentação',
        status: 'Concluída',
        descricao: 'Obra concluída com fotos antes e depois',
        resolucao: 'Pista recapeada completamente',
        link_imagem: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
        link_imagem_resolucao: [
          fakebr.internet.url() + "/" + uuid() + ".jpg",
          fakebr.internet.url() + "/" + uuid() + ".jpg"
        ],
        endereco: {
          logradouro: "Av. Principal",
          cep: "78965-432",
          bairro: "Centro",
          numero: 1,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      expect(Array.isArray(res.body.data.link_imagem_resolucao)).toBe(true);
      expect(res.body.data.link_imagem_resolucao.length).toBe(2);
    });

    it('PATCH - Deve permitir atualizar array de imagens com novas URLs', async () => {
      const novaDemanda = {
        tipo: 'Coleta',
        status: 'Em aberto',
        descricao: 'Para atualizar',
        link_imagem: [fakebr.internet.url() + "/" + uuid() + ".jpg"],
        endereco: {
          logradouro: "Rua Update",
          cep: "98765-432",
          bairro: "Centro",
          numero: 200,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };

      const postRes = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      const demandaId = postRes.body.data._id;

      const atualizacao = {
        link_imagem: [
          fakebr.internet.url() + "/" + uuid() + ".jpg",
          fakebr.internet.url() + "/" + uuid() + ".jpg"
        ]
      };

      const patchRes = await request(app).patch(`/demandas/${demandaId}`).send(atualizacao).set('Authorization', `Bearer ${token}`);
      expect(patchRes.status).toBe(200);
      expect(Array.isArray(patchRes.body.data.link_imagem)).toBe(true);
      expect(patchRes.body.data.link_imagem.length).toBe(2);
    });
  });

  describe('Cenários Críticos - Validação de Estados', () => {
    it('POST - Deve criar demanda com status padrão "Em aberto"', async () => {
      const novaDemanda = {
        tipo: 'Saneamento',
        descricao: 'Teste de status padrão',
        link_imagem: [],
        endereco: {
          logradouro: "Rua Saneamento",
          cep: "78965-432",
          bairro: "Zona Rural",
          numero: 500,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe("Em aberto");
    });

    it('POST - Deve validar tipos de demanda válidos', async () => {
      const tiposValidos = ["Coleta", "Iluminação", "Saneamento", "Árvores", "Animais", "Pavimentação"];
      
      for (const tipo of tiposValidos.slice(0, 2)) { // Testando 2 tipos para não poluir DB
        const novaDemanda = {
          tipo,
          descricao: `Teste de tipo ${tipo}`,
          link_imagem: [],
          endereco: {
            logradouro: "Rua Teste",
            cep: "78965-432",
            bairro: "Centro",
            numero: 100,
            cidade: "Vilhena",
            estado: "RO"
          },
          usuarios: [],
        };
        const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(201);
        expect(res.body.data.tipo).toBe(tipo);
      }
    });

    it('POST - Deve rejeitar tipo de demanda inválido', async () => {
      const novaDemanda = {
        tipo: 'TipoInexistente',
        descricao: 'Teste com tipo inválido',
        link_imagem: [],
        endereco: {
          logradouro: "Rua Teste",
          cep: "78965-432",
          bairro: "Centro",
          numero: 100,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Erro de validação");
    });
  });

  describe('Cenários Críticos - Campos Obrigatórios', () => {
    it('POST - Deve rejeitar demanda sem logradouro', async () => {
      const novaDemanda = {
        tipo: 'Coleta',
        descricao: 'Faltando logradouro',
        link_imagem: [],
        endereco: {
          cep: "78965-432",
          bairro: "Centro",
          numero: 100,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Erro de validação");
    });

    it('POST - Deve rejeitar demanda sem bairro', async () => {
      const novaDemanda = {
        tipo: 'Coleta',
        descricao: 'Faltando bairro',
        link_imagem: [],
        endereco: {
          logradouro: "Rua Teste",
          cep: "78965-432",
          numero: 100,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Erro de validação");
    });

    it('POST - Deve rejeitar demanda sem descricao', async () => {
      const novaDemanda = {
        tipo: 'Coleta',
        link_imagem: [],
        endereco: {
          logradouro: "Rua Teste",
          cep: "78965-432",
          bairro: "Centro",
          numero: 100,
          cidade: "Vilhena",
          estado: "RO"
        },
        usuarios: [],
      };
      const res = await request(app).post("/demandas").send(novaDemanda).set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(400);
      expect(res.body.message).toContain("Erro de validação");
    });
  });
});