const express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');

// Rota GET para exibir o formulário de login
router.get('/', (req, res) => {
  res.render('login', {
    title: 'Tradutor Way Way - Login'
  });
});

// POST /login
router.post('/', async (req, res) => {
  const { email, senha } = req.body;
  
  // Verifica se a senha foi enviada
  if (!senha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Senha não informada' });
  }

  try {
    // Verifica se o e-mail existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ sucesso: false, mensagem: 'E-mail não cadastrado' });
    }

    // Compara a senha
    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha incorreta' });
    }

    // Criar sessão
    req.session.usuario = {
      id: usuario._id,
      nome: usuario.nome,
      tipos: usuario.tipos
    };

    res.json({ sucesso: true, mensagem: 'Login bem-sucedido' });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;