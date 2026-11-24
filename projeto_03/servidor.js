const express = require("express");
const path = require("path");
const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");

const app = express();

// Configurações
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));


// MongoDB
const client = new MongoClient("mongodb://localhost:27017");

const banco = client.db("fullstack");
const posts = banco.collection("posts");
const carros = banco.collection("carros");
const usuariosBD = banco.collection("usuarios");

// Página inicial
app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "projects.html"));
});
app.use(express.static(__dirname));
// LAB ANTERIOR

const usuarios = [];

app.get("/cadastra", function(req, res) {
    res.sendFile(path.join(__dirname, "cadastro.html"));
});

app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/cadastra", function(req, res) {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.send("Preencha todos os campos.");
    }

    usuarios.push({ nome, email, senha });
    res.redirect("/login");
});

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

// ========================
// LAB 9 - BLOG
// ========================

// Buscar todos os posts
app.get("/blog", async function(req, res) {
    const lista = await posts.find({}).toArray();

    res.render("blog", { posts: lista });
});

// Cadastrar post
app.post("/cadastrar_post", async function(req, res) {

    await posts.insertOne({
        titulo: req.body.titulo,
        resumo: req.body.resumo,
        conteudo: req.body.conteudo
    });

    res.render("post_cadastrado");
    });


// ========================
// LAB 10 - CARROS
// ========================

// Listar carros
app.get("/carros", async function(req, res) {
    const lista = await carros.find({}).toArray();

    res.render("carros", { carros: lista });
});

// Cadastro de usuário
app.post("/cadastro_usuario", async function(req, res) {

    const { nome, login, senha } = req.body;

    if (!nome || !login || !senha) {
        return res.send("Preencha todos os campos.");
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto.scryptSync(senha, salt, 64).toString("hex");

    await usuariosBD.insertOne({
        nome,
        login,
        senha: hash,
        salt
    });

    res.redirect("/login_carros.html");
});

// Login de usuário
app.post("/login_carros", async function(req, res) {

    const { login, senha } = req.body;

    const usuario = await usuariosBD.findOne({
        login: login
    });

    if (usuario && usuario.salt && senha &&
        crypto.scryptSync(senha, usuario.salt, 64)
        .toString("hex") === usuario.senha) {
        res.redirect("/gerenciar_carros");
    } else {
        res.send("Login ou senha incorretos.");
    }
});

// Página de gerenciamento
app.get("/gerenciar_carros", async function(req, res) {

    const lista = await carros.find({}).toArray();

    res.render("gerenciar_carros", {
        carros: lista
    });
});

// Cadastrar carro
app.post("/cadastrar_carro", async function(req, res) {

    await carros.insertOne({
        marca: req.body.marca,
        modelo: req.body.modelo,
        ano: Number(req.body.ano),
        qtde_disponivel: Number(req.body.qtde_disponivel)
    });

    res.redirect("/gerenciar_carros");
});

// Atualizar carro
app.post("/atualizar_carro", async function(req, res) {

    await carros.updateOne(
        { _id: new ObjectId(req.body.id) },
        {
            $set: {
                marca: req.body.marca,
                modelo: req.body.modelo,
                ano: Number(req.body.ano),
                qtde_disponivel: Number(req.body.qtde_disponivel)
            }
        }
    );

    res.redirect("/gerenciar_carros");
});

// Remover carro
app.post("/remover_carro", async function(req, res) {

    await carros.deleteOne({
        _id: new ObjectId(req.body.id)
    });

    res.redirect("/gerenciar_carros");
});

// Vender carro
app.post("/vender_carro", async function(req, res) {

    await carros.updateOne(
        {
            _id: new ObjectId(req.body.id),
            qtde_disponivel: { $gt: 0 }
        },
        {
            $inc: { qtde_disponivel: -1 }
        }
    );

    res.redirect("/gerenciar_carros");
});

// Conectar e iniciar servidor
client.connect().then(function() {

    console.log("MongoDB conectado!");

    app.listen(80, "0.0.0.0", function() {
        console.log("Servidor funcionando na porta 80");
    });

}).catch(function(erro) {
    console.log("Erro na conexão:", erro);
});