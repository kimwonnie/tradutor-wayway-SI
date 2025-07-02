const express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');

// Rota GET para exibir o formulário de cadastro
router.get('/', (req, res) => {
  res.render('cadastro', {
    title: 'Tradutor Way Way - Cadastro',
  });
});

// POST /cadastro
router.post('/', async (req, res) => {
  const { nome, email, confirmarEmail, senha, confirmarSenha } = req.body;
  
  if (!nome || !email || !confirmarEmail || !senha || !confirmarSenha) {
    return res.status(400).json({ sucesso: false, mensagem: 'Preencha todos os campos' });
  }

  // Validação de correspondência de e-mails
  if (email !== confirmarEmail) {
    return res.status(400).json({ sucesso: false, mensagem: 'Os e-mails não coincidem' });
  }

  // Validação de correspondência de senhas
  if (senha !== confirmarSenha) {
    return res.status(400).json({ sucesso: false, mensagem: 'As senhas não coincidem' });
  }

  // Validação de formato de e-mail
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ sucesso: false, mensagem: 'Formato de e-mail inválido' });
  }

  try {
    // Verifica se o e-mail já está cadastrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ sucesso: false, mensagem: 'E-mail já cadastrado' });
    }
    
    if (senha.length < 8) {
      return res.status(400).json({ sucesso: false, mensagem: 'A senha deve ter no mínimo 8 caracteres' });
    }

    // Cria novo usuário
    const novoUsuario = new Usuario({
      nome,
      email,
      senha
    });

    await novoUsuario.save();

    // Cria a sessão automaticamente (opcional)
    req.session.usuario = {
      id: novoUsuario._id,
      nome: novoUsuario.nome,
      tipos: novoUsuario.tipos
    };

    res.status(201).json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso' });
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno no servidor' });
  }
});

module.exports = router;