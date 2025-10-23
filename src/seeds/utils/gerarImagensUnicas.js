// src/seeds/utils/gerarImagensUnicas.js

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Gera SVGs únicos para cada tipo de demanda específico
 */
function gerarImagensUnicas() {
  const uploadsDir = path.join(__dirname, '../../../uploads');
  
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const cores = {
    coleta: { primaria: '#16a34a', secundaria: '#22c55e', fundo: '#dcfce7' },
    iluminacao: { primaria: '#eab308', secundaria: '#fbbf24', fundo: '#fef3c7' },
    pavimentacao: { primaria: '#64748b', secundaria: '#94a3b8', fundo: '#f1f5f9' },
    arvores: { primaria: '#15803d', secundaria: '#4ade80', fundo: '#d1fae5' },
    saneamento: { primaria: '#0284c7', secundaria: '#38bdf8', fundo: '#dbeafe' },
    animais: { primaria: '#dc2626', secundaria: '#f87171', fundo: '#fee2e2' }
  };

  const svgs = {
    // COLETA - 8 imagens
    'coleta-lixo-residencial.svg': gerarSVGColetaResidencial(cores.coleta),
    'coleta-entulho.svg': gerarSVGEntulho(cores.coleta),
    'coleta-seletiva.svg': gerarSVGSeletiva(cores.coleta),
    'coleta-eletronico.svg': gerarSVGEletronico(cores.coleta),
    'coleta-moveis.svg': gerarSVGMoveis(cores.coleta),
    'limpeza-terrenos.svg': gerarSVGTerrenos(cores.coleta),
    'coleta-hospitalar.svg': gerarSVGHospitalar(cores.coleta),
    'ponto-viciado.svg': gerarSVGPontoViciado(cores.coleta),

    // ILUMINAÇÃO - 8 imagens
    'lampada-queimada.svg': gerarSVGLampada(cores.iluminacao),
    'poste-apagado.svg': gerarSVGPosteApagado(cores.iluminacao),
    'poste-danificado.svg': gerarSVGPosteDanificado(cores.iluminacao),
    'iluminacao-piscando.svg': gerarSVGPiscando(cores.iluminacao),
    'iluminacao-pracas.svg': gerarSVGPracasIluminacao(cores.iluminacao),
    'novo-poste.svg': gerarSVGNovoPoste(cores.iluminacao),
    'luz-dia.svg': gerarSVGLuzDia(cores.iluminacao),
    'fiacao-exposta.svg': gerarSVGFiacao(cores.iluminacao),

    // PAVIMENTAÇÃO - 8 imagens
    'buraco-asfalto.svg': gerarSVGBuraco(cores.pavimentacao),
    'recapeamento.svg': gerarSVGRecapeamento(cores.pavimentacao),
    'calcada-quebrada.svg': gerarSVGCalcada(cores.pavimentacao),
    'meio-fio.svg': gerarSVGMeioFio(cores.pavimentacao),
    'pavimentacao-rua.svg': gerarSVGPavimentacao(cores.pavimentacao),
    'fiscalizacao-obras.svg': gerarSVGFiscalizacao(cores.pavimentacao),
    'tampa-bueiro.svg': gerarSVGTampaBueiro(cores.pavimentacao),
    'sinalizacao-rua.svg': gerarSVGSinalizacao(cores.pavimentacao),

    // ÁRVORES - 8 imagens
    'poda-arvore.svg': gerarSVGPoda(cores.arvores),
    'remocao-arvore.svg': gerarSVGRemocao(cores.arvores),
    'plantio-arvore.svg': gerarSVGPlantio(cores.arvores),
    'arvore-doente.svg': gerarSVGDoente(cores.arvores),
    'manutencao-praca.svg': gerarSVGPraca(cores.arvores),
    'jardinagem.svg': gerarSVGJardinagem(cores.arvores),
    'capina-calcada.svg': gerarSVGCapina(cores.arvores),
    'raiz-calcada.svg': gerarSVGRaiz(cores.arvores),

    // SANEAMENTO - 8 imagens
    'bueiro-entupido.svg': gerarSVGBueiroEntupido(cores.saneamento),
    'vazamento-esgoto.svg': gerarSVGVazamentoEsgoto(cores.saneamento),
    'entupimento-esgoto.svg': gerarSVGEntupimentoEsgoto(cores.saneamento),
    'alagamento.svg': gerarSVGAlagamento(cores.saneamento),
    'falta-agua.svg': gerarSVGFaltaAgua(cores.saneamento),
    'vazamento-agua.svg': gerarSVGVazamentoAgua(cores.saneamento),
    'agua-parada.svg': gerarSVGAguaParada(cores.saneamento),
    'qualidade-agua.svg': gerarSVGQualidadeAgua(cores.saneamento),

    // ANIMAIS - 8 imagens
    'animal-abandonado.svg': gerarSVGAbandonado(cores.animais),
    'animal-ferido.svg': gerarSVGFerido(cores.animais),
    'controle-pragas.svg': gerarSVGPragas(cores.animais),
    'castracao.svg': gerarSVGCastracao(cores.animais),
    'vacinacao.svg': gerarSVGVacinacao(cores.animais),
    'maus-tratos.svg': gerarSVGMausTratos(cores.animais),
    'animal-silvestre.svg': gerarSVGSilvestre(cores.animais),
    'cao-perdido.svg': gerarSVGPerdido(cores.animais),
  };

  const imagensGeradas = {};
  let contador = 0;

  for (const [nomeArquivo, conteudoSVG] of Object.entries(svgs)) {
    const caminhoCompleto = path.join(uploadsDir, nomeArquivo);
    fs.writeFileSync(caminhoCompleto, conteudoSVG);
    imagensGeradas[nomeArquivo.replace('.svg', '')] = nomeArquivo;
    contador++;
    console.log(`✓ Imagem gerada: ${nomeArquivo}`);
  }

  console.log(`✓ ${contador} imagens geradas`);
  return imagensGeradas;
}

// Funções geradoras de SVG (exemplos - vou criar versões simplificadas mas únicas)

function gerarSVGBase(cores, conteudo) {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${cores.fundo}"/>
    ${conteudo}
  </svg>`;
}

// COLETA
function gerarSVGColetaResidencial(cores) {
  return gerarSVGBase(cores, `
    <rect x="250" y="200" width="120" height="180" fill="${cores.primaria}" rx="10"/>
    <rect x="240" y="180" width="140" height="30" fill="${cores.secundaria}" rx="8"/>
    <circle cx="310" cy="220" r="15" fill="${cores.fundo}"/>
    <path d="M 290 250 L 330 250 L 328 350 L 292 350 Z" fill="${cores.fundo}"/>
    <text x="400" y="350" font-size="80" fill="${cores.primaria}" font-weight="bold">♻</text>
  `);
}

function gerarSVGEntulho(cores) {
  return gerarSVGBase(cores, `
    <rect x="200" y="300" width="400" height="150" fill="${cores.secundaria}" rx="10"/>
    <rect x="220" y="250" width="80" height="80" fill="${cores.primaria}" transform="rotate(15 260 290)"/>
    <rect x="320" y="270" width="70" height="70" fill="${cores.primaria}" transform="rotate(-10 355 305)"/>
    <rect x="420" y="260" width="90" height="90" fill="${cores.primaria}" transform="rotate(20 465 305)"/>
    <circle cx="300" cy="350" r="30" fill="${cores.primaria}"/>
    <circle cx="500" cy="360" r="25" fill="${cores.primaria}"/>
  `);
}

function gerarSVGSeletiva(cores) {
  return gerarSVGBase(cores, `
    <rect x="150" y="250" width="100" height="140" fill="#16a34a" rx="8"/>
    <rect x="300" y="250" width="100" height="140" fill="#0284c7" rx="8"/>
    <rect x="450" y="250" width="100" height="140" fill="#dc2626" rx="8"/>
    <text x="200" y="330" font-size="50" fill="#fff">♻</text>
    <text x="350" y="330" font-size="50" fill="#fff">📄</text>
    <text x="500" y="330" font-size="50" fill="#fff">🗑</text>
  `);
}

function gerarSVGEletronico(cores) {
  return gerarSVGBase(cores, `
    <rect x="250" y="200" width="300" height="200" fill="${cores.primaria}" rx="15"/>
    <rect x="270" y="220" width="260" height="150" fill="${cores.fundo}" rx="5"/>
    <circle cx="400" cy="420" r="15" fill="${cores.secundaria}"/>
    <rect x="350" y="280" width="100" height="60" fill="${cores.secundaria}" rx="5"/>
    <line x1="300" y1="450" x2="500" y2="450" stroke="${cores.secundaria}" stroke-width="4"/>
  `);
}

function gerarSVGMoveis(cores) {
  return gerarSVGBase(cores, `
    <rect x="200" y="250" width="150" height="180" fill="${cores.primaria}" rx="10"/>
    <rect x="220" y="270" width="110" height="80" fill="${cores.fundo}" rx="5"/>
    <rect x="225" y="360" width="100" height="60" fill="${cores.secundaria}" rx="5"/>
    <circle cx="245" cy="430" r="12" fill="${cores.primaria}"/>
    <circle cx="305" cy="430" r="12" fill="${cores.primaria}"/>
    <rect x="400" y="300" width="120" height="150" fill="${cores.secundaria}" rx="8"/>
  `);
}

function gerarSVGTerrenos(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="350" width="600" height="150" fill="${cores.secundaria}"/>
    <path d="M 150 350 L 180 320 L 200 350 Z" fill="${cores.primaria}"/>
    <path d="M 300 350 L 340 310 L 370 350 Z" fill="${cores.primaria}"/>
    <path d="M 500 350 L 530 330 L 550 350 Z" fill="${cores.primaria}"/>
    <rect x="200" y="380" width="60" height="40" fill="${cores.primaria}"/>
    <rect x="400" y="390" width="80" height="50" fill="${cores.primaria}"/>
  `);
}

function gerarSVGHospitalar(cores) {
  return gerarSVGBase(cores, `
    <rect x="300" y="200" width="200" height="250" fill="${cores.primaria}" rx="10"/>
    <rect x="370" y="240" width="60" height="20" fill="#fff"/>
    <rect x="380" y="230" width="40" height="40" fill="#fff"/>
    <circle cx="400" cy="350" r="50" fill="${cores.secundaria}"/>
    <rect x="380" y="330" width="40" height="10" fill="#dc2626"/>
    <rect x="395" y="315" width="10" height="40" fill="#dc2626"/>
  `);
}

function gerarSVGPontoViciado(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="400" rx="200" ry="100" fill="${cores.secundaria}"/>
    <rect x="250" y="320" width="60" height="80" fill="${cores.primaria}" transform="rotate(15 280 360)"/>
    <rect x="350" y="300" width="80" height="100" fill="${cores.primaria}" transform="rotate(-20 390 350)"/>
    <rect x="480" y="310" width="70" height="90" fill="${cores.primaria}" transform="rotate(10 515 355)"/>
    <circle cx="300" cy="380" r="25" fill="${cores.primaria}"/>
    <circle cx="500" cy="390" r="30" fill="${cores.primaria}"/>
  `);
}

// ILUMINAÇÃO
function gerarSVGLampada(cores) {
  return gerarSVGBase(cores, `
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b"/>
    <circle cx="400" cy="200" r="35" fill="${cores.primaria}"/>
    <line x1="360" y1="200" x2="320" y2="200" stroke="${cores.primaria}" stroke-width="3"/>
    <line x1="440" y1="200" x2="480" y2="200" stroke="${cores.primaria}" stroke-width="3"/>
    <line x1="370" y1="165" x2="350" y2="145" stroke="${cores.primaria}" stroke-width="3"/>
    <line x1="430" y1="165" x2="450" y2="145" stroke="${cores.primaria}" stroke-width="3"/>
  `);
}

function gerarSVGPosteApagado(cores) {
  return gerarSVGBase(cores, `
    <rect width="100%" height="100%" fill="#1e293b"/>
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b"/>
    <circle cx="400" cy="200" r="35" fill="#374151"/>
    <text x="400" y="350" font-size="60" fill="#64748b" text-anchor="middle">❌</text>
  `);
}

function gerarSVGPosteDanificado(cores) {
  return gerarSVGBase(cores, `
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5" transform="rotate(-15 400 350)"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b" transform="rotate(-15 400 205)"/>
    <line x1="380" y1="300" x2="420" y2="340" stroke="#dc2626" stroke-width="4"/>
    <line x1="380" y1="340" x2="420" y2="300" stroke="#dc2626" stroke-width="4"/>
    <circle cx="400" cy="200" r="35" fill="#6b7280" transform="rotate(-15 400 200)"/>
  `);
}

function gerarSVGPiscando(cores) {
  return gerarSVGBase(cores, `
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b"/>
    <circle cx="400" cy="200" r="35" fill="${cores.primaria}"/>
    <circle cx="400" cy="200" r="50" fill="${cores.primaria}" opacity="0.3"/>
    <circle cx="400" cy="200" r="65" fill="${cores.primaria}" opacity="0.15"/>
    <text x="450" y="250" font-size="40">⚡</text>
  `);
}

function gerarSVGPracasIluminacao(cores) {
  return gerarSVGBase(cores, `
    <rect x="200" y="400" width="400" height="120" fill="#15803d" rx="10"/>
    <circle cx="300" cy="380" r="40" fill="#4ade80"/>
    <circle cx="500" cy="380" r="40" fill="#4ade80"/>
    <rect x="370" y="250" width="60" height="250" fill="#475569" rx="5"/>
    <path d="M 320 270 L 480 270 L 460 310 L 340 310 Z" fill="#64748b"/>
    <circle cx="400" cy="290" r="30" fill="${cores.primaria}"/>
    <ellipse cx="400" cy="350" rx="120" ry="60" fill="${cores.primaria}" opacity="0.3"/>
  `);
}

function gerarSVGNovoPoste(cores) {
  return gerarSVGBase(cores, `
    <rect x="370" y="250" width="60" height="300" fill="${cores.primaria}" rx="5" opacity="0.3" stroke-dasharray="10,5" stroke="${cores.primaria}" stroke-width="3"/>
    <text x="400" y="400" font-size="120" text-anchor="middle" fill="${cores.primaria}">+</text>
    <circle cx="400" cy="230" r="40" fill="${cores.secundaria}" opacity="0.5"/>
  `);
}

function gerarSVGLuzDia(cores) {
  return gerarSVGBase(cores, `
    <rect width="100%" height="100%" fill="#bfdbfe"/>
    <circle cx="650" cy="100" r="60" fill="#fbbf24"/>
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b"/>
    <circle cx="400" cy="200" r="35" fill="${cores.primaria}"/>
    <text x="200" y="300" font-size="40" fill="#64748b">☀️ 12:00</text>
  `);
}

function gerarSVGFiacao(cores) {
  return gerarSVGBase(cores, `
    <rect x="370" y="150" width="60" height="400" fill="#475569" rx="5"/>
    <path d="M 320 180 L 480 180 L 460 230 L 340 230 Z" fill="#64748b"/>
    <path d="M 420 200 Q 450 250 480 300" stroke="#fbbf24" stroke-width="5" fill="none"/>
    <path d="M 430 210 Q 470 270 500 330" stroke="#fbbf24" stroke-width="4" fill="none"/>
    <circle cx="480" cy="300" r="8" fill="#dc2626"/>
    <text x="520" y="280" font-size="40" fill="#dc2626">⚡</text>
  `);
}

// PAVIMENTAÇÃO
function gerarSVGBuraco(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="300" width="800" height="300" fill="${cores.primaria}"/>
    <ellipse cx="400" cy="400" rx="100" ry="50" fill="#0f172a"/>
    <ellipse cx="395" cy="395" rx="90" ry="45" fill="#1e293b"/>
    <line x1="300" y1="350" x2="500" y2="350" stroke="${cores.secundaria}" stroke-width="4"/>
  `);
}

function gerarSVGRecapeamento(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="300" width="800" height="150" fill="#1f2937"/>
    <rect x="0" y="450" width="800" height="150" fill="${cores.primaria}"/>
    <rect x="200" y="350" width="400" height="50" fill="${cores.secundaria}" opacity="0.7"/>
    <path d="M 300 380 L 320 400 L 300 420" fill="none" stroke="#fbbf24" stroke-width="3"/>
    <path d="M 400 380 L 420 400 L 400 420" fill="none" stroke="#fbbf24" stroke-width="3"/>
    <path d="M 500 380 L 520 400 L 500 420" fill="none" stroke="#fbbf24" stroke-width="3"/>
  `);
}

function gerarSVGCalcada(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="300" width="600" height="200" fill="${cores.primaria}"/>
    <line x1="100" y1="400" x2="700" y2="400" stroke="#fff" stroke-width="2" opacity="0.3"/>
    <line x1="400" y1="300" x2="400" y2="500" stroke="#fff" stroke-width="2" opacity="0.3"/>
    <path d="M 350 350 L 380 380 L 420 370 L 450 390 L 420 420 L 380 410" fill="#dc2626"/>
    <text x="400" y="450" font-size="40" text-anchor="middle">⚠️</text>
  `);
}

function gerarSVGMeioFio(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="400" width="800" height="200" fill="${cores.primaria}"/>
    <rect x="0" y="380" width="800" height="40" fill="${cores.secundaria}"/>
    <rect x="200" y="380" width="150" height="40" fill="#dc2626" opacity="0.7"/>
    <rect x="500" y="380" width="100" height="40" fill="#dc2626" opacity="0.7"/>
  `);
}

function gerarSVGPavimentacao(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="400" width="800" height="200" fill="#d4a574"/>
    <rect x="100" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
    <rect x="190" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
    <rect x="280" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
    <rect x="370" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
    <rect x="460" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
    <rect x="550" y="420" width="80" height="40" fill="${cores.primaria}" rx="3"/>
  `);
}

function gerarSVGFiscalizacao(cores) {
  return gerarSVGBase(cores, `
    <rect x="200" y="250" width="400" height="250" fill="${cores.secundaria}" rx="10"/>
    <rect x="220" y="270" width="360" height="30" fill="#fbbf24" rx="5"/>
    <rect x="220" y="310" width="50" height="180" fill="${cores.primaria}"/>
    <rect x="280" y="310" width="50" height="180" fill="${cores.primaria}"/>
    <rect x="340" y="310" width="50" height="180" fill="${cores.primaria}"/>
    <text x="400" y="380" font-size="80" text-anchor="middle">🚧</text>
  `);
}

function gerarSVGTampaBueiro(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="300" width="800" height="300" fill="${cores.primaria}"/>
    <circle cx="400" cy="420" r="80" fill="${cores.secundaria}"/>
    <circle cx="400" cy="420" r="60" fill="${cores.primaria}"/>
    <circle cx="400" cy="420" r="10" fill="${cores.fundo}"/>
    <circle cx="370" cy="420" r="8" fill="${cores.fundo}"/>
    <circle cx="430" cy="420" r="8" fill="${cores.fundo}"/>
    <circle cx="400" cy="390" r="8" fill="${cores.fundo}"/>
    <circle cx="400" cy="450" r="8" fill="${cores.fundo}"/>
  `);
}

function gerarSVGSinalizacao(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="400" width="800" height="200" fill="${cores.primaria}"/>
    <rect x="100" y="450" width="200" height="80" fill="#fff" rx="10"/>
    <path d="M 100 490 L 300 490" stroke="#fbbf24" stroke-width="15"/>
    <circle cx="550" cy="350" r="50" fill="#dc2626"/>
    <rect x="530" y="320" width="40" height="10" fill="#fff"/>
    <text x="650" y="380" font-size="60">🚸</text>
  `);
}

// ÁRVORES
function gerarSVGPoda(cores) {
  return gerarSVGBase(cores, `
    <rect x="350" y="300" width="100" height="250" fill="#78350f"/>
    <circle cx="400" cy="250" r="120" fill="${cores.primaria}"/>
    <circle cx="350" cy="200" r="80" fill="${cores.secundaria}"/>
    <circle cx="450" cy="200" r="80" fill="${cores.secundaria}"/>
    <path d="M 500 150 L 520 130 L 540 150 L 560 130" stroke="#dc2626" stroke-width="4" fill="none"/>
    <text x="550" y="200" font-size="40">✂️</text>
  `);
}

function gerarSVGRemocao(cores) {
  return gerarSVGBase(cores, `
    <rect x="300" y="450" width="200" height="80" fill="#78350f" transform="rotate(-20 400 490)"/>
    <circle cx="280" cy="430" r="90" fill="${cores.primaria}" transform="rotate(-20 300 430)"/>
    <circle cx="250" cy="380" r="60" fill="${cores.secundaria}" transform="rotate(-20 250 380)"/>
    <circle cx="310" cy="370" r="60" fill="${cores.secundaria}" transform="rotate(-20 310 370)"/>
    <text x="550" y="400" font-size="80" fill="#dc2626">🪚</text>
  `);
}

function gerarSVGPlantio(cores) {
  return gerarSVGBase(cores, `
    <rect x="350" y="400" width="100" height="150" fill="#78350f"/>
    <circle cx="400" cy="350" r="80" fill="${cores.primaria}"/>
    <circle cx="360" cy="310" r="50" fill="${cores.secundaria}"/>
    <circle cx="440" cy="310" r="50" fill="${cores.secundaria}"/>
    <rect x="300" y="500" width="200" height="50" fill="${cores.secundaria}" rx="5"/>
    <text x="250" y="450" font-size="60">🌱</text>
  `);
}

function gerarSVGDoente(cores) {
  return gerarSVGBase(cores, `
    <rect x="350" y="300" width="100" height="250" fill="#78350f"/>
    <circle cx="400" cy="250" r="120" fill="${cores.primaria}" opacity="0.5"/>
    <circle cx="350" cy="200" r="80" fill="${cores.secundaria}" opacity="0.5"/>
    <circle cx="450" cy="200" r="80" fill="${cores.secundaria}" opacity="0.5"/>
    <path d="M 370 240 L 390 260" stroke="#dc2626" stroke-width="4"/>
    <path d="M 370 260 L 390 240" stroke="#dc2626" stroke-width="4"/>
    <path d="M 410 240 L 430 260" stroke="#dc2626" stroke-width="4"/>
    <path d="M 410 260 L 430 240" stroke="#dc2626" stroke-width="4"/>
  `);
}

function gerarSVGPraca(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="400" width="600" height="150" fill="${cores.primaria}"/>
    <rect x="300" y="300" width="80" height="150" fill="#78350f"/>
    <circle cx="340" cy="270" r="80" fill="${cores.secundaria}"/>
    <rect x="200" y="450" width="100" height="80" fill="#78350f"/>
    <rect x="210" y="460" width="80" height="60" fill="${cores.fundo}"/>
    <circle cx="550" cy="480" r="30" fill="#fbbf24"/>
  `);
}

function gerarSVGJardinagem(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="450" width="600" height="100" fill="${cores.primaria}"/>
    <circle cx="200" cy="420" r="40" fill="#dc2626"/>
    <circle cx="280" cy="430" r="35" fill="#fbbf24"/>
    <circle cx="360" cy="420" r="40" fill="#a855f7"/>
    <circle cx="440" cy="430" r="35" fill="#ec4899"/>
    <circle cx="520" cy="420" r="40" fill="#f97316"/>
    <circle cx="600" cy="430" r="35" fill="#06b6d4"/>
    <text x="400" y="350" font-size="60" text-anchor="middle">🌺</text>
  `);
}

function gerarSVGCapina(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="400" width="600" height="150" fill="${cores.secundaria}"/>
    <path d="M 150 400 L 170 370 L 180 400 Z" fill="${cores.primaria}"/>
    <path d="M 250 400 L 280 360 L 300 400 Z" fill="${cores.primaria}"/>
    <path d="M 400 400 L 420 380 L 435 400 Z" fill="${cores.primaria}"/>
    <path d="M 550 400 L 580 370 L 600 400 Z" fill="${cores.primaria}"/>
    <rect x="300" y="200" width="200" height="150" fill="#78350f" rx="10"/>
    <line x1="350" y1="250" x2="450" y2="250" stroke="${cores.fundo}" stroke-width="3"/>
    <line x1="350" y1="280" x2="450" y2="280" stroke="${cores.fundo}" stroke-width="3"/>
  `);
}

function gerarSVGRaiz(cores) {
  return gerarSVGBase(cores, `
    <rect x="100" y="400" width="600" height="120" fill="${cores.secundaria}"/>
    <rect x="350" y="200" width="100" height="250" fill="#78350f"/>
    <circle cx="400" cy="180" r="100" fill="${cores.primaria}"/>
    <path d="M 400 300 Q 350 350 320 420" stroke="#78350f" stroke-width="15" fill="none"/>
    <path d="M 400 300 Q 450 350 480 420" stroke="#78350f" stroke-width="15" fill="none"/>
    <path d="M 300 420 L 330 450 L 360 440 L 380 460" stroke="#dc2626" stroke-width="4" fill="none"/>
  `);
}

// SANEAMENTO
function gerarSVGBueiroEntupido(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="300" width="800" height="300" fill="#64748b"/>
    <circle cx="400" cy="420" r="80" fill="#0f172a"/>
    <rect x="250" y="350" width="60" height="40" fill="${cores.primaria}" transform="rotate(15 280 370)"/>
    <rect x="350" y="360" width="50" height="30" fill="${cores.primaria}" transform="rotate(-10 375 375)"/>
    <rect x="480" y="355" width="70" height="45" fill="${cores.primaria}" transform="rotate(20 515 377)"/>
    <path d="M 350 480 Q 400 520 450 480" stroke="${cores.secundaria}" stroke-width="6" fill="none"/>
  `);
}

function gerarSVGVazamentoEsgoto(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="400" width="800" height="200" fill="#64748b"/>
    <ellipse cx="400" cy="450" rx="100" ry="60" fill="#78350f"/>
    <path d="M 350 400 Q 360 420 370 450" stroke="${cores.primaria}" stroke-width="8" fill="none"/>
    <path d="M 400 400 Q 410 420 420 450" stroke="${cores.primaria}" stroke-width="8" fill="none"/>
    <path d="M 450 400 Q 460 420 470 450" stroke="${cores.primaria}" stroke-width="8" fill="none"/>
    <text x="400" y="350" font-size="60" text-anchor="middle">💧</text>
  `);
}

function gerarSVGEntupimentoEsgoto(cores) {
  return gerarSVGBase(cores, `
    <rect x="200" y="250" width="400" height="200" fill="${cores.secundaria}" rx="10"/>
    <rect x="380" y="250" width="40" height="150" fill="${cores.primaria}"/>
    <circle cx="400" cy="350" r="60" fill="#dc2626"/>
    <text x="400" y="365" font-size="50" fill="#fff" text-anchor="middle">❌</text>
    <path d="M 250 470 L 290 500 L 330 480 L 370 510" stroke="${cores.primaria}" stroke-width="6" fill="none"/>
  `);
}

function gerarSVGAlagamento(cores) {
  return gerarSVGBase(cores, `
    <rect x="0" y="350" width="800" height="250" fill="${cores.secundaria}"/>
    <ellipse cx="200" cy="450" rx="80" ry="30" fill="${cores.primaria}" opacity="0.6"/>
    <ellipse cx="400" cy="470" rx="120" ry="40" fill="${cores.primaria}" opacity="0.6"/>
    <ellipse cx="600" cy="460" rx="90" ry="35" fill="${cores.primaria}" opacity="0.6"/>
    <path d="M 100 400 Q 150 380 200 400 Q 250 420 300 400" stroke="${cores.primaria}" stroke-width="4" fill="none"/>
    <path d="M 400 420 Q 450 400 500 420 Q 550 440 600 420" stroke="${cores.primaria}" stroke-width="4" fill="none"/>
    <text x="400" y="300" font-size="80" text-anchor="middle">🌊</text>
  `);
}

function gerarSVGFaltaAgua(cores) {
  return gerarSVGBase(cores, `
    <rect x="250" y="200" width="300" height="300" fill="${cores.secundaria}" rx="15"/>
    <path d="M 400 250 Q 350 350 400 450 Q 450 350 400 250 Z" fill="${cores.fundo}" opacity="0.3"/>
    <line x1="320" y1="220" x2="480" y2="380" stroke="#dc2626" stroke-width="8"/>
    <text x="400" y="520" font-size="40" text-anchor="middle" fill="#dc2626">VAZIO</text>
  `);
}

function gerarSVGVazamentoAgua(cores) {
  return gerarSVGBase(cores, `
    <rect x="300" y="100" width="200" height="400" fill="${cores.secundaria}" rx="10"/>
    <path d="M 350 250 Q 360 280 370 320" stroke="${cores.primaria}" stroke-width="6" fill="none"/>
    <path d="M 400 250 Q 410 280 420 320" stroke="${cores.primaria}" stroke-width="6" fill="none"/>
    <path d="M 450 250 Q 460 280 470 320" stroke="${cores.primaria}" stroke-width="6" fill="none"/>
    <ellipse cx="400" cy="450" rx="120" ry="50" fill="${cores.primaria}" opacity="0.6"/>
    <text x="550" y="300" font-size="60">💧</text>
  `);
}

function gerarSVGAguaParada(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="400" rx="250" ry="120" fill="${cores.secundaria}"/>
    <ellipse cx="400" cy="380" rx="200" ry="80" fill="${cores.primaria}"/>
    <circle cx="300" cy="370" r="8" fill="${cores.fundo}" opacity="0.6"/>
    <circle cx="350" cy="390" r="6" fill="${cores.fundo}" opacity="0.6"/>
    <circle cx="450" cy="380" r="7" fill="${cores.fundo}" opacity="0.6"/>
    <circle cx="500" cy="390" r="9" fill="${cores.fundo}" opacity="0.6"/>
    <text x="400" y="280" font-size="60" text-anchor="middle">🦟</text>
  `);
}

function gerarSVGQualidadeAgua(cores) {
  return gerarSVGBase(cores, `
    <rect x="250" y="200" width="300" height="300" fill="${cores.secundaria}" rx="15"/>
    <path d="M 400 250 Q 350 350 400 450 Q 450 350 400 250 Z" fill="${cores.primaria}"/>
    <circle cx="380" cy="320" r="15" fill="#78350f" opacity="0.4"/>
    <circle cx="420" cy="350" r="12" fill="#78350f" opacity="0.4"/>
    <circle cx="390" cy="380" r="18" fill="#78350f" opacity="0.4"/>
    <text x="400" y="520" font-size="40" text-anchor="middle" fill="#dc2626">?</text>
  `);
}

// ANIMAIS
function gerarSVGAbandonado(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="80" ry="100" fill="${cores.primaria}"/>
    <circle cx="380" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="420" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="370" cy="370" r="12" fill="#1f2937"/>
    <circle cx="430" cy="370" r="12" fill="#1f2937"/>
    <path d="M 380 400 L 400 410 L 420 400" stroke="#1f2937" stroke-width="3" fill="none"/>
    <text x="400" y="280" font-size="60" text-anchor="middle">💔</text>
  `);
}

function gerarSVGFerido(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="80" ry="100" fill="${cores.primaria}"/>
    <circle cx="380" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="420" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="370" cy="370" r="12" fill="#1f2937"/>
    <circle cx="430" cy="370" r="12" fill="#1f2937"/>
    <rect x="480" y="350" width="60" height="15" fill="#fff" rx="3"/>
    <rect x="502" y="330" width="16" height="55" fill="#fff" rx="3"/>
    <circle cx="510" cy="355" r="35" fill="#dc2626" opacity="0.8"/>
  `);
}

function gerarSVGPragas(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="300" cy="400" rx="40" ry="60" fill="#64748b"/>
    <circle cx="300" cy="360" r="35" fill="#64748b"/>
    <circle cx="280" cy="350" r="8" fill="#1f2937"/>
    <circle cx="320" cy="350" r="8" fill="#1f2937"/>
    <path d="M 280 430 L 270 470" stroke="#64748b" stroke-width="4"/>
    <path d="M 320 430 L 330 470" stroke="#64748b" stroke-width="4"/>
    <circle cx="500" cy="350" r="50" fill="#dc2626" opacity="0.8"/>
    <line x1="470" y1="320" x2="530" y2="380" stroke="#fff" stroke-width="6"/>
    <line x1="470" y1="380" x2="530" y2="320" stroke="#fff" stroke-width="6"/>
  `);
}

function gerarSVGCastracao(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="80" ry="100" fill="${cores.primaria}"/>
    <circle cx="380" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="420" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="370" cy="370" r="12" fill="#1f2937"/>
    <circle cx="430" cy="370" r="12" fill="#1f2937"/>
    <rect x="550" y="350" width="60" height="15" fill="#fff" rx="3"/>
    <rect x="572" y="330" width="16" height="55" fill="#fff" rx="3"/>
    <circle cx="580" cy="355" r="35" fill="#22c55e" opacity="0.8"/>
  `);
}

function gerarSVGVacinacao(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="350" cy="450" rx="70" ry="90" fill="${cores.primaria}"/>
    <circle cx="335" cy="390" r="55" fill="${cores.primaria}"/>
    <circle cx="365" cy="390" r="55" fill="${cores.primaria}"/>
    <circle cx="320" cy="380" r="10" fill="#1f2937"/>
    <circle cx="380" cy="380" r="10" fill="#1f2937"/>
    <rect x="450" y="250" width="30" height="120" fill="#94a3b8" rx="3"/>
    <rect x="440" y="240" width="50" height="20" fill="#64748b" rx="5"/>
    <path d="M 465 370 L 380 420" stroke="#fbbf24" stroke-width="4"/>
    <circle cx="465" cy="365" r="8" fill="#fbbf24"/>
    <text x="520" y="300" font-size="50">💉</text>
  `);
}

function gerarSVGMausTratos(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="80" ry="100" fill="${cores.primaria}"/>
    <circle cx="380" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="420" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="25" fill="${cores.primaria}"/>
    <path d="M 360 375 L 370 365" stroke="#1f2937" stroke-width="4"/>
    <path d="M 380 375 L 370 365" stroke="#1f2937" stroke-width="4"/>
    <path d="M 420 375 L 430 365" stroke="#1f2937" stroke-width="4"/>
    <path d="M 440 375 L 430 365" stroke="#1f2937" stroke-width="4"/>
    <path d="M 380 410 L 420 410" stroke="#1f2937" stroke-width="3"/>
    <circle cx="550" cy="250" r="80" fill="#dc2626" opacity="0.8"/>
    <text x="550" y="275" font-size="70" fill="#fff" text-anchor="middle">!</text>
  `);
}

function gerarSVGSilvestre(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="70" ry="90" fill="${cores.primaria}"/>
    <circle cx="385" cy="390" r="55" fill="${cores.primaria}"/>
    <circle cx="415" cy="390" r="55" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="30" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="30" fill="${cores.primaria}"/>
    <circle cx="370" cy="380" r="12" fill="#1f2937"/>
    <circle cx="430" cy="380" r="12" fill="#1f2937"/>
    <path d="M 380 410 L 400 420 L 420 410" stroke="#1f2937" stroke-width="3" fill="none"/>
    <path d="M 320 400 L 300 420 L 310 440" stroke="${cores.primaria}" stroke-width="8" fill="none"/>
    <path d="M 480 400 L 500 420 L 490 440" stroke="${cores.primaria}" stroke-width="8" fill="none"/>
    <text x="400" y="280" font-size="60" text-anchor="middle">🦊</text>
  `);
}

function gerarSVGPerdido(cores) {
  return gerarSVGBase(cores, `
    <ellipse cx="400" cy="450" rx="80" ry="100" fill="${cores.primaria}"/>
    <circle cx="380" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="420" cy="380" r="60" fill="${cores.primaria}"/>
    <circle cx="350" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="450" cy="360" r="25" fill="${cores.primaria}"/>
    <circle cx="370" cy="370" r="12" fill="#1f2937"/>
    <circle cx="430" cy="370" r="12" fill="#1f2937"/>
    <path d="M 375 405 L 425 405" stroke="#1f2937" stroke-width="3"/>
    <text x="400" y="270" font-size="80" text-anchor="middle">?</text>
    <circle cx="600" cy="250" r="60" fill="#fbbf24"/>
    <text x="600" y="270" font-size="50" fill="#1f2937" text-anchor="middle">🏠</text>
  `);
}

export default gerarImagensUnicas;
