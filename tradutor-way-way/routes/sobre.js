const express = require('express');
var router = express.Router();

// Rota GET para exibir a página Sobre Nós
router.get('/', (req, res) => {
  res.render('sobre', {
    title: 'Tradutor Way Way - Sobre Nós',
    mensagemErro: null
  });
});

module.exports = router;