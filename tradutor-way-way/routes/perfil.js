const express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');
const VerificarAutenticacao = require('../middlewares/auth');

// perfil
router.get('/', VerificarAutenticacao, async (req, res) => {
    const usuario = await Usuario.findById(req.session.usuario.id);
    if (!usuario) {
        return res.status(404).send('Usuário não encontrado');
    }
  res.render('perfil', {
    title: 'Tradutor Way Way - perfil',
    usuario
  });
});

// POST /perfil
router.post('/', VerificarAutenticacao, async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    // Atualiza as informações do usuário no banco de dados
    await Usuario.findByIdAndUpdate(req.user.id, { nome, email, senha });
    res.redirect('/perfil');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao atualizar perfil');
  }
});

module.exports = router;