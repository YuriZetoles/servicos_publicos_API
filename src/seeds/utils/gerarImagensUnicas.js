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

// Funções geradoras de SVG com design profissional e moderno

function gerarSVGBase(cores, conteudo) {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${cores.primaria}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${cores.primaria};stop-opacity:0.1" />
        <stop offset="100%" style="stop-color:${cores.secundaria};stop-opacity:0.05" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.15"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad-${cores.primaria})"/>
    ${conteudo}
  </svg>`;
}

// COLETA
function gerarSVGColetaResidencial(cores) {
  return gerarSVGBase(cores, `
    <!-- Lixeira moderna -->
    <g filter="url(#shadow)">
      <rect x="300" y="220" width="200" height="280" fill="${cores.primaria}" rx="15"/>
      <rect x="320" y="240" width="160" height="30" fill="rgba(255,255,255,0.2)" rx="5"/>
      <path d="M 360 290 L 440 290 L 435 460 L 365 460 Z" fill="rgba(255,255,255,0.15)" stroke="${cores.secundaria}" stroke-width="3"/>
      
      <!-- Detalhes da lixeira -->
      <line x1="340" y1="320" x2="460" y2="320" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <line x1="340" y1="370" x2="460" y2="370" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      <line x1="340" y1="420" x2="460" y2="420" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
      
      <!-- Símbolo de reciclagem moderno -->
      <circle cx="400" cy="140" r="50" fill="${cores.secundaria}" opacity="0.9"/>
      <path d="M 380 130 L 390 145 L 375 145 Z M 410 145 L 420 130 L 425 145 Z M 390 155 L 410 155 L 400 170 Z" 
            fill="#fff" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
    </g>
  `);
}

function gerarSVGEntulho(cores) {
  return gerarSVGBase(cores, `
    <!-- Caçamba de entulho -->
    <g filter="url(#shadow)">
      <path d="M 150 350 L 200 280 L 600 280 L 650 350 L 650 480 L 150 480 Z" 
            fill="${cores.primaria}" stroke="${cores.secundaria}" stroke-width="4"/>
      
      <!-- Entulho (blocos geométricos modernos) -->
      <rect x="220" y="320" width="70" height="70" fill="rgba(255,255,255,0.25)" rx="5" transform="rotate(12 255 355)"/>
      <rect x="340" y="310" width="80" height="80" fill="rgba(255,255,255,0.2)" rx="5" transform="rotate(-8 380 350)"/>
      <rect x="470" y="325" width="75" height="75" fill="rgba(255,255,255,0.3)" rx="5" transform="rotate(15 507 362)"/>
      
      <!-- Detalhes de tijolos/blocos -->
      <rect x="250" y="400" width="50" height="30" fill="rgba(220,90,70,0.6)" rx="3"/>
      <rect x="380" y="410" width="60" height="35" fill="rgba(220,90,70,0.5)" rx="3"/>
      <rect x="520" y="395" width="55" height="32" fill="rgba(220,90,70,0.55)" rx="3"/>
      
      <!-- Linha de contorno superior -->
      <path d="M 200 280 L 600 280" stroke="${cores.secundaria}" stroke-width="3" opacity="0.7"/>
    </g>
  `);
}

function gerarSVGSeletiva(cores) {
  return gerarSVGBase(cores, `
    <!-- Três lixeiras de coleta seletiva modernas -->
    <g filter="url(#shadow)">
      <!-- Lixeira Verde (Orgânico) -->
      <rect x="150" y="250" width="120" height="220" fill="#059669" rx="12"/>
      <rect x="165" y="270" width="90" height="25" fill="rgba(255,255,255,0.25)" rx="5"/>
      <circle cx="210" cy="360" r="35" fill="rgba(255,255,255,0.3)"/>
      <path d="M 195 345 L 205 360 L 190 360 Z M 215 360 L 225 345 L 230 360 Z M 205 370 L 215 370 L 210 385 Z" 
            fill="#fff" stroke="#fff" stroke-width="2"/>
      
      <!-- Lixeira Azul (Papel) -->
      <rect x="340" y="250" width="120" height="220" fill="#0284c7" rx="12"/>
      <rect x="355" y="270" width="90" height="25" fill="rgba(255,255,255,0.25)" rx="5"/>
      <rect x="375" y="340" width="50" height="60" fill="rgba(255,255,255,0.35)" rx="3"/>
      <line x1="385" y1="350" x2="415" y2="350" stroke="#fff" stroke-width="2"/>
      <line x1="385" y1="365" x2="415" y2="365" stroke="#fff" stroke-width="2"/>
      <line x1="385" y1="380" x2="415" y2="380" stroke="#fff" stroke-width="2"/>
      
      <!-- Lixeira Vermelha (Rejeito) -->
      <rect x="530" y="250" width="120" height="220" fill="#dc2626" rx="12"/>
      <rect x="545" y="270" width="90" height="25" fill="rgba(255,255,255,0.25)" rx="5"/>
      <circle cx="590" cy="360" r="30" fill="none" stroke="#fff" stroke-width="5"/>
      <line x1="575" y1="345" x2="605" y2="375" stroke="#fff" stroke-width="5"/>
    </g>
    
    <!-- Etiquetas -->
    <text x="210" y="510" font-family="Arial, sans-serif" font-size="18" fill="#059669" font-weight="bold" text-anchor="middle">ORGÂNICO</text>
    <text x="400" y="510" font-family="Arial, sans-serif" font-size="18" fill="#0284c7" font-weight="bold" text-anchor="middle">PAPEL</text>
    <text x="590" y="510" font-family="Arial, sans-serif" font-size="18" fill="#dc2626" font-weight="bold" text-anchor="middle">REJEITO</text>
  `);
}

function gerarSVGEletronico(cores) {
  return gerarSVGBase(cores, `
    <!-- Monitor/Tela moderna -->
    <g filter="url(#shadow)">
      <rect x="220" y="180" width="360" height="240" fill="#1f2937" rx="15"/>
      <rect x="240" y="200" width="320" height="180" fill="#3b82f6" rx="5"/>
      
      <!-- Detalhes da tela -->
      <circle cx="400" cy="390" r="8" fill="#6b7280"/>
      
      <!-- Base do monitor -->
      <rect x="360" y="420" width="80" height="15" fill="#374151" rx="3"/>
      <rect x="320" y="435" width="160" height="10" fill="#1f2937" rx="5"/>
      
      <!-- Smartphone -->
      <rect x="140" y="320" width="100" height="180" fill="#1f2937" rx="15"/>
      <rect x="150" y="340" width="80" height="140" fill="#60a5fa" rx="5"/>
      <circle cx="190" cy="490" r="6" fill="#4b5563"/>
      
      <!-- Tablet -->
      <rect x="560" y="280" width="140" height="200" fill="#1f2937" rx="15"/>
      <rect x="575" y="295" width="110" height="165" fill="#34d399" rx="5"/>
      <circle cx="630" cy="470" r="7" fill="#4b5563"/>
      
      <!-- Símbolo de reciclagem eletrônica -->
      <circle cx="400" cy="290" r="45" fill="rgba(34,197,94,0.9)"/>
      <path d="M 385 280 L 392 290 L 380 290 Z M 408 290 L 415 280 L 420 290 Z M 392 295 L 408 295 L 400 305 Z" 
            fill="#fff" stroke="#fff" stroke-width="2"/>
      <text x="400" y="325" font-family="Arial, sans-serif" font-size="12" fill="#fff" text-anchor="middle" font-weight="bold">e-lixo</text>
    </g>
  `);
}

function gerarSVGMoveis(cores) {
  return gerarSVGBase(cores, `
    <!-- Sofá moderno -->
    <g filter="url(#shadow)">
      <rect x="180" y="280" width="180" height="180" fill="${cores.primaria}" rx="15"/>
      <rect x="160" y="260" width="50" height="220" fill="${cores.primaria}" rx="10"/>
      <rect x="360" y="260" width="50" height="220" fill="${cores.primaria}" rx="10"/>
      <rect x="200" y="300" width="140" height="100" fill="rgba(255,255,255,0.2)" rx="10"/>
      
      <!-- Pés do sofá -->
      <circle cx="190" cy="470" r="15" fill="#374151"/>
      <circle cx="350" cy="470" r="15" fill="#374151"/>
      
      <!-- Mesa lateral -->
      <rect x="450" y="320" width="130" height="140" fill="${cores.secundaria}" rx="12"/>
      <rect x="465" y="335" width="100" height="15" fill="rgba(255,255,255,0.25)" rx="3"/>
      <line x1="480" y1="460" x2="480" y2="500" stroke="${cores.secundaria}" stroke-width="12"/>
      <line x1="550" y1="460" x2="550" y2="500" stroke="${cores.secundaria}" stroke-width="12"/>
      
      <!-- Ícone de remoção -->
      <circle cx="400" cy="180" r="50" fill="#ef4444" opacity="0.95"/>
      <path d="M 375 165 L 425 165 L 420 195 L 380 195 Z" fill="#fff"/>
      <rect x="385" y="200" width="30" height="5" fill="#fff" rx="2"/>
      <rect x="385" y="210" width="30" height="5" fill="#fff" rx="2"/>
      <rect x="385" y="220" width="30" height="5" fill="#fff" rx="2"/>
    </g>
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
    <!-- Poste de luz moderno -->
    <g filter="url(#shadow)">
      <rect x="380" y="200" width="40" height="350" fill="#4b5563" rx="5"/>
      
      <!-- Luminária moderna -->
      <path d="M 330 180 L 470 180 L 460 220 L 340 220 Z" fill="#1f2937"/>
      
      <!-- Lâmpada acesa -->
      <ellipse cx="400" cy="200" rx="50" ry="45" fill="${cores.primaria}" opacity="0.9"/>
      <ellipse cx="400" cy="200" rx="70" ry="60" fill="${cores.primaria}" opacity="0.3"/>
      <ellipse cx="400" cy="200" rx="90" ry="75" fill="${cores.primaria}" opacity="0.1"/>
      
      <!-- Raios de luz -->
      <line x1="400" y1="200" x2="320" y2="200" stroke="${cores.primaria}" stroke-width="3" opacity="0.6"/>
      <line x1="400" y1="200" x2="480" y2="200" stroke="${cores.primaria}" stroke-width="3" opacity="0.6"/>
      <line x1="400" y1="200" x2="340" y2="160" stroke="${cores.primaria}" stroke-width="2" opacity="0.5"/>
      <line x1="400" y1="200" x2="460" y2="160" stroke="${cores.primaria}" stroke-width="2" opacity="0.5"/>
      <line x1="400" y1="200" x2="340" y2="240" stroke="${cores.primaria}" stroke-width="2" opacity="0.5"/>
      <line x1="400" y1="200" x2="460" y2="240" stroke="${cores.primaria}" stroke-width="2" opacity="0.5"/>
      
      <!-- Base do poste -->
      <rect x="360" y="540" width="80" height="30" fill="#374151" rx="5"/>
    </g>
  `);
}

function gerarSVGPosteApagado(cores) {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-night" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1e293b;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="0" dy="4" stdDeviation="8" flood-opacity="0.3"/>
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad-night)"/>
    
    <!-- Poste sem luz -->
    <g filter="url(#shadow)">
      <rect x="380" y="200" width="40" height="350" fill="#374151" rx="5"/>
      <path d="M 330 180 L 470 180 L 460 220 L 340 220 Z" fill="#1f2937"/>
      
      <!-- Lâmpada apagada -->
      <ellipse cx="400" cy="200" rx="50" ry="45" fill="#4b5563" opacity="0.6"/>
      
      <!-- Ícone de alerta -->
      <circle cx="400" cy="370" r="60" fill="#dc2626" opacity="0.9"/>
      <text x="400" y="395" font-family="Arial, sans-serif" font-size="60" fill="#fff" text-anchor="middle" font-weight="bold">!</text>
      
      <!-- Base -->
      <rect x="360" y="540" width="80" height="30" fill="#1f2937" rx="5"/>
    </g>
    
    <!-- Lua para indicar noite -->
    <circle cx="650" cy="100" r="40" fill="#fbbf24" opacity="0.8"/>
    <circle cx="665" cy="95" r="40" fill="#1e293b"/>
  </svg>`;
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
    <!-- Poste com luz piscando/intermitente -->
    <g filter="url(#shadow)">
      <!-- Poste -->
      <rect x="370" y="200" width="60" height="400" fill="#475569" rx="5"/>
      <rect x="375" y="205" width="50" height="390" fill="#64748b" rx="4"/>
      
      <!-- Luminária -->
      <path d="M 320 230 L 480 230 L 460 280 L 340 280 Z" fill="#64748b"/>
      <path d="M 330 240 L 470 240 L 455 270 L 345 270 Z" fill="#94a3b8"/>
      
      <!-- Lâmpada piscando (efeitos de intermitência) -->
      <circle cx="400" cy="250" r="30" fill="#fbbf24" opacity="0.9"/>
      <circle cx="400" cy="250" r="45" fill="#fbbf24" opacity="0.4"/>
      <circle cx="400" cy="250" r="60" fill="#fbbf24" opacity="0.2"/>
      <circle cx="400" cy="250" r="75" fill="#fbbf24" opacity="0.1"/>
      
      <!-- Sinal de problema elétrico -->
      <polygon points="460,240 475,240 467,260" fill="#dc2626"/>
      <polygon points="465,245 470,245 467,255" fill="#fbbf24"/>
      
      <!-- Placa de alerta -->
      <rect x="500" y="350" width="120" height="90" fill="#f59e0b" rx="8"/>
      <text x="560" y="385" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">LUZ</text>
      <text x="560" y="410" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">PISCANDO</text>
    </g>
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
    <!-- Solicitação de novo poste -->
    <g filter="url(#shadow)">
      <!-- Solo/calçada -->
      <rect x="0" y="500" width="800" height="100" fill="#94a3b8"/>
      
      <!-- Marcação de onde será instalado (tracejado) -->
      <rect x="360" y="250" width="80" height="260" fill="none" stroke="#0ea5e9" stroke-width="4" stroke-dasharray="15,10" rx="6"/>
      
      <!-- Símbolo de novo poste (cruz/plus) -->
      <rect x="395" y="320" width="10" height="120" fill="#0ea5e9" opacity="0.7"/>
      <rect x="350" y="375" width="100" height="10" fill="#0ea5e9" opacity="0.7"/>
      
      <!-- Luminária planejada (esboço) -->
      <path d="M 330 280 L 470 280 L 455 320 L 345 320 Z" fill="none" stroke="#0ea5e9" stroke-width="3" stroke-dasharray="8,5"/>
      <circle cx="400" cy="300" r="25" fill="none" stroke="#fbbf24" stroke-width="3" stroke-dasharray="5,3"/>
      
      <!-- Placa de solicitação -->
      <rect x="500" y="330" width="150" height="120" fill="#10b981" rx="8"/>
      <text x="575" y="370" font-family="Arial" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">SOLICITAÇÃO</text>
      <text x="575" y="400" font-family="Arial" font-weight="bold" font-size="22" fill="#fff" text-anchor="middle">NOVO</text>
      <text x="575" y="430" font-family="Arial" font-weight="bold" font-size="22" fill="#fff" text-anchor="middle">POSTE</text>
    </g>
  `);
}

function gerarSVGLuzDia(cores) {
  return gerarSVGBase(cores, `
    <!-- Luz acesa durante o dia -->
    <g filter="url(#shadow)">
      <!-- Céu diurno -->
      <rect width="800" height="600" fill="#bfdbfe"/>
      
      <!-- Sol -->
      <circle cx="650" cy="120" r="55" fill="#fbbf24"/>
      <circle cx="650" cy="120" r="70" fill="#fbbf24" opacity="0.3"/>
      
      <!-- Raios de sol -->
      <line x1="650" y1="50" x2="650" y2="30" stroke="#fbbf24" stroke-width="4"/>
      <line x1="710" y1="80" x2="725" y2="65" stroke="#fbbf24" stroke-width="4"/>
      <line x1="720" y1="120" x2="740" y2="120" stroke="#fbbf24" stroke-width="4"/>
      <line x1="710" y1="160" x2="725" y2="175" stroke="#fbbf24" stroke-width="4"/>
      
      <!-- Poste -->
      <rect x="370" y="200" width="60" height="400" fill="#475569" rx="5"/>
      
      <!-- Luminária -->
      <path d="M 320 230 L 480 230 L 460 280 L 340 280 Z" fill="#64748b"/>
      
      <!-- Luz ACESA durante o dia (desperdício) -->
      <circle cx="400" cy="250" r="30" fill="#fbbf24"/>
      <ellipse cx="400" cy="320" rx="100" ry="70" fill="#fbbf24" opacity="0.4"/>
      
      <!-- Relógio indicando meio-dia -->
      <circle cx="200" cy="300" r="50" fill="#fff"/>
      <circle cx="200" cy="300" r="45" fill="#64748b"/>
      <line x1="200" y1="300" x2="200" y2="270" stroke="#fff" stroke-width="4"/>
      <line x1="200" y1="300" x2="220" y2="300" stroke="#fff" stroke-width="3"/>
      <text x="200" y="380" font-family="Arial" font-weight="bold" font-size="20" fill="#1f2937" text-anchor="middle">12:00</text>
      
      <!-- Placa de alerta -->
      <rect x="520" y="350" width="140" height="100" fill="#f59e0b" rx="8"/>
      <text x="590" y="390" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">LUZ ACESA</text>
      <text x="590" y="420" font-family="Arial" font-weight="bold" font-size="16" fill="#fff" text-anchor="middle">DE DIA</text>
    </g>
  `);
}

function gerarSVGFiacao(cores) {
  return gerarSVGBase(cores, `
    <!-- Fiação exposta/danificada -->
    <g filter="url(#shadow)">
      <!-- Poste -->
      <rect x="370" y="180" width="60" height="420" fill="#475569" rx="5"/>
      <rect x="375" y="185" width="50" height="410" fill="#64748b" rx="4"/>
      
      <!-- Luminária -->
      <path d="M 320 210 L 480 210 L 460 260 L 340 260 Z" fill="#64748b"/>
      <path d="M 330 220 L 470 220 L 455 250 L 345 250 Z" fill="#94a3b8"/>
      
      <!-- Fiação normal (superior) -->
      <path d="M 430 230 Q 470 250 510 270" stroke="#1f2937" stroke-width="6" fill="none"/>
      <path d="M 435 235 Q 475 255 515 275" stroke="#1f2937" stroke-width="5" fill="none"/>
      
      <!-- Fiação exposta/danificada (com isolamento rompido) -->
      <path d="M 430 260 Q 470 290 510 320" stroke="#fbbf24" stroke-width="6" fill="none"/>
      <path d="M 435 265 Q 480 300 520 335" stroke="#fbbf24" stroke-width="5" fill="none"/>
      
      <!-- Fios soltos/desencapados -->
      <path d="M 515 325 L 530 340" stroke="#dc2626" stroke-width="3" fill="none"/>
      <path d="M 520 330 L 540 350" stroke="#dc2626" stroke-width="3" fill="none"/>
      
      <!-- Faíscas/perigo elétrico -->
      <circle cx="515" cy="325" r="6" fill="#dc2626" opacity="0.8"/>
      <circle cx="515" cy="325" r="12" fill="#dc2626" opacity="0.4"/>
      <polygon points="530,315 540,315 535,330" fill="#dc2626"/>
      <polygon points="535,318 538,318 536,325" fill="#fbbf24"/>
      
      <!-- Placa de perigo -->
      <rect x="550" y="280" width="130" height="100" fill="#dc2626" rx="8"/>
      <text x="615" y="315" font-family="Arial" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">PERIGO</text>
      <text x="615" y="345" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">FIAÇÃO</text>
      <text x="615" y="370" font-family="Arial" font-weight="bold" font-size="16" fill="#fff" text-anchor="middle">EXPOSTA</text>
    </g>
  `);
}

// PAVIMENTAÇÃO
function gerarSVGBuraco(cores) {
  return gerarSVGBase(cores, `
    <!-- Asfalto -->
    <rect x="0" y="280" width="800" height="320" fill="#1f2937"/>
    
    <!-- Faixas da rua -->
    <rect x="0" y="420" width="200" height="15" fill="#fbbf24" opacity="0.8"/>
    <rect x="280" y="420" width="200" height="15" fill="#fbbf24" opacity="0.8"/>
    <rect x="560" y="420" width="200" height="15" fill="#fbbf24" opacity="0.8"/>
    
    <!-- Buraco principal com camadas de profundidade -->
    <g filter="url(#shadow)">
      <ellipse cx="400" cy="410" rx="130" ry="70" fill="#0a0a0a"/>
      <ellipse cx="400" cy="405" rx="115" ry="60" fill="#1a1a1a"/>
      <ellipse cx="400" cy="400" rx="100" ry="50" fill="#2a2a2a"/>
      
      <!-- Rachaduras ao redor -->
      <path d="M 280 380 L 320 390 L 300 410" stroke="#4b5563" stroke-width="3" fill="none"/>
      <path d="M 520 385 L 490 395 L 510 415" stroke="#4b5563" stroke-width="3" fill="none"/>
      <path d="M 350 350 L 370 370" stroke="#4b5563" stroke-width="2" fill="none"/>
      <path d="M 450 355 L 430 375" stroke="#4b5563" stroke-width="2" fill="none"/>
      
      <!-- Pedras soltas -->
      <ellipse cx="310" cy="395" rx="12" ry="8" fill="#6b7280"/>
      <ellipse cx="485" cy="390" rx="15" ry="10" fill="#6b7280"/>
      <ellipse cx="400" cy="465" rx="10" ry="6" fill="#6b7280"/>
    </g>
    
    <!-- Sinalização de perigo -->
    <g>
      <path d="M 150 200 L 200 280 L 100 280 Z" fill="#fbbf24" stroke="#1f2937" stroke-width="3"/>
      <text x="150" y="260" font-family="Arial, sans-serif" font-size="50" fill="#1f2937" text-anchor="middle" font-weight="bold">!</text>
    </g>
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
    <!-- Calçada danificada -->
    <g filter="url(#shadow)">
      <!-- Calçada -->
      <rect x="100" y="350" width="600" height="200" fill="#94a3b8"/>
      
      <!-- Padrão de blocos/ladrilhos -->
      <line x1="100" y1="450" x2="700" y2="450" stroke="#64748b" stroke-width="2" opacity="0.5"/>
      <line x1="400" y1="350" x2="400" y2="550" stroke="#64748b" stroke-width="2" opacity="0.5"/>
      <line x1="250" y1="350" x2="250" y2="550" stroke="#64748b" stroke-width="2" opacity="0.5"/>
      <line x1="550" y1="350" x2="550" y2="550" stroke="#64748b" stroke-width="2" opacity="0.5"/>
      
      <!-- Buraco/dano na calçada -->
      <path d="M 350 390 L 380 410 L 420 405 L 450 425 L 430 450 L 390 445 L 360 430 Z" fill="#1f2937"/>
      <path d="M 360 400 L 380 415 L 410 410 L 440 425 L 420 445 L 385 440 Z" fill="#475569"/>
      
      <!-- Detritos/terra no buraco -->
      <ellipse cx="400" cy="420" rx="35" ry="15" fill="#78350f" opacity="0.6"/>
      
      <!-- Placa de alerta -->
      <polygon points="400,310 375,360 425,360" fill="#fbbf24"/>
      <polygon points="400,320 380,355 420,355" fill="#fff"/>
      <text x="400" y="348" font-family="Arial" font-weight="bold" font-size="24" fill="#1f2937" text-anchor="middle">!</text>
    </g>
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
    <!-- Fiscalização de obras - área em construção -->
    <g filter="url(#shadow)">
      <!-- Asfalto/terreno -->
      <rect x="0" y="380" width="800" height="220" fill="#1f2937"/>
      
      <!-- Área demarcada -->
      <rect x="200" y="320" width="400" height="220" fill="#f59e0b" opacity="0.3" rx="8"/>
      
      <!-- Faixa zebrada (isolamento) -->
      <rect x="200" y="300" width="400" height="40" fill="#fbbf24"/>
      <rect x="200" y="300" width="40" height="40" fill="#1f2937"/>
      <rect x="280" y="300" width="40" height="40" fill="#1f2937"/>
      <rect x="360" y="300" width="40" height="40" fill="#1f2937"/>
      <rect x="440" y="300" width="40" height="40" fill="#1f2937"/>
      <rect x="520" y="300" width="40" height="40" fill="#1f2937"/>
      
      <!-- Cones de sinalização -->
      <polygon points="250,500 270,500 260,420" fill="#f59e0b"/>
      <rect x="255" y="490" width="10" height="15" fill="#1f2937"/>
      
      <polygon points="370,510 390,510 380,430" fill="#f59e0b"/>
      <rect x="375" y="500" width="10" height="15" fill="#1f2937"/>
      
      <polygon points="490,505 510,505 500,425" fill="#f59e0b"/>
      <rect x="495" y="495" width="10" height="15" fill="#1f2937"/>
      
      <!-- Placa de fiscalização -->
      <rect x="320" y="360" width="160" height="140" fill="#dc2626" rx="8"/>
      <text x="400" y="405" font-family="Arial" font-weight="bold" font-size="24" fill="#fff" text-anchor="middle">OBRA EM</text>
      <text x="400" y="435" font-family="Arial" font-weight="bold" font-size="24" fill="#fff" text-anchor="middle">ANDAMENTO</text>
      <text x="400" y="470" font-family="Arial" font-size="16" fill="#fff" text-anchor="middle">Fiscalização</text>
    </g>
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
    <!-- Sinalização viária - faixa de pedestres -->
    <g filter="url(#shadow)">
      <!-- Asfalto -->
      <rect x="0" y="350" width="800" height="250" fill="#1f2937"/>
      
      <!-- Faixa de pedestres (zebrada) -->
      <rect x="150" y="420" width="60" height="120" fill="#fff"/>
      <rect x="230" y="420" width="60" height="120" fill="#fff"/>
      <rect x="310" y="420" width="60" height="120" fill="#fff"/>
      <rect x="390" y="420" width="60" height="120" fill="#fff"/>
      <rect x="470" y="420" width="60" height="120" fill="#fff"/>
      <rect x="550" y="420" width="60" height="120" fill="#fff"/>
      
      <!-- Placa de sinalização (pedestre) -->
      <rect x="650" y="280" width="100" height="140" fill="#0284c7" rx="8"/>
      <circle cx="700" cy="320" r="15" fill="#fff"/>
      <rect x="693" y="335" width="14" height="30" fill="#fff"/>
      <polygon points="688,350 712,350 685,380 715,380" fill="#fff"/>
      
      <!-- Poste da placa -->
      <rect x="693" y="420" width="14" height="120" fill="#64748b"/>
      <rect x="685" y="535" width="30" height="15" fill="#475569"/>
      
      <!-- Símbolo de atenção no chão -->
      <polygon points="400,380 380,340 420,340" fill="#fbbf24"/>
      <text x="400" y="365" font-family="Arial" font-weight="bold" font-size="28" fill="#1f2937" text-anchor="middle">!</text>
    </g>
  `);
}

// ÁRVORES
function gerarSVGPoda(cores) {
  return gerarSVGBase(cores, `
    <!-- Árvore -->
    <g filter="url(#shadow)">
      <!-- Tronco -->
      <rect x="350" y="320" width="100" height="230" fill="#78350f" rx="10"/>
      <rect x="360" y="330" width="30" height="200" fill="rgba(0,0,0,0.2)"/>
      
      <!-- Copa da árvore -->
      <circle cx="400" cy="270" r="110" fill="${cores.primaria}" opacity="0.95"/>
      <circle cx="350" cy="230" r="75" fill="${cores.secundaria}" opacity="0.9"/>
      <circle cx="450" cy="230" r="75" fill="${cores.secundaria}" opacity="0.9"/>
      <circle cx="380" cy="310" r="60" fill="${cores.primaria}" opacity="0.85"/>
      <circle cx="420" cy="310" r="60" fill="${cores.primaria}" opacity="0.85"/>
      
      <!-- Detalhes de folhagem -->
      <circle cx="370" cy="250" r="25" fill="rgba(255,255,255,0.2)"/>
      <circle cx="430" cy="255" r="20" fill="rgba(255,255,255,0.15)"/>
    </g>
    
    <!-- Tesoura de poda profissional -->
    <g transform="translate(550, 200)">
      <circle cx="0" cy="0" r="55" fill="#ef4444" opacity="0.95"/>
      <!-- Lâminas da tesoura -->
      <path d="M -15 -10 L -25 -20 L -10 -25 L 0 -15 Z" fill="#fff"/>
      <path d="M 15 -10 L 25 -20 L 10 -25 L 0 -15 Z" fill="#fff"/>
      <!-- Cabos -->
      <rect x="-20" y="-15" width="6" height="25" fill="#374151" rx="3"/>
      <rect x="14" y="-15" width="6" height="25" fill="#374151" rx="3"/>
      <!-- Pivot -->
      <circle cx="0" cy="-15" r="4" fill="#1f2937"/>
    </g>
  `);
}

function gerarSVGRemocao(cores) {
  return gerarSVGBase(cores, `
    <!-- Árvore caída - remoção -->
    <g filter="url(#shadow)">
      <!-- Tronco deitado -->
      <rect x="200" y="380" width="350" height="70" fill="#78350f" rx="12"/>
      <rect x="210" y="390" width="330" height="25" fill="rgba(0,0,0,0.2)" rx="8"/>
      <!-- Anéis do tronco -->
      <ellipse cx="210" cy="415" rx="35" ry="35" fill="#92400e" opacity="0.6"/>
      <ellipse cx="210" cy="415" rx="25" ry="25" fill="#78350f" opacity="0.4"/>
      <ellipse cx="210" cy="415" rx="15" ry="15" fill="#92400e" opacity="0.3"/>
      
      <!-- Galhos espalhados -->
      <rect x="520" y="340" width="100" height="20" fill="#78350f" rx="8" transform="rotate(25 570 350)"/>
      <rect x="480" y="450" width="90" height="18" fill="#78350f" rx="8" transform="rotate(-30 525 459)"/>
      
      <!-- Folhas secas -->
      <circle cx="600" cy="350" r="25" fill="#78350f" opacity="0.5"/>
      <circle cx="580" cy="360" r="20" fill="#92400e" opacity="0.4"/>
      <circle cx="540" cy="470" r="22" fill="#78350f" opacity="0.5"/>
      
      <!-- Motosserra profissional -->
      <rect x="250" y="270" width="140" height="45" fill="#dc2626" rx="6"/>
      <rect x="260" y="280" width="120" height="25" fill="#991b1b" rx="4"/>
      <rect x="390" y="285" width="80" height="15" fill="#64748b" rx="3"/>
      <!-- Lâmina -->
      <rect x="465" y="280" width="45" height="25" fill="#94a3b8"/>
      <line x1="475" y1="280" x2="475" y2="305" stroke="#475569" stroke-width="2"/>
      <line x1="485" y1="280" x2="485" y2="305" stroke="#475569" stroke-width="2"/>
      <line x1="495" y1="280" x2="495" y2="305" stroke="#475569" stroke-width="2"/>
    </g>
  `);
}

function gerarSVGPlantio(cores) {
  return gerarSVGBase(cores, `
    <!-- Plantio de árvore - novo plantio urbano -->
    <g filter="url(#shadow)">
      <!-- Cova preparada -->
      <ellipse cx="350" cy="450" rx="120" ry="40" fill="#78350f" opacity="0.4"/>
      <ellipse cx="350" cy="440" rx="110" ry="35" fill="#92400e" opacity="0.5"/>
      
      <!-- Muda pequena -->
      <rect x="330" y="370" width="40" height="80" fill="#78350f" rx="6"/>
      <!-- Copa jovem -->
      <circle cx="350" cy="350" r="45" fill="#22c55e" opacity="0.9"/>
      <circle cx="330" cy="335" r="30" fill="#16a34a" opacity="0.8"/>
      <circle cx="370" cy="335" r="30" fill="#16a34a" opacity="0.8"/>
      <!-- Folhas novas -->
      <circle cx="340" cy="360" r="15" fill="rgba(255,255,255,0.3)"/>
      
      <!-- Placa de plantio -->
      <rect x="460" y="320" width="160" height="120" fill="#1e40af" rx="8"/>
      <rect x="465" y="325" width="150" height="110" fill="none" stroke="#60a5fa" stroke-width="2" rx="6"/>
      <text x="540" y="365" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">PLANTIO</text>
      <text x="540" y="400" font-family="Arial, sans-serif" font-size="18" fill="#93c5fd" text-anchor="middle">URBANO</text>
      
      <!-- Símbolo de crescimento -->
      <path d="M 520 415 L 540 425 L 540 430 M 535 420 L 545 425 L 545 430" stroke="#22c55e" stroke-width="3" fill="none"/>
    </g>
  `);
}

function gerarSVGDoente(cores) {
  return gerarSVGBase(cores, `
    <!-- Árvore doente - fitossanidade -->
    <g filter="url(#shadow)">
      <!-- Tronco com aparência doente -->
      <rect x="350" y="330" width="100" height="220" fill="#78350f" rx="10"/>
      <!-- Manchas/doenças no tronco -->
      <ellipse cx="380" cy="400" rx="25" ry="35" fill="#dc2626" opacity="0.4"/>
      <ellipse cx="410" cy="450" rx="20" ry="30" fill="#dc2626" opacity="0.3"/>
      <ellipse cx="370" cy="490" rx="18" ry="25" fill="#dc2626" opacity="0.35"/>
      
      <!-- Copa rala/doente -->
      <circle cx="400" cy="280" r="95" fill="#78350f" opacity="0.6"/>
      <circle cx="360" cy="250" r="60" fill="#92400e" opacity="0.5"/>
      <circle cx="440" cy="250" r="60" fill="#92400e" opacity="0.5"/>
      <!-- Folhas murchas -->
      <circle cx="380" cy="310" r="35" fill="#78350f" opacity="0.4"/>
      <circle cx="420" cy="310" r="35" fill="#78350f" opacity="0.4"/>
      
      <!-- Sinais de X (doente) -->
      <g>
        <line x1="365" y1="250" x2="395" y2="280" stroke="#dc2626" stroke-width="6"/>
        <line x1="365" y1="280" x2="395" y2="250" stroke="#dc2626" stroke-width="6"/>
      </g>
      <g>
        <line x1="405" y1="250" x2="435" y2="280" stroke="#dc2626" stroke-width="6"/>
        <line x1="405" y1="280" x2="435" y2="250" stroke="#dc2626" stroke-width="6"/>
      </g>
      
      <!-- Placa de alerta fitossanitário -->
      <rect x="510" y="320" width="130" height="100" fill="#fbbf24" rx="8"/>
      <rect x="515" y="325" width="120" height="90" fill="none" stroke="#78350f" stroke-width="2" rx="6"/>
      <text x="575" y="375" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#1f2937" text-anchor="middle">!</text>
    </g>
  `);
}

function gerarSVGPraca(cores) {
  return gerarSVGBase(cores, `
    <!-- Praça pública - infraestrutura urbana -->
    <g filter="url(#shadow)">
      <!-- Gramado -->
      <rect x="100" y="400" width="600" height="150" fill="#22c55e" rx="10"/>
      <rect x="110" y="410" width="580" height="130" fill="#16a34a" opacity="0.3" rx="8"/>
      
      <!-- Banco de praça -->
      <g>
        <rect x="200" y="430" width="140" height="80" fill="#78350f" rx="8"/>
        <rect x="210" y="440" width="120" height="60" fill="#475569" rx="6"/>
        <!-- Ripas do banco -->
        <rect x="215" y="445" width="110" height="12" fill="#64748b" rx="2"/>
        <rect x="215" y="465" width="110" height="12" fill="#64748b" rx="2"/>
        <rect x="215" y="485" width="110" height="12" fill="#64748b" rx="2"/>
        <!-- Pernas do banco -->
        <rect x="205" y="500" width="15" height="40" fill="#78350f" rx="4"/>
        <rect x="320" y="500" width="15" height="40" fill="#78350f" rx="4"/>
      </g>
      
      <!-- Árvore na praça -->
      <rect x="420" y="360" width="60" height="140" fill="#78350f" rx="8"/>
      <circle cx="450" cy="330" r="70" fill="#22c55e" opacity="0.9"/>
      <circle cx="420" cy="300" r="50" fill="#16a34a" opacity="0.85"/>
      <circle cx="480" cy="300" r="50" fill="#16a34a" opacity="0.85"/>
      
      <!-- Lixeira -->
      <rect x="560" y="450" width="50" height="70" fill="#64748b" rx="6"/>
      <rect x="565" y="455" width="40" height="10" fill="rgba(255,255,255,0.3)" rx="2"/>
      
      <!-- Sol/iluminação -->
      <circle cx="630" cy="470" r="35" fill="#fbbf24" opacity="0.8"/>
    </g>
  `);
}

function gerarSVGJardinagem(cores) {
  return gerarSVGBase(cores, `
    <!-- Jardinagem pública profissional -->
    <g filter="url(#shadow)">
      <!-- Canteiro profissional -->
      <rect x="150" y="420" width="500" height="110" fill="#78350f" rx="12"/>
      <rect x="160" y="430" width="480" height="90" fill="#92400e" opacity="0.5" rx="10"/>
      
      <!-- Flores/plantas em disposição ordenada -->
      <g>
        <!-- Linha 1 -->
        <circle cx="210" cy="460" r="28" fill="#dc2626"/>
        <circle cx="210" cy="460" r="18" fill="#fbbf24" opacity="0.8"/>
        
        <circle cx="290" cy="460" r="28" fill="#a855f7"/>
        <circle cx="290" cy="460" r="18" fill="#fff" opacity="0.6"/>
        
        <circle cx="370" cy="460" r="28" fill="#ec4899"/>
        <circle cx="370" cy="460" r="18" fill="#fbbf24" opacity="0.8"/>
        
        <circle cx="450" cy="460" r="28" fill="#f97316"/>
        <circle cx="450" cy="460" r="18" fill="#fff" opacity="0.6"/>
        
        <circle cx="530" cy="460" r="28" fill="#06b6d4"/>
        <circle cx="530" cy="460" r="18" fill="#fbbf24" opacity="0.8"/>
        
        <circle cx="610" cy="460" r="28" fill="#22c55e"/>
        <circle cx="610" cy="460" r="18" fill="#fff" opacity="0.6"/>
      </g>
      
      <!-- Ferramentas de jardinagem -->
      <g transform="translate(180, 280)">
        <!-- Regador -->
        <ellipse cx="0" cy="30" rx="35" ry="25" fill="#64748b"/>
        <rect x="-10" y="10" width="20" height="25" fill="#64748b" rx="4"/>
        <path d="M -10 15 Q -35 10 -40 30" stroke="#64748b" stroke-width="8" fill="none"/>
        <circle cx="-40" cy="30" r="6" fill="#64748b"/>
      </g>
    </g>
  `);
}

function gerarSVGCapina(cores) {
  return gerarSVGBase(cores, `
    <!-- Capina de calçadas - manutenção urbana -->
    <g filter="url(#shadow)">
      <!-- Calçada -->
      <rect x="100" y="420" width="600" height="130" fill="#94a3b8" rx="8"/>
      <!-- Placas da calçada -->
      <line x1="200" y1="420" x2="200" y2="550" stroke="#64748b" stroke-width="3"/>
      <line x1="300" y1="420" x2="300" y2="550" stroke="#64748b" stroke-width="3"/>
      <line x1="400" y1="420" x2="400" y2="550" stroke="#64748b" stroke-width="3"/>
      <line x1="500" y1="420" x2="500" y2="550" stroke="#64748b" stroke-width="3"/>
      <line x1="600" y1="420" x2="600" y2="550" stroke="#64748b" stroke-width="3"/>
      
      <!-- Mato crescendo entre as placas (antes) -->
      <g opacity="0.6">
        <path d="M 190 450 Q 195 430 200 420" stroke="#22c55e" stroke-width="4" fill="none"/>
        <path d="M 205 450 Q 200 435 195 420" stroke="#16a34a" stroke-width="3" fill="none"/>
        <path d="M 295 480 Q 300 460 305 450" stroke="#22c55e" stroke-width="4" fill="none"/>
        <path d="M 490 460 Q 495 440 500 430" stroke="#16a34a" stroke-width="3" fill="none"/>
      </g>
      
      <!-- Ferramenta de capina profissional -->
      <g>
        <!-- Enxada/roçadeira -->
        <rect x="480" y="250" width="20" height="150" fill="#78350f" rx="4"/>
        <!-- Lâmina -->
        <rect x="440" y="380" width="100" height="30" fill="#64748b" rx="4"/>
        <polygon points="440,380 440,410 420,405 420,385" fill="#64748b"/>
        
        <!-- Detalhe da lâmina -->
        <line x1="450" y1="385" x2="530" y2="385" stroke="#94a3b8" stroke-width="2"/>
        <line x1="450" y1="395" x2="530" y2="395" stroke="#94a3b8" stroke-width="2"/>
        <line x1="450" y1="405" x2="530" y2="405" stroke="#94a3b8" stroke-width="2"/>
      </g>
    </g>
  `);
}

function gerarSVGRaiz(cores) {
  return gerarSVGBase(cores, `
    <!-- Raiz quebrando calçada - problema urbano -->
    <g filter="url(#shadow)">
      <!-- Calçada quebrada -->
      <rect x="100" y="420" width="600" height="130" fill="#94a3b8" rx="8"/>
      
      <!-- Rachaduras na calçada -->
      <path d="M 280 420 L 290 470 L 310 520 L 320 550" stroke="#1f2937" stroke-width="5" fill="none"/>
      <path d="M 320 430 L 340 480 L 350 530" stroke="#1f2937" stroke-width="4" fill="none"/>
      <path d="M 400 425 L 410 455 L 425 490 L 435 540" stroke="#1f2937" stroke-width="5" fill="none"/>
      <path d="M 480 430 L 490 475 L 505 520" stroke="#1f2937" stroke-width="4" fill="none"/>
      
      <!-- Placas levantadas -->
      <path d="M 200 420 L 250 410 L 300 425" stroke="#64748b" stroke-width="8" fill="none"/>
      <path d="M 450 420 L 500 415 L 550 422" stroke="#64748b" stroke-width="8" fill="none"/>
      
      <!-- Árvore causadora -->
      <rect x="320" y="220" width="80" height="200" fill="#78350f" rx="10"/>
      <circle cx="360" cy="190" r="85" fill="#22c55e" opacity="0.9"/>
      <circle cx="330" cy="160" r="60" fill="#16a34a" opacity="0.85"/>
      <circle cx="390" cy="160" r="60" fill="#16a34a" opacity="0.85"/>
      
      <!-- Raízes visíveis quebrando a calçada -->
      <path d="M 340 420 Q 330 450 320 480" stroke="#92400e" stroke-width="16" fill="none"/>
      <path d="M 370 420 Q 390 460 410 500" stroke="#92400e" stroke-width="14" fill="none"/>
      <path d="M 355 420 Q 350 440 345 470" stroke="#78350f" stroke-width="12" fill="none"/>
      <path d="M 380 420 Q 400 455 420 490" stroke="#78350f" stroke-width="12" fill="none"/>
      
      <!-- Sinal de alerta -->
      <circle cx="600" cy="320" r="50" fill="#fbbf24"/>
      <text x="600" y="350" font-family="Arial, sans-serif" font-size="60" font-weight="bold" fill="#1f2937" text-anchor="middle">!</text>
    </g>
  `);
}

// SANEAMENTO
function gerarSVGBueiroEntupido(cores) {
  return gerarSVGBase(cores, `
    <!-- Bueiro entupido - infraestrutura de drenagem -->
    <g filter="url(#shadow)">
      <!-- Rua/asfalto -->
      <rect x="0" y="300" width="800" height="300" fill="#1f2937"/>
      
      <!-- Bueiro/boca de lobo -->
      <rect x="320" y="380" width="160" height="140" fill="#0f172a" rx="8"/>
      <rect x="330" y="390" width="140" height="120" fill="#475569" rx="6"/>
      
      <!-- Grade do bueiro -->
      <line x1="335" y1="400" x2="465" y2="400" stroke="#94a3b8" stroke-width="3"/>
      <line x1="335" y1="420" x2="465" y2="420" stroke="#94a3b8" stroke-width="3"/>
      <line x1="335" y1="440" x2="465" y2="440" stroke="#94a3b8" stroke-width="3"/>
      <line x1="335" y1="460" x2="465" y2="460" stroke="#94a3b8" stroke-width="3"/>
      <line x1="335" y1="480" x2="465" y2="480" stroke="#94a3b8" stroke-width="3"/>
      <line x1="335" y1="500" x2="465" y2="500" stroke="#94a3b8" stroke-width="3"/>
      
      <!-- Detritos/entupimento -->
      <rect x="350" y="350" width="60" height="40" fill="#78350f" transform="rotate(15 380 370)" opacity="0.9"/>
      <rect x="380" y="360" width="50" height="30" fill="#92400e" transform="rotate(-10 405 375)" opacity="0.8"/>
      <rect x="410" y="355" width="45" height="35" fill="#78350f" transform="rotate(20 432 372)" opacity="0.9"/>
      
      <!-- Água acumulada -->
      <ellipse cx="400" cy="320" rx="140" ry="30" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="400" cy="325" rx="120" ry="25" fill="#0284c7" opacity="0.4"/>
      
      <!-- Sinal de alerta -->
      <polygon points="650,250 700,350 600,350" fill="#fbbf24"/>
      <polygon points="655,260 695,340 615,340" fill="#f59e0b"/>
      <text x="650" y="325" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#1f2937" text-anchor="middle">!</text>
    </g>
  `);
}

function gerarSVGVazamentoEsgoto(cores) {
  return gerarSVGBase(cores, `
    <!-- Vazamento de esgoto - tubulação rompida -->
    <g filter="url(#shadow)">
      <!-- Asfalto/rua -->
      <rect x="0" y="400" width="800" height="200" fill="#1f2937"/>
      
      <!-- Mancha de esgoto -->
      <ellipse cx="400" cy="480" rx="140" ry="70" fill="#78350f" opacity="0.7"/>
      <ellipse cx="400" cy="475" rx="120" ry="60" fill="#92400e" opacity="0.6"/>
      
      <!-- Tubulação exposta/rompida -->
      <rect x="280" y="430" width="240" height="35" fill="#64748b" rx="8"/>
      <rect x="285" y="435" width="230" height="25" fill="#475569" rx="6"/>
      
      <!-- Rachadura/rompimento -->
      <rect x="385" y="425" width="30" height="45" fill="#1f2937"/>
      
      <!-- Jatos de esgoto -->
      <path d="M 395 425 Q 390 380 385 340" stroke="#78350f" stroke-width="8" fill="none" opacity="0.8"/>
      <path d="M 400 420 Q 400 370 400 320" stroke="#92400e" stroke-width="10" fill="none" opacity="0.7"/>
      <path d="M 405 425 Q 410 380 415 340" stroke="#78350f" stroke-width="8" fill="none" opacity="0.8"/>
      
      <!-- Gotas -->
      <ellipse cx="385" cy="340" rx="8" ry="12" fill="#78350f" opacity="0.6"/>
      <ellipse cx="400" cy="320" rx="10" ry="15" fill="#92400e" opacity="0.6"/>
      <ellipse cx="415" cy="340" rx="8" ry="12" fill="#78350f" opacity="0.6"/>
      
      <!-- Placa de alerta sanitário -->
      <rect x="550" y="320" width="130" height="110" fill="#dc2626" rx="8"/>
      <rect x="555" y="325" width="120" height="100" fill="none" stroke="#fff" stroke-width="3" rx="6"/>
      <text x="615" y="375" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">ESGOTO</text>
      <text x="615" y="405" font-family="Arial, sans-serif" font-size="20" fill="#fca5a5" text-anchor="middle">RISCO</text>
    </g>
  `);
}

function gerarSVGEntupimentoEsgoto(cores) {
  return gerarSVGBase(cores, `
    <!-- Entupimento de esgoto - rede bloqueada -->
    <g filter="url(#shadow)">
      <!-- Tubulação subterrânea -->
      <rect x="150" y="350" width="500" height="80" fill="#475569" rx="40"/>
      <rect x="160" y="360" width="480" height="60" fill="#64748b" rx="30"/>
      
      <!-- Indicadores de fluxo normal (esquerda) -->
      <path d="M 200 380 L 270 380" stroke="#0ea5e9" stroke-width="4" fill="none" opacity="0.7"/>
      <polygon points="270,375 285,380 270,385" fill="#0ea5e9" opacity="0.7"/>
      
      <!-- Bloqueio/entupimento (centro) -->
      <circle cx="400" cy="390" r="55" fill="#dc2626"/>
      <line x1="365" y1="355" x2="435" y2="425" stroke="#fff" stroke-width="8"/>
      <line x1="365" y1="425" x2="435" y2="355" stroke="#fff" stroke-width="8"/>
      
      <!-- Acúmulo de detritos -->
      <rect x="370" y="360" width="60" height="60" fill="#78350f" opacity="0.7" rx="8"/>
      <rect x="375" y="365" width="50" height="50" fill="#92400e" opacity="0.6" rx="6"/>
      
      <!-- Indicadores de bloqueio (direita) -->
      <line x1="530" y1="380" x2="600" y2="380" stroke="#dc2626" stroke-width="4" stroke-dasharray="10,5" opacity="0.7"/>
      
      <!-- Manilha/inspeção -->
      <rect x="350" y="250" width="100" height="100" fill="#64748b" rx="8"/>
      <rect x="360" y="260" width="80" height="80" fill="#475569" rx="6"/>
      <circle cx="400" cy="300" r="25" fill="#1f2937"/>
      
      <!-- Água parada/retorno -->
      <ellipse cx="300" cy="345" rx="80" ry="20" fill="#0ea5e9" opacity="0.4"/>
      <ellipse cx="300" cy="340" rx="60" ry="15" fill="#0284c7" opacity="0.5"/>
    </g>
  `);
}

function gerarSVGAlagamento(cores) {
  return gerarSVGBase(cores, `
    <!-- Alagamento - rua inundada -->
    <g filter="url(#shadow)">
      <!-- Asfalto -->
      <rect x="0" y="350" width="800" height="250" fill="#1f2937"/>
      
      <!-- Água acumulada (camadas para profundidade) -->
      <ellipse cx="400" cy="500" rx="380" ry="80" fill="#0284c7" opacity="0.6"/>
      <ellipse cx="400" cy="490" rx="350" ry="70" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="400" cy="480" rx="320" ry="60" fill="#38bdf8" opacity="0.4"/>
      
      <!-- Ondulações/movimento da água -->
      <path d="M 100 470 Q 150 460 200 470 T 300 470 T 400 470 T 500 470 T 600 470 T 700 470" 
            stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/>
      <path d="M 80 490 Q 130 480 180 490 T 280 490 T 380 490 T 480 490 T 580 490 T 680 490" 
            stroke="#fff" stroke-width="2" fill="none" opacity="0.3"/>
      
      <!-- Marcador de nível de água -->
      <rect x="650" y="300" width="30" height="250" fill="#fbbf24" rx="4"/>
      <rect x="655" y="305" width="20" height="240" fill="#fff" rx="2"/>
      
      <!-- Marcações de profundidade -->
      <line x1="645" y1="400" x2="685" y2="400" stroke="#dc2626" stroke-width="3"/>
      <line x1="645" y1="450" x2="685" y2="450" stroke="#f59e0b" stroke-width="3"/>
      <line x1="645" y1="500" x2="685" y2="500" stroke="#10b981" stroke-width="3"/>
      
      <!-- Placa de alerta -->
      <rect x="100" y="320" width="140" height="120" fill="#dc2626" rx="8"/>
      <text x="170" y="365" font-family="Arial" font-weight="bold" font-size="24" fill="#fff" text-anchor="middle">ATENÇÃO</text>
      <text x="170" y="395" font-family="Arial" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">ALAGADO</text>
      
      <!-- Reflexos na água -->
      <ellipse cx="170" cy="480" rx="60" ry="15" fill="#dc2626" opacity="0.3"/>
    </g>
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
    <!-- Vazamento de água - tubulação rompida -->
    <g filter="url(#shadow)">
      <!-- Solo/asfalto -->
      <rect x="0" y="380" width="800" height="220" fill="#475569"/>
      
      <!-- Tubulação (adutora) -->
      <rect x="250" y="415" width="300" height="40" fill="#94a3b8" rx="20"/>
      <rect x="260" y="420" width="280" height="30" fill="#cbd5e1" rx="15"/>
      
      <!-- Ruptura na tubulação -->
      <rect x="385" y="405" width="30" height="60" fill="#1f2937"/>
      
      <!-- Jatos de água (limpa - azul claro) -->
      <path d="M 400 400 Q 380 350 360 300" stroke="#0ea5e9" stroke-width="12" fill="none" opacity="0.7"/>
      <path d="M 400 400 Q 400 340 400 280" stroke="#38bdf8" stroke-width="14" fill="none" opacity="0.8"/>
      <path d="M 400 400 Q 420 350 440 300" stroke="#0ea5e9" stroke-width="12" fill="none" opacity="0.7"/>
      
      <!-- Spray/névoa de água -->
      <ellipse cx="360" cy="320" rx="8" ry="12" fill="#38bdf8" opacity="0.6"/>
      <ellipse cx="380" cy="340" rx="6" ry="10" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="400" cy="300" rx="10" ry="14" fill="#7dd3fc" opacity="0.7"/>
      <ellipse cx="420" cy="340" rx="6" ry="10" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="440" cy="320" rx="8" ry="12" fill="#38bdf8" opacity="0.6"/>
      
      <!-- Poça de água acumulada -->
      <ellipse cx="400" cy="530" rx="180" ry="50" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="400" cy="520" rx="140" ry="40" fill="#38bdf8" opacity="0.6"/>
      
      <!-- Hidrômetro/registro -->
      <rect x="550" y="380" width="80" height="100" fill="#64748b" rx="8"/>
      <circle cx="590" cy="430" r="25" fill="#1f2937"/>
      <line x1="590" y1="430" x2="605" y2="415" stroke="#0ea5e9" stroke-width="4"/>
      
      <!-- Placa de alerta -->
      <rect x="120" y="320" width="140" height="110" fill="#0284c7" rx="8"/>
      <text x="190" y="365" font-family="Arial" font-weight="bold" font-size="22" fill="#fff" text-anchor="middle">VAZAMENTO</text>
      <text x="190" y="395" font-family="Arial" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">ÁGUA</text>
    </g>
  `);
}

function gerarSVGAguaParada(cores) {
  return gerarSVGBase(cores, `
    <!-- Água parada - risco de dengue -->
    <g filter="url(#shadow)">
      <!-- Solo/terreno -->
      <rect x="0" y="450" width="800" height="150" fill="#78350f"/>
      
      <!-- Recipiente/área com água parada -->
      <ellipse cx="400" cy="480" rx="280" ry="100" fill="#1f2937" opacity="0.8"/>
      
      <!-- Água estagnada (camadas) -->
      <ellipse cx="400" cy="470" rx="250" ry="80" fill="#0ea5e9" opacity="0.5"/>
      <ellipse cx="400" cy="465" rx="220" ry="70" fill="#0284c7" opacity="0.6"/>
      
      <!-- Ondulações/ripples na superfície -->
      <ellipse cx="320" cy="450" rx="40" ry="8" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.4"/>
      <ellipse cx="320" cy="450" rx="60" ry="12" fill="none" stroke="#0ea5e9" stroke-width="1.5" opacity="0.3"/>
      <ellipse cx="480" cy="455" rx="35" ry="7" fill="none" stroke="#38bdf8" stroke-width="2" opacity="0.4"/>
      <ellipse cx="480" cy="455" rx="55" ry="11" fill="none" stroke="#0ea5e9" stroke-width="1.5" opacity="0.3"/>
      
      <!-- Detritos/sujeira na superfície -->
      <ellipse cx="350" cy="450" rx="15" ry="8" fill="#92400e" opacity="0.7"/>
      <ellipse cx="430" cy="455" rx="12" ry="6" fill="#78350f" opacity="0.6"/>
      <ellipse cx="390" cy="448" rx="10" ry="5" fill="#92400e" opacity="0.7"/>
      
      <!-- Larvas/contaminação (pequenas formas) -->
      <circle cx="360" cy="460" r="3" fill="#1f2937" opacity="0.6"/>
      <circle cx="380" cy="465" r="2.5" fill="#1f2937" opacity="0.5"/>
      <circle cx="420" cy="463" r="3" fill="#1f2937" opacity="0.6"/>
      <circle cx="450" cy="468" r="2" fill="#1f2937" opacity="0.5"/>
      
      <!-- Placa de alerta de saúde -->
      <rect x="550" y="300" width="160" height="140" fill="#dc2626" rx="8"/>
      <text x="630" y="345" font-family="Arial" font-weight="bold" font-size="24" fill="#fff" text-anchor="middle">ATENÇÃO</text>
      <text x="630" y="375" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">ÁGUA</text>
      <text x="630" y="400" font-family="Arial" font-weight="bold" font-size="18" fill="#fff" text-anchor="middle">PARADA</text>
      <text x="630" y="425" font-family="Arial" font-size="14" fill="#fff" text-anchor="middle">Risco Dengue</text>
    </g>
  `);
}

function gerarSVGQualidadeAgua(cores) {
  return gerarSVGBase(cores, `
    <!-- Qualidade da água - análise e contaminação -->
    <g filter="url(#shadow)">
      <!-- Reservatório/caixa d'água -->
      <rect x="250" y="280" width="300" height="280" fill="#64748b" rx="15"/>
      <rect x="260" y="290" width="280" height="260" fill="#94a3b8" rx="12"/>
      
      <!-- Água com qualidade comprometida -->
      <path d="M 270 350 L 530 350 L 530 530 Q 400 540 270 530 Z" fill="#0ea5e9" opacity="0.6"/>
      
      <!-- Partículas de contaminação -->
      <circle cx="320" cy="380" r="8" fill="#92400e" opacity="0.6"/>
      <circle cx="360" cy="410" r="6" fill="#78350f" opacity="0.5"/>
      <circle cx="420" cy="390" r="10" fill="#92400e" opacity="0.7/>
      <circle cx="460" cy="430" r="7" fill="#78350f" opacity="0.6"/>
      <circle cx="380" cy="450" r="9" fill="#92400e" opacity="0.6"/>
      <circle cx="440" cy="470" r="6" fill="#78350f" opacity="0.5"/>
      
      <!-- Sedimentos no fundo -->
      <ellipse cx="400" cy="520" rx="120" ry="15" fill="#78350f" opacity="0.4"/>
      <ellipse cx="400" cy="525" rx="100" ry="12" fill="#92400e" opacity="0.5"/>
      
      <!-- Equipamento de análise/teste -->
      <rect x="550" y="350" width="60" height="120" fill="#475569" rx="8"/>
      <rect x="560" y="360" width="40" height="30" fill="#0ea5e9" opacity="0.7"/>
      <rect x="560" y="400" width="40" height="30" fill="#f59e0b" opacity="0.7"/>
      <rect x="560" y="440" width="40" height="20" fill="#dc2626" opacity="0.7"/>
      
      <!-- Tubos de ensaio -->
      <rect x="140" y="380" width="30" height="80" fill="#cbd5e1" rx="4"/>
      <rect x="145" y="420" width="20" height="40" fill="#f59e0b" opacity="0.6"/>
      <circle cx="155" cy="385" r="8" fill="#cbd5e1"/>
      
      <!-- Placa de alerta -->
      <rect x="300" y="180" width="200" height="80" fill="#f59e0b" rx="8"/>
      <text x="400" y="215" font-family="Arial" font-weight="bold" font-size="22" fill="#fff" text-anchor="middle">QUALIDADE</text>
      <text x="400" y="245" font-family="Arial" font-weight="bold" font-size="20" fill="#fff" text-anchor="middle">COMPROMETIDA</text>
    </g>
  `);
}

// ANIMAIS
function gerarSVGAbandonado(cores) {
  return gerarSVGBase(cores, `
    <!-- Cão abandonado - silhueta profissional -->
    <g filter="url(#shadow)">
      <!-- Corpo do cão -->
      <ellipse cx="380" cy="380" rx="85" ry="55" fill="#475569"/>
      <!-- Cabeça -->
      <ellipse cx="320" cy="360" rx="45" ry="50" fill="#475569"/>
      <!-- Orelhas caídas -->
      <ellipse cx="300" cy="340" rx="15" ry="35" fill="#334155" transform="rotate(-20 300 340)"/>
      <ellipse cx="340" cy="340" rx="15" ry="35" fill="#334155" transform="rotate(20 340 340)"/>
      <!-- Patas -->
      <rect x="340" y="420" width="18" height="50" rx="9" fill="#334155"/>
      <rect x="380" y="420" width="18" height="50" rx="9" fill="#334155"/>
      <rect x="420" y="420" width="18" height="50" rx="9" fill="#334155"/>
      <!-- Cauda caída -->
      <path d="M 465 380 Q 485 395 490 420" stroke="#334155" stroke-width="14" fill="none" stroke-linecap="round"/>
      
      <!-- Placa de resgate profissional -->
      <rect x="490" y="280" width="150" height="100" fill="#1e40af" rx="8"/>
      <rect x="495" y="285" width="140" height="90" fill="none" stroke="#60a5fa" stroke-width="2" rx="6"/>
      <text x="565" y="320" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#fff" text-anchor="middle">RESGATE</text>
      <text x="565" y="355" font-family="Arial, sans-serif" font-size="18" fill="#93c5fd" text-anchor="middle">CCZ</text>
      
      <!-- Ícone de alerta -->
      <circle cx="270" cy="270" r="40" fill="#ef4444"/>
      <text x="270" y="285" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="#fff" text-anchor="middle">!</text>
    </g>
  `);
}

function gerarSVGFerido(cores) {
  return gerarSVGBase(cores, `
    <!-- Animal ferido com atendimento veterinário -->
    <g filter="url(#shadow)">
      <!-- Cão deitado -->
      <ellipse cx="350" cy="400" rx="100" ry="50" fill="#64748b"/>
      <ellipse cx="280" cy="380" rx="50" ry="45" fill="#64748b"/>
      <!-- Patas -->
      <rect x="300" y="435" width="15" height="35" rx="7" fill="#475569"/>
      <rect x="350" y="435" width="15" height="35" rx="7" fill="#475569"/>
      <rect x="400" y="435" width="15" height="35" rx="7" fill="#475569"/>
      
      <!-- Bandagem profissional -->
      <rect x="360" y="380" width="50" height="20" fill="#fff" opacity="0.9" rx="3"/>
      <rect x="365" y="385" width="40" height="10" fill="#dc2626" opacity="0.3"/>
      
      <!-- Kit de primeiros socorros -->
      <rect x="500" y="300" width="120" height="140" fill="#fff" rx="8"/>
      <rect x="505" y="305" width="110" height="130" fill="#dc2626" rx="6"/>
      <!-- Cruz médica -->
      <rect x="535" y="340" width="50" height="15" fill="#fff" rx="2"/>
      <rect x="550" y="325" width="20" height="45" fill="#fff" rx="2"/>
      
      <!-- Texto veterinário -->
      <text x="560" y="420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#fff" text-anchor="middle">VET</text>
    </g>
  `);
}

function gerarSVGPragas(cores) {
  return gerarSVGBase(cores, `
    <!-- Controle de pragas - estilo técnico -->
    <g filter="url(#shadow)">
      <!-- Rato/praga em silhueta -->
      <ellipse cx="300" cy="400" rx="45" ry="65" fill="#475569"/>
      <circle cx="300" cy="360" r="38" fill="#475569"/>
      <!-- Orelhas -->
      <circle cx="275" cy="340" r="18" fill="#64748b"/>
      <circle cx="325" cy="340" r="18" fill="#64748b"/>
      <!-- Cauda -->
      <path d="M 345 410 Q 380 420 400 450" stroke="#475569" stroke-width="6" fill="none"/>
      
      <!-- Spray profissional de controle -->
      <g>
        <rect x="480" y="280" width="50" height="120" fill="#1e40af" rx="6"/>
        <rect x="475" y="270" width="60" height="25" fill="#1e40af" rx="4"/>
        <circle cx="505" cy="275" r="8" fill="#60a5fa"/>
        
        <!-- Névoa de spray -->
        <path d="M 470 280 Q 450 300 440 330" stroke="#60a5fa" stroke-width="3" opacity="0.6" fill="none"/>
        <path d="M 470 290 Q 445 310 430 350" stroke="#60a5fa" stroke-width="3" opacity="0.5" fill="none"/>
        <path d="M 470 300 Q 440 320 420 370" stroke="#60a5fa" stroke-width="3" opacity="0.4" fill="none"/>
        <circle cx="440" cy="330" r="4" fill="#60a5fa" opacity="0.6"/>
        <circle cx="430" cy="350" r="3" fill="#60a5fa" opacity="0.5"/>
        <circle cx="420" cy="370" r="5" fill="#60a5fa" opacity="0.4"/>
      </g>
      
      <!-- Símbolo de proibido -->
      <circle cx="580" cy="370" r="45" fill="none" stroke="#dc2626" stroke-width="6"/>
      <line x1="550" y1="340" x2="610" y2="400" stroke="#dc2626" stroke-width="6"/>
    </g>
  `);
}

function gerarSVGCastracao(cores) {
  return gerarSVGBase(cores, `
    <!-- Castração animal - símbolo médico profissional -->
    <g filter="url(#shadow)">
      <!-- Silhueta de animal -->
      <ellipse cx="350" cy="360" rx="70" ry="50" fill="#64748b"/>
      <circle cx="300" cy="340" r="40" fill="#64748b"/>
      <!-- Orelhas -->
      <circle cx="280" cy="315" r="18" fill="#475569"/>
      <circle cx="320" cy="315" r="18" fill="#475569"/>
      <!-- Patas -->
      <rect x="320" y="400" width="14" height="40" rx="7" fill="#475569"/>
      <rect x="360" y="400" width="14" height="40" rx="7" fill="#475569"/>
      <rect x="400" y="400" width="14" height="40" rx="7" fill="#475569"/>
      
      <!-- Símbolo médico de castração -->
      <circle cx="520" cy="350" r="55" fill="#16a34a"/>
      <!-- Símbolo venus/mars combinado estilizado -->
      <circle cx="520" cy="335" r="25" fill="none" stroke="#fff" stroke-width="5"/>
      <line x1="520" y1="360" x2="520" y2="385" stroke="#fff" stroke-width="5"/>
      <line x1="505" y1="375" x2="535" y2="375" stroke="#fff" stroke-width="5"/>
      <!-- Check mark -->
      <path d="M 500 325 L 512 337 L 540 309" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  `);
}

function gerarSVGVacinacao(cores) {
  return gerarSVGBase(cores, `
    <!-- Vacinação animal - seringa médica profissional -->
    <g filter="url(#shadow)">
      <!-- Animal (cão/gato) -->
      <ellipse cx="330" cy="380" rx="75" ry="55" fill="#64748b"/>
      <circle cx="280" cy="360" r="45" fill="#64748b"/>
      <!-- Orelhas -->
      <circle cx="260" cy="335" r="20" fill="#475569"/>
      <circle cx="300" cy="335" r="20" fill="#475569"/>
      <!-- Patas -->
      <rect x="300" y="420" width="15" height="45" rx="7" fill="#475569"/>
      <rect x="340" y="420" width="15" height="45" rx="7" fill="#475569"/>
      <rect x="380" y="420" width="15" height="45" rx="7" fill="#475569"/>
      
      <!-- Seringa profissional grande -->
      <g>
        <rect x="480" y="250" width="45" height="180" fill="#e2e8f0" rx="5"/>
        <rect x="485" y="255" width="35" height="160" fill="#fff" rx="3"/>
        <!-- Líquido da vacina -->
        <rect x="490" y="350" width="25" height="60" fill="#3b82f6" opacity="0.7" rx="2"/>
        <!-- Êmbolo -->
        <rect x="492" y="265" width="21" height="30" fill="#64748b" rx="2"/>
        <circle cx="502.5" cy="260" r="12" fill="#64748b"/>
        <!-- Agulha -->
        <rect x="497" y="430" width="10" height="50" fill="#94a3b8"/>
        <polygon points="497,480 507,480 502,495" fill="#94a3b8"/>
      </g>
      
      <!-- Selo de vacinado -->
      <circle cx="580" cy="350" r="50" fill="#16a34a"/>
      <path d="M 555 350 L 570 365 L 605 330" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
  `);
}

function gerarSVGMausTratos(cores) {
  return gerarSVGBase(cores, `
    <!-- Maus-tratos - denúncia profissional -->
    <g filter="url(#shadow)">
      <!-- Animal encolhido/assustado -->
      <ellipse cx="320" cy="400" rx="60" ry="45" fill="#64748b"/>
      <circle cx="280" cy="380" r="38" fill="#64748b"/>
      <!-- Orelhas baixas -->
      <ellipse cx="265" cy="365" rx="12" ry="25" fill="#475569" transform="rotate(-30 265 365)"/>
      <ellipse cx="295" cy="365" rx="12" ry="25" fill="#475569" transform="rotate(30 295 365)"/>
      <!-- Patas encolhidas -->
      <rect x="290" y="435" width="12" height="30" rx="6" fill="#475569"/>
      <rect x="320" y="435" width="12" height="30" rx="6" fill="#475569"/>
      <rect x="350" y="435" width="12" height="30" rx="6" fill="#475569"/>
      
      <!-- Sinal de alerta grande -->
      <circle cx="520" cy="320" r="90" fill="#dc2626"/>
      <circle cx="520" cy="320" r="75" fill="none" stroke="#fff" stroke-width="4"/>
      <text x="520" y="355" font-family="Arial, sans-serif" font-size="90" font-weight="bold" fill="#fff" text-anchor="middle">!</text>
      
      <!-- Texto de denúncia -->
      <rect x="450" y="440" width="140" height="45" fill="#1e40af" rx="6"/>
      <text x="520" y="470" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#fff" text-anchor="middle">DENUNCIE</text>
    </g>
  `);
}

function gerarSVGSilvestre(cores) {
  return gerarSVGBase(cores, `
    <!-- Animal silvestre - resgate ambiental -->
    <g filter="url(#shadow)">
      <!-- Pássaro/animal silvestre -->
      <ellipse cx="320" cy="360" rx="50" ry="65" fill="#16a34a"/>
      <circle cx="300" cy="320" r="35" fill="#16a34a"/>
      <!-- Bico -->
      <polygon points="270,320 250,310 270,300" fill="#fbbf24"/>
      <!-- Asa -->
      <ellipse cx="340" cy="340" rx="35" ry="55" fill="#15803d" transform="rotate(25 340 340)"/>
      <!-- Patas -->
      <line x1="310" y1="420" x2="300" y2="450" stroke="#fbbf24" stroke-width="4"/>
      <line x1="330" y1="420" x2="340" y2="450" stroke="#fbbf24" stroke-width="4"/>
      
      <!-- Galho/natureza -->
      <rect x="240" y="440" width="200" height="12" fill="#78350f" rx="6"/>
      <circle cx="280" cy="430" r="8" fill="#22c55e"/>
      <circle cx="310" cy="425" r="6" fill="#22c55e"/>
      <circle cx="340" cy="432" r="7" fill="#22c55e"/>
      
      <!-- Placa de fauna silvestre -->
      <rect x="480" y="280" width="130" height="130" fill="#15803d" rx="8"/>
      <rect x="485" y="285" width="120" height="120" fill="none" stroke="#22c55e" stroke-width="3" rx="6"/>
      
      <!-- Árvore estilizada dentro da placa -->
      <rect x="530" y="340" width="20" height="40" fill="#78350f" rx="4"/>
      <circle cx="540" cy="330" r="25" fill="#22c55e"/>
      <text x="540" y="395" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#fff" text-anchor="middle">FAUNA</text>
    </g>
  `);
}

function gerarSVGPerdido(cores) {
  return gerarSVGBase(cores, `
    <!-- Cão/gato perdido - cartaz de procura-se -->
    <g filter="url(#shadow)">
      <!-- Animal -->
      <ellipse cx="350" cy="360" rx="70" ry="50" fill="#64748b"/>
      <circle cx="300" cy="340" r="40" fill="#64748b"/>
      <!-- Orelhas -->
      <circle cx="280" cy="315" r="18" fill="#475569"/>
      <circle cx="320" cy="315" r="18" fill="#475569"/>
      <!-- Patas -->
      <rect x="320" y="400" width="14" height="40" rx="7" fill="#475569"/>
      <rect x="360" y="400" width="14" height="40" rx="7" fill="#475569"/>
      <rect x="400" y="400" width="14" height="40" rx="7" fill="#475569"/>
      <!-- Cauda -->
      <path d="M 420 360 Q 440 365 450 385" stroke="#475569" stroke-width="12" fill="none" stroke-linecap="round"/>
      
      <!-- Placa "PROCURA-SE" estilo cartaz -->
      <rect x="480" y="240" width="160" height="200" fill="#fbbf24" rx="8"/>
      <rect x="485" y="245" width="150" height="190" fill="none" stroke="#78350f" stroke-width="3" rx="6"/>
      
      <!-- Interrogação grande -->
      <text x="560" y="340" font-family="Arial, sans-serif" font-size="80" font-weight="bold" fill="#1f2937" text-anchor="middle">?</text>
      
      <!-- Casa/lar -->
      <g>
        <polygon points="530,390 560,370 590,390" fill="#1e40af"/>
        <rect x="540" y="390" width="40" height="35" fill="#1e40af"/>
        <rect x="552" y="405" width="16" height="20" fill="#60a5fa"/>
      </g>
    </g>
  `);
}

export default gerarImagensUnicas;
