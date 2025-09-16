// src/seeds/seeds.js

import "dotenv/config";
import mongoose from "mongoose";
import seedDemanda from "./seedsDemanda.js";
import seedUsuario from "./seedsUsuario.js";
import seedSecretaria from "./seedsSecretaria.js";
import seedTipoDemanda from "./seedsTipoDemanda.js";
import seedGrupo from "./seedsGrupo.js";
import seedRotas from "./seedsRota.js";

async function main() {
  try {
    await seedRotas();
    await seedGrupo();
    await seedSecretaria();
    await seedUsuario();
    await seedDemanda();
    await seedTipoDemanda();

    console.log(">>> SEED FINALIZADO COM SUCESSO! <<<");
  } catch (err) {
    console.error("Erro ao executar SEED:", err);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

main();