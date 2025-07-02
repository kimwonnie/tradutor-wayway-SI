const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const Palavra = require('../models/Palavra');
const Sugestao = require('../models/Sugestao');
const Solicitacao = require('../models/Solicitacao');
const VerificarAutenticacao = require('../middlewares/auth');

// Middleware extra: só para admin
function verificarAdmin(req, res, next) {
  if (req.session.usuario && req.session.usuario.tipos.includes('admin')) {
    return next();
  }
  return res.status(403).send('Acesso restrito. Somente administradores.');
}

// Rota protegida GET /admin/gerenciar
router.get('/gerenciar/', VerificarAutenticacao, verificarAdmin, async (req, res) => {
  try {
    const usuarios = await Usuario.find().sort({ nome: 1 });
    const palavras = await Palavra.find().populate('criadoPor', 'nome');
    const sugestoesPendentes = await Sugestao.find({ status: 'pendente' }).populate('sugeridoPor', 'nome').sort({ dataSugestao: -1 });
    const sugestoes = await Sugestao.find().populate('sugeridoPor', 'nome').sort({ dataSugestao: -1 });
    const solicitacoesPendentes = await Solicitacao.find({ status: 'pendente' }).populate('solicitadoPor', 'nome').sort({ dataSolicitacao: -1 });
    const solicitacoes = await Solicitacao.find().populate('solicitadoPor', 'nome').sort({ dataSolicitacao: -1 });

    res.render('painelAdmin', {
      title: 'Painel do Administrador',
      usuarios,
      palavras,
      sugestoesPendentes,
      sugestoes,
      solicitacoesPendentes,
      solicitacoes,
      admin: req.session.usuario
    });
  } catch (err) {
    console.error('Erro ao carregar termos:', err);
    res.status(500).send('Erro ao carregar termos');
  }
});

router.post('/promover/:id', verificarAdmin, async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).send('Usuário não encontrado');

    if (!usuario.tipos.includes('admin')) {
      usuario.tipos.push('admin');
      await usuario.save();
    }

    res.redirect('/admin');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao promover usuário');
  }
});

module.exports = router;