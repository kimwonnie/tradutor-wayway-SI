var createError = require('http-errors');
var express = require('express');
const expressLayouts = require('express-ejs-layouts');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var loginRouter = require('./routes/login');
var cadastroRouter = require('./routes/cadastro');
var sobreRouter = require('./routes/sobre');
var sairRouter = require('./routes/sair');

var app = express();

// Configuração do mecanismo de visualização (EJS com layouts)
app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/*Configuração do middleware de sessão
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // True se estiver usando HTTPS
}));*/

// Middleware para tornar a sessão disponível para todas as views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/cadastro', cadastroRouter);
app.use('/sobre', sobreRouter);
app.use('/sair', sairRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
