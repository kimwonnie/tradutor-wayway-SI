const express = require('express');
var router = express.Router();
const Usuario = require('../models/Usuario');
const Sugestao = require('../models/Sugestao');
const Solicitacao = require('../models/Solicitacao');
const VerificarAutenticacao = require('../middlewares/auth');

// GET /perfil
router.get('/', VerificarAutenticacao, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.session.usuario.id);
    if (!usuario) {
      return res.status(404).send('Usuário não encontrado');
    }

    const sugestoes = await Sugestao.find({ sugeridoPor: usuario._id })
      .sort({ dataSugestao: -1 }); // ordena da mais recente para a mais antiga

    const solicitacoes = await Solicitacao.find({ solicitadoPor: usuario._id })
      .sort({ dataSugestao: -1 }); // ordena da mais recente para a mais antiga

    res.render('perfil', {
      title: 'Perfil',
      usuario,
      sugestoes,
      solicitacoes,
      modoAtual: req.session.usuario.modoConta || usuario.tipos[0]
    });
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    res.status(500).send('Erro ao carregar perfil');
  }
});

// Editar Perfil
router.put('/', VerificarAutenticacao, async (req, res) => {
  const { nome, email, modoConta } = req.body;

  try {
    const usuario = await Usuario.findById(req.session.usuario.id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    usuario.nome = nome;
    usuario.email = email;

    await usuario.save();

    // Atualiza a sessão
    req.session.usuario.nome = usuario.nome;
    req.session.usuario.tipos = usuario.tipos;
    // Atualiza o modo de conta apenas se for um dos tipos reais do usuário
    if (modoConta && usuario.tipos.includes(modoConta)) {
      req.session.usuario.modoConta = modoConta;
    }

    res.json({ sucesso: true, mensagem: 'Perfil atualizado com sucesso' });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao atualizar o perfil' });
  }
});

router.put('/alterar-senha', VerificarAutenticacao, async (req, res) => {
  const { senha, novaSenha } = req.body;

  try {
    const usuario = await Usuario.findById(req.session.usuario.id);
    if (!usuario) {
      return res.status(404).json({ sucesso: false, mensagem: 'Usuário não encontrado' });
    }

    const senhaCorreta = await usuario.compararSenha(senha);
    if (!senhaCorreta) {
      return res.status(401).json({ sucesso: false, mensagem: 'Senha atual incorreta' });
    }

    usuario.senha = novaSenha;
    await usuario.save();

    res.json({ sucesso: true, mensagem: 'Senha alterada com sucesso' });
  } catch (err) {
    console.error('Erro ao alterar senha:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro interno ao alterar a senha' });
  }
});

module.exports = router;