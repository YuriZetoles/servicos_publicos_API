// /src/repository/filters/DemandaFilterBuild.js

import Demanda from "../../models/Demanda.js";
import Usuario from "../../models/Usuario.js";
import Secretaria from "../../models/Secretaria.js";
import DemandaRepository from "../DemandaRepository.js";
import UsuarioRepository from "../UsuarioRepository.js";
import SecretariaRepository from "../SecretariaRepository.js";

class DemandaFilterBuild {
  constructor() {
    this.filtros = {};
    this.demandaRepository = new DemandaRepository();
    this.usuarioRepository = new UsuarioRepository();
    this.secretariaRepository = new SecretariaRepository();
    this.demandaModel = new Demanda();
    this.usuarioModel = new Usuario();
    this.secretariaModel = new Secretaria();
  }

  comTipo(tipo) {
    if (tipo) {
      // Função para normalizar string: remover acentos e converter para minúsculo
      const normalizeString = (str) => {
        return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      };

      // Normalizar o valor de entrada
      const normalizedTipo = normalizeString(tipo);

      // Usar regex case-insensitive que também encontra variações com/sem acentos
      // Criar padrão que encontra tanto "iluminacao" quanto "iluminação"
      const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = escapeRegex(normalizedTipo).replace(/a/g, '[aàáâãäå]') // variações de 'a'
                                                  .replace(/e/g, '[eèéêë]')   // variações de 'e'
                                                  .replace(/i/g, '[iìíîï]')   // variações de 'i'
                                                  .replace(/o/g, '[oòóôõö]')   // variações de 'o'
                                                  .replace(/u/g, '[uùúûü]')   // variações de 'u'
                                                  .replace(/c/g, '[cç]')       // variações de 'c'
                                                  .replace(/n/g, '[nñ]');      // variações de 'n'

      this.filtros.tipo = {
        $regex: pattern,
        $options: "i"
      };
    }

    return this;
  }

  comStatus(status) {
    if (status) {
      this.filtros.status = {
        $regex: status,
        $options: "i"
      };
    }

    return this;
  }

  comData(inicio, fim) {
    if (inicio || fim) {
      this.filtros.data = {};

      if (inicio) {
        const [ano, mes, dia] = inicio.split("-").map(Number);
        // Cria data UTC sem deslocamento
        const dataInicio = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0, 0));
        this.filtros.data.$gte = dataInicio;
      }

      if (fim) {
        const [ano, mes, dia] = fim.split("-").map(Number);
        // Data fim às 23:59:59.999 UTC
        const dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999));
        this.filtros.data.$lte = dataFim;
      }
    }

    return this;
  }

  comEndereco(endereco) {
    if (endereco) {
      this.filtros.endereco = {
        $or: [{
            "endereco.logradouro": {
              $regex: endereco,
              $options: "i"
            }
          },
          {
            "endereco.cep": {
              $regex: endereco,
              $options: "i"
            }
          },
          {
            "endereco.bairro": {
              $regex: endereco,
              $options: "i"
            }
          },
          {
            "endereco.numero": {
              $regex: endereco,
              $options: "i"
            }
          },
          {
            "endereco.complemento": {
              $regex: endereco,
              $options: "i"
            }
          },
        ],
      };
    }

    return this;
  }

  async comUsuario(usuario) {
    if (usuario) {
      const isObjectIdString = typeof usuario === 'string' && /^[0-9a-fA-F]{24}$/.test(usuario);

      if (isObjectIdString) {
        this.filtros.usuarios = { $in: [usuario] };
        return this;
      }

      const usuarioEncontrado = await this.usuarioRepository.buscarPorNome(
        usuario
      );

      const usuariosIDs = usuarioEncontrado ?
        Array.isArray(usuarioEncontrado) ?
        usuarioEncontrado.map((g) => g._id) :
        [usuarioEncontrado._id] :
        [];

      this.filtros.usuarios = {
        $in: usuariosIDs
      };
    }

    return this;
  }

  async comSecretaria(secretaria) {
    if (secretaria) {
      const secretariaEncontrado =
        await this.secretariaRepository.buscarPorNome(secretaria);

      const secretariasIDs = secretariaEncontrado ?
        Array.isArray(secretariaEncontrado) ?
        secretariaEncontrado.map((g) => g._id) :
        [secretariaEncontrado._id] :
        [];

      this.filtros.secretarias = {
        $in: secretariasIDs
      };
    }

    return this;
  }

  build() {
    return this.filtros;
  }
}

export default DemandaFilterBuild;