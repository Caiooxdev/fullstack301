// ===== MODELO 03: LEMBRETES + MONGODB =====
// ALTERAR NA PROVA: banco, colecao e campos se o enunciado pedir.
const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const app = express();
const PORTA = Number(process.env.PORT || 80); // http://localhost (se ocupada, encerre outro servidor)
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017'; // MongoDB local / Compass
const BANCO = 'prova_fullstack'; // ALTERAR NA PROVA: nome do banco
const COLECAO = 'lembretes'; // ALTERAR NA PROVA: nome da colecao
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true })); // le os dados do formulario
app.use(express.static(path.join(__dirname, 'public'))); // CSS e imagens
let colecao;

// FIND(): busca todos os lembretes e envia ao EJS
app.get('/', async (req, res) => {
  try {
    const registros = await colecao.find({}).toArray();
    res.render('home', { registros });
  } catch (erro) { console.error(erro); res.status(500).send('Erro ao listar lembretes.'); }
});

// INSERTONE(): recebe o formulario e salva no MongoDB
app.post('/cadastrar', async (req, res) => {
  try {
    // ALTERAR NA PROVA: estes nomes devem ser IGUAIS aos name do home.ejs
    const { titulo, descricao, local, data, hora } = req.body;
    if ([titulo, descricao, local, data, hora].some(v => !String(v ?? '').trim())) {
      return res.status(400).send('Preencha todos os campos.');
    }
    const registro = {
      titulo: String(titulo).trim(), descricao: String(descricao).trim(),
      local: String(local).trim(), data: String(data), hora: String(hora)
    };
    await colecao.insertOne(registro); // SALVA NO BANCO
    res.render('resposta', { registro }); // mostra confirmacao com EJS
  } catch (erro) { console.error(erro); res.status(500).send('Erro ao cadastrar lembrete.'); }
});

async function iniciar() {
  try {
    const cliente = new MongoClient(URI);
    await cliente.connect();
    colecao = cliente.db(BANCO).collection(COLECAO);
    const servidor = app.listen(PORTA, () => console.log(`Servidor: http://localhost:${PORTA}`));
    servidor.on('error', erro => { console.error('Erro ao abrir a porta:', erro.message); process.exit(1); });
  } catch (erro) { console.error('Falha no MongoDB:', erro); process.exit(1); }
}
iniciar();
