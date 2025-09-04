import "dotenv/config";
import { randomBytes as _randomBytes } from "crypto";
import TipoDemanda from '../models/TipoDemanda.js'
import Usuario from "../models/Usuario.js";
import getGlobalFakeMapping from "./globalFakeMapping.js";

// Conexão com banco
import DbConnect from "../config/dbConnect.js";

await DbConnect.conectar();

const globalFakeMapping = await getGlobalFakeMapping();

async function seedTipoDemanda() {
  await TipoDemanda.deleteMany();

  const usuarios = await Usuario.find();

  if (usuarios.length === 0) {
    throw new Error("Nenhum usuário encontrado. Rode o seed de usuários primeiro.");
  }

  const tipoDemanda = [];

  for (let i = 0; i <= 10; i++) {
    const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length )];

    tipoDemanda.push({
      titulo: globalFakeMapping.titulo(),
      icone: globalFakeMapping.icone(),
      descricao: globalFakeMapping.descricao(),
      subdescricao: globalFakeMapping.subdescricao(),
      link_imagem: globalFakeMapping.link_imagem(),
      usuarios: [usuarioAleatorio._id],
      tipo: globalFakeMapping.tipo()
    });
  }

  const result = await TipoDemanda.collection.insertMany(tipoDemanda);
  console.log(`${tipoDemanda.length} Tipos das Demandas inseridas com sucesso!`);

  return await TipoDemanda.find();
}

export default seedTipoDemanda;
