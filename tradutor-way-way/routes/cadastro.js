const express = require('express');
var router = express.Router();

// Rota GET para exibir o formulário de cadastro
router.get('/', (req, res) => {
  res.render('cadastro', {
    title: 'Tradutor Way Way - Cadastro',
    mensagemErro: null
  });
});

module.exports = router;