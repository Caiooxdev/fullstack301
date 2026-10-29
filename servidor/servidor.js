let colors = require("colors");
let http = require("http");
let express = require("express");
const console = require("console");
let bodyParser = require("body-parser")

let app = express();
app.use(express.static("./public")); 
app.use(bodyParser.urlencoded({extended: false }))
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', './views');

let server = http.createServer(app);
server.listen(3000);

console.log("Servidor rodando ...".rainbow);

///////////////////////////////////////////////

app.get("/cadastrar", function(req, res){
    let nome = req.query.nome;
    let sobrenome = req.query.sobrenome;
    let email = req.query.email;
    let senha = req.query.senha;
    console.log(nome, sobrenome, email, senha);
    res.render("resposta.ejs", 
        {nome_template: nome, sobrenome_template: sobrenome});
})

app.post("/cadastrar", function(req, res){
    let nome = req.body.nome;
    let sobrenome = req.body.sobrenome;
    let email = req.body.email;
    let senha = req.body.senha;
    console.log(nome, sobrenome, email, senha);
})