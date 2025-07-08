const express = require('express');
const router = express.Router();
const Palavra = require('../models/Palavra');
const Sugestao = require('../models/Sugestao');
const VerificarAutenticacao = require('../middlewares/auth');

// Middleware extra: só para tradutores
function verificarTradutor(req, res, next) {
  if (req.session.usuario && req.session.usuario.tipos.includes('tradutor')) {
    return next();
  }
  res.status(403).send('Acesso restrito. Somente tradutores.');
}

// Rota protegida GET /tradutor/gerenciar
router.get('/gerenciar/', VerificarAutenticacao, verificarTradutor, async (req, res) => {
  try {
    const palavras = await Palavra.find().populate('criadoPor', 'nome');
    const sugestoesPendentes = await Sugestao.find({ status: 'pendente' }).populate('sugeridoPor', 'nome');
    const sugestoesAvaliadas = await Sugestao.find({ 
      status: { $in: ['aprovada', 'rejeitada'] } 
    }).populate('sugeridoPor', 'nome');

    res.render('painelTradutor', {
      title: 'Painel do Tradutor',
      palavras,
      sugestoes: sugestoesPendentes,
      avaliadas: sugestoesAvaliadas,
      usuario: req.session.usuario
    });
  } catch (err) {
    console.error('Erro ao carregar termos:', err);
    res.status(500).send('Erro ao carregar termos');
  }
});

// Remover termo
router.delete('/:id', VerificarAutenticacao, verificarTradutor, async (req, res) => {
  try {
    const termo = await Palavra.findByIdAndDelete(req.params.id);
    if (!termo) {
      return res.status(404).json({ sucesso: false, mensagem: 'Termo não encontrado' });
    }

    res.json({ sucesso: true, mensagem: 'Termo removido com sucesso' });
  } catch (err) {
    console.error('Erro ao remover termo:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao remover termo' });
  }
});

// Editar termo
router.put('/:id', VerificarAutenticacao, verificarTradutor, async (req, res) => {
  const { portugues, waiwai, descricao } = req.body;

  if (!portugues || !waiwai) {
    return res.status(400).json({ sucesso: false, mensagem: 'Português e Wai Wai são obrigatórios' });
  }

  try {
    const termoAtualizado = await Palavra.findByIdAndUpdate(
      req.params.id,
      { portugues, waiwai, descricao },
      { new: true, runValidators: true }
    );

    if (!termoAtualizado) {
      return res.status(404).json({ sucesso: false, mensagem: 'Termo não encontrado' });
    }

    res.json({ sucesso: true, mensagem: 'Termo atualizado com sucesso', termo: termoAtualizado });
  } catch (err) {
    console.error('Erro ao editar termo:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao editar termo' });
  }
});

// Aprovar sugestão
router.post('/:id/aprovar', VerificarAutenticacao, verificarTradutor, async (req, res) => {
  try {
    const sugestao = await Sugestao.findById(req.params.id);
    if (!sugestao) {
      return res.status(404).json({ sucesso: false, mensagem: 'Sugestão não encontrada' });
    }

    sugestao.status = 'aprovada';
    sugestao.mensagemAvaliador = req.body.mensagem || '';
    await sugestao.save();

    // Adiciona a palavra aprovada ao dicionário
    const novaPalavra = new Palavra({
      portugues: sugestao.portugues,
      waiwai: sugestao.waiwai,
      descricao: sugestao.descricao,
      criadoPor: sugestao.sugeridoPor,
      aprovado: true
    });

    await novaPalavra.save();

    res.json({ sucesso: true, mensagem: 'Sugestão aprovada e termo adicionado ao dicionário.' });
  } catch (err) {
    console.error('Erro ao aprovar sugestão:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao aprovar sugestão.' });
  }
});

// Rejeitar sugestão
router.post('/:id/rejeitar', VerificarAutenticacao, verificarTradutor, async (req, res) => {
  try {
    const sugestao = await Sugestao.findById(req.params.id);
    if (!sugestao) {
      return res.status(404).json({ sucesso: false, mensagem: 'Sugestão não encontrada' });
    }

    sugestao.status = 'rejeitada';
    sugestao.mensagemAvaliador = req.body.mensagem || 'Sugestão rejeitada';
    await sugestao.save();

    res.json({ sucesso: true, mensagem: 'Sugestão rejeitada com sucesso.' });
  } catch (err) {
    console.error('Erro ao rejeitar sugestão:', err);
    res.status(500).json({ sucesso: false, mensagem: 'Erro ao rejeitar sugestão.' });
  }
});

module.exports = router;