// src/seeds/seedsTipoDemandaReais.js

import "dotenv/config";
import TipoDemanda from '../models/TipoDemanda.js';
import Usuario from "../models/Usuario.js";
import DbConnect from "../config/dbConnect.js";
import { tiposDemandaReais } from './data/tiposDemandaReais.js';
import gerarImagensUnicas from './utils/gerarImagensUnicas.js';

// Conexão com banco
await DbConnect.conectar();

/**
 * Seed para Tipos de Demanda com dados REAIS
 * Este seed:
 * 1. Gera imagens SVG padrão para cada tipo de demanda
 * 2. Popula o banco com dados reais de serviços públicos
 * 3. Associa as imagens geradas aos tipos de demanda
 */
async function seedTipoDemandaReais() {
  try {
    await TipoDemanda.deleteMany();
    console.log('Tipos de demanda antigos removidos');

    const usuarios = await Usuario.find();
    
    if (usuarios.length === 0) {
      throw new Error("Nenhum usuário encontrado. Execute o seed de usuários primeiro.");
    }

    const imagensGeradas = gerarImagensUnicas();
    console.log(`✓ ${Object.keys(imagensGeradas).length} imagens únicas geradas\n`);

    const tiposDemandaParaInserir = tiposDemandaReais.map((tipoDemanda, index) => {
      const numUsuarios = Math.floor(Math.random() * 3) + 1;
      const usuariosAleatorios = [];
      
      for (let i = 0; i < numUsuarios; i++) {
        const usuarioAleatorio = usuarios[Math.floor(Math.random() * usuarios.length)];
        if (!usuariosAleatorios.find(u => u.equals(usuarioAleatorio._id))) {
          usuariosAleatorios.push(usuarioAleatorio._id);
        }
      }

      // Monta o objeto do tipo de demanda
      const nomeImagem = tipoDemanda.imagemNome.replace('.svg', '');
      const linkImagem = imagensGeradas[nomeImagem] || tipoDemanda.imagemNome;

      return {
        titulo: tipoDemanda.titulo,
        descricao: tipoDemanda.descricao,
        subdescricao: tipoDemanda.subdescricao,
        tipo: tipoDemanda.tipo,
        icone: tipoDemanda.icone,
        link_imagem: linkImagem,
        usuarios: usuariosAleatorios
      };
    });

    const resultado = await TipoDemanda.insertMany(tiposDemandaParaInserir);
  } catch (error) {
    console.error('\n Erro ao executar seed de tipos de demanda:', error.message);
    throw error;
  }
}

export default seedTipoDemandaReais;
