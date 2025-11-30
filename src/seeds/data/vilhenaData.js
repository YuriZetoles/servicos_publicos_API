// src/seeds/data/vilhenaData.js


export const bairrosVilhena = [
  { bairro: "Centro", cep: "76980-000" },
  { bairro: "Jardim América", cep: "76984-000" },
  { bairro: "Setor 19", cep: "76980-062" },
  { bairro: "Setor 13", cep: "76980-072" },
  { bairro: "Setor 22", cep: "76980-082" },
  { bairro: "Residencial Ipê", cep: "76987-000" },
  { bairro: "Cristo Rei", cep: "76982-000" },
  { bairro: "Jardim Eldorado", cep: "76983-000" },
  { bairro: "União", cep: "76989-000" },
  { bairro: "BNH", cep: "76990-000" },
  { bairro: "Bela Vista", cep: "76991-000" },
  { bairro: "Jardim das Oliveiras", cep: "76993-000" },
  { bairro: "Parque Industrial", cep: "76995-000" },
  { bairro: "Jardim Eldorado", cep: "76996-000" },
];

export const ruasVilhena = [
  "Avenida Capitão Castro",
  "Avenida Major Amarante",
  "Avenida Melvin Jones",
  "Avenida Brigadeiro Eduardo Gomes",
  "Avenida Tancredo Neves",
  "Avenida Barão do Rio Branco",
  "Rua Duque de Caxias",
  "Rua Tiradentes",
  "Rua Princesa Isabel",
  "Rua Machado de Assis",
  "Rua Gonçalves Dias",
  "Rua dos Tucanos",  
  "Travessa Marechal Deodoro",
];

/**
 * Retorna um endereço aleatório de Vilhena - RO
 */
export function getEnderecoVilhena() {
  const dados = bairrosVilhena[Math.floor(Math.random() * bairrosVilhena.length)];
  const rua = ruasVilhena[Math.floor(Math.random() * ruasVilhena.length)];
  const numero = Math.floor(Math.random() * 2000) + 1;
  
  const complementos = [
    "", 
    "",
    "",
    "Casa",
    "Apartamento " + (Math.floor(Math.random() * 300) + 100),
    "Fundos",
    "Sala " + (Math.floor(Math.random() * 20) + 1),
    "Bloco " + String.fromCharCode(65 + Math.floor(Math.random() * 5)), // A-E
  ];
  
  const complemento = complementos[Math.floor(Math.random() * complementos.length)];
  
  return {
    logradouro: rua,
    cep: dados.cep,
    bairro: dados.bairro,
    numero: numero.toString(),
    complemento: complemento,
    cidade: "Vilhena",
    estado: "RO",
  };
}

/**
 * Retorna apenas CEP e bairro de Vilhena 
 */
export function getCepBairroVilhena() {
  const dados = bairrosVilhena[Math.floor(Math.random() * bairrosVilhena.length)];
  return {
    cep: dados.cep,
    bairro: dados.bairro,
  };
}

/**
 * Retorna apenas um bairro aleatório de Vilhena
 */
export function getBairroVilhena() {
  const dados = bairrosVilhena[Math.floor(Math.random() * bairrosVilhena.length)];
  return dados.bairro;
}

/**
 * Retorna apenas um CEP aleatório de Vilhena
 */
export function getCepVilhena() {
  const dados = bairrosVilhena[Math.floor(Math.random() * bairrosVilhena.length)];
  return dados.cep;
}

export default {
  bairrosVilhena,
  ruasVilhena,
  getEnderecoVilhena,
  getCepBairroVilhena,
  getBairroVilhena,
  getCepVilhena,
};
