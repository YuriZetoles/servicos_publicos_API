// src/seeds/data/tiposDemandaReais.js

/**
 * Dados reais para seeds de Tipos de Demanda
 */

export const tiposDemandaReais = [
  // COLETA - 8 cards
  {
    titulo: "Coleta de Lixo Residencial",
    descricao: "Reporte problemas com coleta de lixo doméstico, lixo acumulado, necessidade de coleta especial ou solicitação de novos pontos de coleta",
    subdescricao: "Serviço de coleta de resíduos sólidos residenciais",
    tipo: "Coleta",
    icone: "coleta-lixo.svg",
    imagemNome: "coleta-lixo-residencial.svg"
  },
  {
    titulo: "Coleta de Entulho",
    descricao: "Solicite coleta de entulho, restos de construção, reforma e materiais volumosos que não são coletados no lixo comum",
    subdescricao: "Coleta de resíduos de construção civil",
    tipo: "Coleta",
    icone: "limpeza-terrenos.svg",
    imagemNome: "coleta-entulho.svg"
  },
  {
    titulo: "Coleta Seletiva",
    descricao: "Solicite informações sobre coleta seletiva, reporte problemas com coleta de materiais recicláveis ou sugira novos pontos",
    subdescricao: "Coleta seletiva e reciclagem",
    tipo: "Coleta",
    icone: "coleta-lixo.svg",
    imagemNome: "coleta-seletiva.svg"
  },
  {
    titulo: "Coleta de Lixo Eletrônico",
    descricao: "Descarte adequado de eletrônicos, pilhas, baterias e equipamentos eletrônicos em desuso",
    subdescricao: "Descarte correto de resíduos eletrônicos",
    tipo: "Coleta",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "coleta-eletronico.svg"
  },
  {
    titulo: "Coleta de Móveis Velhos",
    descricao: "Solicite coleta de móveis usados, sofás, armários e outros objetos volumosos que não cabem no lixo comum",
    subdescricao: "Coleta de mobiliário em desuso",
    tipo: "Coleta",
    icone: "limpeza-terrenos.svg",
    imagemNome: "coleta-moveis.svg"
  },
  {
    titulo: "Limpeza de Terrenos Baldios",
    descricao: "Reporte terrenos baldios com acúmulo de lixo, mato alto ou que estejam servindo de depósito irregular",
    subdescricao: "Limpeza e fiscalização de terrenos",
    tipo: "Coleta",
    icone: "limpeza-terrenos.svg",
    imagemNome: "limpeza-terrenos.svg"
  },
  {
    titulo: "Coleta de Resíduos Hospitalares",
    descricao: "Solicite informações sobre descarte adequado de seringas, medicamentos vencidos e materiais hospitalares",
    subdescricao: "Descarte seguro de resíduos de saúde",
    tipo: "Coleta",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "coleta-hospitalar.svg"
  },
  {
    titulo: "Ponto Viciado de Lixo",
    descricao: "Denuncie locais onde há descarte irregular constante de lixo e entulho",
    subdescricao: "Combate ao descarte irregular",
    tipo: "Coleta",
    icone: "limpeza-terrenos.svg",
    imagemNome: "ponto-viciado.svg"
  },

  // ILUMINAÇÃO - 8 cards
  {
    titulo: "Lâmpada Queimada",
    descricao: "Solicite troca de lâmpadas queimadas em postes de iluminação pública",
    subdescricao: "Manutenção e troca de lâmpadas",
    tipo: "Iluminação",
    icone: "iluminacao-publica.svg",
    imagemNome: "lampada-queimada.svg"
  },
  {
    titulo: "Poste Apagado",
    descricao: "Reporte postes que não acendem durante a noite, mesmo com lâmpada em bom estado",
    subdescricao: "Reparo em sistema elétrico de postes",
    tipo: "Iluminação",
    icone: "iluminacao-publica.svg",
    imagemNome: "poste-apagado.svg"
  },
  {
    titulo: "Poste Danificado",
    descricao: "Reporte postes inclinados, quebrados, com fiação exposta ou que apresentem risco de queda",
    subdescricao: "Manutenção estrutural de postes",
    tipo: "Iluminação",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "poste-danificado.svg"
  },
  {
    titulo: "Iluminação Piscando",
    descricao: "Reporte problemas com lâmpadas que ficam piscando ou acendendo e apagando constantemente",
    subdescricao: "Correção de problemas elétricos",
    tipo: "Iluminação",
    icone: "iluminacao-publica.svg",
    imagemNome: "iluminacao-piscando.svg"
  },
  {
    titulo: "Iluminação de Praças",
    descricao: "Solicite manutenção ou instalação de iluminação em praças, parques e áreas de lazer públicas",
    subdescricao: "Iluminação de espaços públicos de lazer",
    tipo: "Iluminação",
    icone: "pracas.svg",
    imagemNome: "iluminacao-pracas.svg"
  },
  {
    titulo: "Instalação de Novo Poste",
    descricao: "Solicite instalação de novos pontos de iluminação em ruas, vielas ou áreas sem cobertura adequada",
    subdescricao: "Expansão da rede de iluminação pública",
    tipo: "Iluminação",
    icone: "iluminacao-publica.svg",
    imagemNome: "novo-poste.svg"
  },
  {
    titulo: "Luz Acesa Durante o Dia",
    descricao: "Reporte postes que permanecem acesos durante o dia, causando desperdício de energia",
    subdescricao: "Ajuste de temporizadores e fotocélulas",
    tipo: "Iluminação",
    icone: "iluminacao-publica.svg",
    imagemNome: "luz-dia.svg"
  },
  {
    titulo: "Fiação Exposta",
    descricao: "Denuncie fiação elétrica de poste exposta, solta ou representando risco de choque",
    subdescricao: "Segurança em instalações elétricas",
    tipo: "Iluminação",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "fiacao-exposta.svg"
  },

  // PAVIMENTAÇÃO - 8 cards
  {
    titulo: "Buraco no Asfalto",
    descricao: "Reporte buracos, crateras ou ondulações no asfalto que coloquem em risco motoristas e pedestres",
    subdescricao: "Manutenção emergencial de vias",
    tipo: "Pavimentação",
    icone: "pavimentacao.svg",
    imagemNome: "buraco-asfalto.svg"
  },
  {
    titulo: "Recapeamento de Rua",
    descricao: "Solicite recapeamento de ruas em más condições, com asfalto desgastado ou com muitos remendos",
    subdescricao: "Renovação de pavimentação asfáltica",
    tipo: "Pavimentação",
    icone: "pavimentacao.svg",
    imagemNome: "recapeamento.svg"
  },
  {
    titulo: "Calçada Quebrada",
    descricao: "Reporte calçadas quebradas, irregulares, com buracos ou que impeçam a acessibilidade",
    subdescricao: "Manutenção e acessibilidade de passeios",
    tipo: "Pavimentação",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "calcada-quebrada.svg"
  },
  {
    titulo: "Meio-Fio Danificado",
    descricao: "Reporte meio-fio quebrado, ausente ou que necessite de reparos",
    subdescricao: "Manutenção de guias e sarjetas",
    tipo: "Pavimentação",
    icone: "pavimentacao.svg",
    imagemNome: "meio-fio.svg"
  },
  {
    titulo: "Pavimentação de Rua",
    descricao: "Solicite pavimentação de ruas de terra, paralelepípedos ou sem revestimento adequado",
    subdescricao: "Implantação de pavimentação asfáltica",
    tipo: "Pavimentação",
    icone: "pavimentacao.svg",
    imagemNome: "pavimentacao-rua.svg"
  },
  {
    titulo: "Fiscalização de Obras",
    descricao: "Denuncie obras irregulares, construções sem autorização ou que estejam causando transtornos",
    subdescricao: "Denúncia de irregularidades em obras",
    tipo: "Pavimentação",
    icone: "fiscalizacao-obras.svg",
    imagemNome: "fiscalizacao-obras.svg"
  },
  {
    titulo: "Tampa de Bueiro Quebrada",
    descricao: "Reporte tampas de bueiro quebradas, ausentes ou que representem risco de acidentes",
    subdescricao: "Segurança em vias públicas",
    tipo: "Pavimentação",
    icone: "bueiros.svg",
    imagemNome: "tampa-bueiro.svg"
  },
  {
    titulo: "Sinalização de Rua",
    descricao: "Solicite pintura de faixas de pedestres, lombadas e outras sinalizações de trânsito",
    subdescricao: "Sinalização viária e segurança",
    tipo: "Pavimentação",
    icone: "sinalizacao.svg",
    imagemNome: "sinalizacao-rua.svg"
  },

  // ÁRVORES - 8 cards
  {
    titulo: "Poda de Árvore",
    descricao: "Solicite poda de árvores que estejam interferindo em fiação elétrica, bloqueando a visibilidade ou oferecendo risco",
    subdescricao: "Manutenção preventiva da arborização",
    tipo: "Árvores",
    icone: "poda-arvores.svg",
    imagemNome: "poda-arvore.svg"
  },
  {
    titulo: "Remoção de Árvore",
    descricao: "Solicite remoção de árvores caídas, mortas ou com risco iminente de queda",
    subdescricao: "Remoção de árvores em situação de risco",
    tipo: "Árvores",
    icone: "poda-arvores.svg",
    imagemNome: "remocao-arvore.svg"
  },
  {
    titulo: "Plantio de Árvore",
    descricao: "Solicite plantio de novas árvores em sua rua, praça ou sugestões de arborização urbana",
    subdescricao: "Expansão da arborização urbana",
    tipo: "Árvores",
    icone: "poda-arvores.svg",
    imagemNome: "plantio-arvore.svg"
  },
  {
    titulo: "Árvore Doente",
    descricao: "Reporte árvores com sinais de doenças, pragas ou que estejam secando",
    subdescricao: "Diagnóstico e tratamento fitossanitário",
    tipo: "Árvores",
    icone: "poda-arvores.svg",
    imagemNome: "arvore-doente.svg"
  },
  {
    titulo: "Manutenção de Praça",
    descricao: "Reporte problemas em praças públicas, parques, playgrounds ou solicite melhorias em áreas de lazer",
    subdescricao: "Conservação de áreas públicas de lazer",
    tipo: "Árvores",
    icone: "pracas.svg",
    imagemNome: "manutencao-praca.svg"
  },
  {
    titulo: "Jardinagem Pública",
    descricao: "Solicite manutenção de canteiros, jardins públicos e áreas verdes da cidade",
    subdescricao: "Cuidado com paisagismo e jardins públicos",
    tipo: "Árvores",
    icone: "pracas.svg",
    imagemNome: "jardinagem.svg"
  },
  {
    titulo: "Capina de Calçadas",
    descricao: "Solicite capina e limpeza de mato em calçadas e áreas públicas",
    subdescricao: "Limpeza e manutenção de vias",
    tipo: "Árvores",
    icone: "limpeza-terrenos.svg",
    imagemNome: "capina-calcada.svg"
  },
  {
    titulo: "Raiz Quebrando Calçada",
    descricao: "Reporte raízes de árvores que estão danificando calçadas, muros ou tubulações",
    subdescricao: "Solução de conflitos de arborização",
    tipo: "Árvores",
    icone: "poda-arvores.svg",
    imagemNome: "raiz-calcada.svg"
  },

  // SANEAMENTO - 8 cards
  {
    titulo: "Bueiro Entupido",
    descricao: "Reporte bueiros entupidos, alagamentos ou necessidade de limpeza de sistema de drenagem",
    subdescricao: "Manutenção do sistema de drenagem urbana",
    tipo: "Saneamento",
    icone: "bueiros.svg",
    imagemNome: "bueiro-entupido.svg"
  },
  {
    titulo: "Vazamento de Esgoto",
    descricao: "Reporte vazamentos de esgoto, mau cheiro ou problemas na rede coletora",
    subdescricao: "Manutenção da rede de esgoto",
    tipo: "Saneamento",
    icone: "transporte-publico.svg",
    imagemNome: "vazamento-esgoto.svg"
  },
  {
    titulo: "Entupimento de Esgoto",
    descricao: "Reporte entupimentos na rede de esgoto que estejam causando retorno ou extravasamento",
    subdescricao: "Desobstrução de rede de esgoto",
    tipo: "Saneamento",
    icone: "bueiros.svg",
    imagemNome: "entupimento-esgoto.svg"
  },
  {
    titulo: "Ponto de Alagamento",
    descricao: "Reporte pontos de alagamento, acúmulo de água da chuva ou problemas com drenagem",
    subdescricao: "Prevenção e combate a alagamentos",
    tipo: "Saneamento",
    icone: "bueiros.svg",
    imagemNome: "alagamento.svg"
  },
  {
    titulo: "Falta de Água",
    descricao: "Reporte problemas de falta de água no abastecimento público",
    subdescricao: "Abastecimento de água potável",
    tipo: "Saneamento",
    icone: "transporte-publico.svg",
    imagemNome: "falta-agua.svg"
  },
  {
    titulo: "Vazamento de Água",
    descricao: "Reporte vazamentos na rede pública de água potável",
    subdescricao: "Manutenção da rede de distribuição",
    tipo: "Saneamento",
    icone: "bueiros.svg",
    imagemNome: "vazamento-agua.svg"
  },
  {
    titulo: "Água Parada",
    descricao: "Denuncie acúmulo de água parada que possa ser foco de mosquitos e doenças",
    subdescricao: "Prevenção de doenças e dengue",
    tipo: "Saneamento",
    icone: "bueiros.svg",
    imagemNome: "agua-parada.svg"
  },
  {
    titulo: "Qualidade da Água",
    descricao: "Reporte problemas com qualidade da água, cor, cheiro ou gosto estranho",
    subdescricao: "Controle de qualidade da água",
    tipo: "Saneamento",
    icone: "transporte-publico.svg",
    imagemNome: "qualidade-agua.svg"
  },

  // ANIMAIS - 8 cards
  {
    titulo: "Animal Abandonado",
    descricao: "Informe sobre animais abandonados, em situação de risco ou que necessitem de resgate",
    subdescricao: "Proteção e resgate de animais",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "animal-abandonado.svg"
  },
  {
    titulo: "Animal Ferido",
    descricao: "Reporte animais feridos que necessitem de atendimento veterinário emergencial",
    subdescricao: "Atendimento veterinário de emergência",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "animal-ferido.svg"
  },
  {
    titulo: "Controle de Pragas",
    descricao: "Solicite controle de pragas urbanas como ratos, pombos, escorpiões e outros animais nocivos",
    subdescricao: "Combate a pragas e zoonoses",
    tipo: "Animais",
    icone: "limpeza-terrenos.svg",
    imagemNome: "controle-pragas.svg"
  },
  {
    titulo: "Castração Animal",
    descricao: "Solicite informações sobre programas de castração gratuita de cães e gatos",
    subdescricao: "Controle populacional de animais",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "castracao.svg"
  },
  {
    titulo: "Vacinação Animal",
    descricao: "Solicite informações sobre campanhas de vacinação antirrábica e outras vacinas",
    subdescricao: "Programas de saúde animal",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "vacinacao.svg"
  },
  {
    titulo: "Maus-Tratos Animal",
    descricao: "Denuncie casos de maus-tratos, crueldade ou abandono de animais",
    subdescricao: "Defesa e proteção animal",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "maus-tratos.svg"
  },
  {
    titulo: "Animal Silvestre",
    descricao: "Reporte aparição de animais silvestres em área urbana que necessitem de resgate",
    subdescricao: "Resgate de fauna silvestre",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "animal-silvestre.svg"
  },
  {
    titulo: "Cão ou Gato Perdido",
    descricao: "Informe sobre animais domésticos perdidos ou encontrados",
    subdescricao: "Localização e reunificação de pets",
    tipo: "Animais",
    icone: "animais.svg",
    imagemNome: "cao-perdido.svg"
  }
];

export default tiposDemandaReais;
