// ===== MODELO DE PESSOAS =====
// ALTERAR NA PROVA: porta, banco, colecao, campos e rotas somente se o enunciado pedir.
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORTA = Number(process.env.PORT || 80); // PORTA 80: abre usando http://localhost
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017'; // MONGODB LOCAL: nao e a porta do site
const BANCO = 'prova_fullstack'; // ALTERAR NA PROVA: nome do banco
const COLECAO = 'pessoas'; // ALTERAR NA PROVA: nome da colecao
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // NECESSARIO para ler req.body
app.use(express.static(path.join(__dirname, 'public'))); // CSS e imagens
let colecao;
// HOME: EJS + FIND() PARA LISTAR DADOS
app.get('/', async (req, res) => {
  try {
    const registros = await colecao.find({}).toArray(); // BUSCA NO MONGODB
    res.render('home', { registros });
  } catch (erro) { console.error(erro); res.status(500).send('Erro ao consultar o banco.'); }
});
// CADASTRO: INSERTONE() PARA SALVAR DADOS
app.post('/cadastrar', async (req, res) => {
  try {
    // ALTERAR NA PROVA: campos devem ser iguais aos name dos inputs em home.ejs
    const { nome, sobrenome, email } = req.body;
    if (!String(nome ?? "").trim() || !String(sobrenome ?? "").trim() || !String(email ?? "").trim()) return res.status(400).send('Preencha todos os campos.');
    // ALTERAR NA PROVA: campos salvos no MongoDB
    const registro = {
      nome: String(nome).trim(),
      sobrenome: String(sobrenome).trim(),
      email: String(email).trim()
    };
    await colecao.insertOne(registro); // SALVA NO MONGODB
    res.render('resposta', { registro }); // PAGINA DE RESPOSTA EJS
  } catch (erro) { console.error(erro); res.status(500).send('Erro ao cadastrar.'); }
});
// INICIA A CONEXAO E O SERVIDOR
async function iniciar() {
  try {
    const cliente = new MongoClient(URI);
    await cliente.connect();
    colecao = cliente.db(BANCO).collection(COLECAO);
    const servidor = app.listen(PORTA, () => console.log(`Servidor: http://localhost:${PORTA}`));
    servidor.on('error', erro => { console.error('Erro ao abrir a porta:', erro.message); process.exit(1); });
  } catch (erro) { console.error('MongoDB indisponivel:', erro); process.exit(1); }
}
iniciar();
