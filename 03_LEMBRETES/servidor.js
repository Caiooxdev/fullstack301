// MODELO SIMPLES - LEMBRETES
// ALTERAR NA PROVA: nomes dos campos, banco e coleção conforme enunciado.
// Importa o Express para criar o servidor e as rotas.
const express = require('express');
// Importa o cliente do MongoDB.
const { MongoClient, ObjectId } = require('mongodb'); // ObjectId identifica cada registro para atualizar.
// Importa utilitario para montar caminhos de pastas.
const path = require('path');
// Importa o body-parser para receber os dados enviados por formulários.
const bodyParser = require('body-parser');
// Cria o aplicativo Express.
const app = express();
// Define a porta usada pelo servidor (80 = localhost).
const PORTA = 80; // ALTERAR se professor pedir outra porta
// Endereco de conexao do MongoDB local; alterar se necessario.
const URI = 'mongodb://127.0.0.1:27017'; // MongoDB local
// Nome do banco de dados no MongoDB.
const BANCO = 'prova_fullstack';
// Nome da colecao que armazena os registros.
const COLECAO = 'lembretes';

// Configura EJS para gerar paginas HTML.
app.set('view engine', 'ejs');
// Informa onde ficam os arquivos .ejs.
app.set('views', path.join(__dirname, 'views'));
// Permite receber campos de formularios via req.body.
app.use(bodyParser.urlencoded({ extended: true })); // Lê o formulário e coloca os campos em req.body.
// Disponibiliza CSS e imagens da pasta public.
app.use(express.static(path.join(__dirname, 'public')));

// Funcao que conecta ao banco e inicia as rotas.
async function iniciar() {
  try {
    // Cria o cliente de conexao ao MongoDB.
    const cliente = new MongoClient(URI);
    // Abre a conexao com o MongoDB.
    await cliente.connect();
    // Seleciona o banco e a colecao.
    const colecao = cliente.db(BANCO).collection(COLECAO);

    // GET /: abre a pagina inicial com formulario.
    app.get('/', (req, res) => res.render('home'));

    // CADASTRAR: recebe formulário e salva no MongoDB
    // POST /cadastrar: recebe os dados do formulario.
    app.post('/cadastrar', async (req, res) => {
      try {
        // Cria o objeto que sera salvo no banco.
        const dados = {
      // Le o titulo enviado pelo formulario.
      titulo: String(req.body.titulo || "").trim(),
      // Le a descricao enviada pelo formulario.
      descricao: String(req.body.descricao || "").trim(),
      // Le a data enviada pelo formulario.
      data: String(req.body.data || "").trim()
        };
        // Valida os campos; se houver erro, retorna status 400.
        if (!dados.titulo || !dados.descricao || !dados.data) return res.status(400).send('Preencha todos os campos corretamente.');
        // Salva UM novo documento no MongoDB.
        await colecao.insertOne(dados); // GRAVA NO BANCO
        // Exibe a pagina de confirmacao.
        res.render('resposta');
      } catch (erro) {
        // Mostra detalhes do erro no terminal.
        console.error(erro);
        // Retorna mensagem de erro ao navegador.
        res.status(500).send('Erro ao cadastrar.');
      }
    });

    // BUSCAR: consulta MongoDB e mostra em outra página EJS
    // GET /lista: rota para consultar registros.
    app.get('/lista', async (req, res) => {
      try {
        // find({}) consulta TODOS os documentos; toArray() cria uma lista.
        const registros = await colecao.find({}).toArray(); // BUSCA NO BANCO
        // Envia os registros ao EJS para exibir na tela.
        res.render('lista', { registros });
      } catch (erro) {
        // Mostra detalhes do erro no terminal.
        console.error(erro);
        // Retorna mensagem de erro ao navegador.
        res.status(500).send('Erro ao buscar registros.');
      }
    });

    // ATUALIZAR: recebe o ID e o novo valor enviados pela página de lista.
    app.post('/atualizar', async (req, res) => {
      try {
        // Lê o identificador do registro selecionado.
        const id = String(req.body.id || '').trim();
        // Lê o novo valor do campo titulo.
        const novoValor = String(req.body.novoValor || '').trim();
        // Confere se o ID tem formato válido e se o campo foi preenchido.
        if (!ObjectId.isValid(id) || !novoValor) return res.status(400).send('ID ou valor inválido.');
        // updateOne encontra um documento pelo _id e modifica somente o campo titulo.
        const resultado = await colecao.updateOne({ _id: new ObjectId(id) }, { $set: { titulo: novoValor } });
        // Se não encontrar o registro, informa ao usuário.
        if (resultado.matchedCount === 0) return res.status(404).send('Registro não encontrado.');
        // Volta à lista, que faz uma nova consulta find() e mostra a alteração.
        return res.redirect('/lista');
      } catch (erro) {
        // Mostra o erro no terminal para facilitar a correção.
        console.error(erro);
        // Responde uma única vez ao navegador.
        return res.status(500).send('Erro ao atualizar.');
      }
    });

    // Liga o servidor HTTP na porta configurada.
    app.listen(PORTA, () => console.log('Servidor: http://localhost:' + PORTA))
      .on('error', erro => console.error('Erro ao abrir porta:', erro.message));
  } catch (erro) {
    // Mostra detalhes do erro no terminal.
    console.error('Erro ao conectar no MongoDB:', erro.message);
    process.exitCode = 1;
  }
}
// Executa a funcao que conecta ao banco e liga o servidor.
iniciar();
