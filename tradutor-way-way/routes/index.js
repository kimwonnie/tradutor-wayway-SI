var express = require('express');
var router = express.Router();

/* GET página Incial. */
router.get('/', (req, res) => {
  res.render('index', { 
    title: 'Tradutor Way Way',
    mensagemErro: null,});
});

module.exports = router;
