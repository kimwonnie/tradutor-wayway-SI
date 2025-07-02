require('dotenv').config(); // carrega '.env'

var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Importação de Middlewares
const catchNotFoundPage = require('./middlewares/capturarNotFoundPages');
const errorHandling = require('./middlewares/tratamentoErro');
const sessionConfig = require('./config/session');
const sessionToViews = require('./middlewares/sessionToViews');
const conectarMongo = require('./config/database');

// Importação das rotas
var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var cadastroRouter = require('./routes/cadastro');
var perfilRouter = require('./routes/perfil');
var palavraRouter = require('./routes/palavras');
var painelTradutorRouter = require('./routes/tradutor');
var painelAdminRouter = require('./routes/admin');
var sobreRouter = require('./routes/sobre');
var sairRouter = require('./routes/sair');

var app = express();

// Configuração do mecanismo de visualização (EJS com layouts)
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Conexão com o Banco de Dados MongoDB 
conectarMongo();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuração do middleware de sessão
app.use(sessionConfig);
// Middleware para tornar a sessão disponível para todas as views
app.use(sessionToViews);

// Rota para verificar se está logado (usada pelo front)
app.get('/verificar-login', (req, res) => {
  res.json({ logado: !!req.session.usuario });
});

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/cadastro', cadastroRouter);
app.use('/perfil', perfilRouter);
app.use('/palavras', palavraRouter);
app.use('/tradutor', painelTradutorRouter);
app.use('/admin', painelAdminRouter);
app.use('/sobre', sobreRouter);
app.use('/sair', sairRouter);

// Middleware para capturar erros 404 (página não encontrada)
app.use(catchNotFoundPage);
// Middleware de tratamento de erros
app.use(errorHandling);


module.exports = app;
