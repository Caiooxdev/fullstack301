const express = require("express");
const path = require("path");

const app = express();

// Configurar o servidor
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


// Página inicial
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "projects.html"));
});

app.use(express.static(__dirname));

// Página de cadastro
app.get("/cadastra", function(req, res) {
    res.sendFile(path.join(__dirname, "cadastro.html"));
});

// Página de login
app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

// Guardar usuários durante a execução
const usuarios = [];

// Receber cadastro
app.post("/cadastra", function(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.send("Preencha todos os campos.");
    }

    usuarios.push({ nome, email, senha });
    res.redirect("/login");
});

// Verificar login
app.post("/login", function(req, res) {
    const { email, senha } = req.body;

    const usuario = usuarios.find(function(u) {
        return u.email === email && u.senha === senha;
    });

    res.render("resposta", {
        mensagem: usuario
            ? "Login realizado com sucesso!"
            : "Email ou senha incorretos."
    });
});

// Iniciar servidor
app.listen(80, "0.0.0.0", function() {
    console.log("Servidor funcionando na porta 80");
});