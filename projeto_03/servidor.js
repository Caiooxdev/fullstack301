
const express = require("express");
const path = require("path");

const app = express();

        // Disponibilizar os arquivos do site
app.use(express.static(__dirname));

   // Abrir a página inicial
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

 // Iniciar o servidor na porta 80
app.listen(80, "0.0.0.0", function() {
    console.log("Servidor funcionando na porta 80");
});
