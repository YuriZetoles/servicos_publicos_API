// server.js

import "dotenv/config";
import app from "./src/app.js";
const port = process.env.API_PORT || 5011;

app.listen(port, (error) => {
    if (error) {
        console.error('Erro ao iniciar o servidor:', error);
        process.exit(1);
    }
    if(process.env.NODE_ENV === "production"){
        console.log(`Servidor escutando em https://luis-lopes-${port}.code.fslab.dev`)
    } else {
        console.log(`Servidor escutando em http://localhost:${port}`)
    }
});