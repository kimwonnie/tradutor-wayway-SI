const express = require('express');
var router = express.Router();

// Rota GET para exibir o formulário de login
router.get('/', (req, res) => {
  res.render('login', {
    title: 'Tradutor Way Way - Login',
    mensagemErro: null
  });
});

module.exports = router;