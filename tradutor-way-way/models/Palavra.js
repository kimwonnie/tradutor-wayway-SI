const mongoose = require('mongoose');

const palavraSchema = new mongoose.Schema({
  portugues: { type: String, required: true },
  waiwai: { type: String, required: true },
  descricao: { type: String }, // uso opcional para explicar o contexto ou variações
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  aprovado: { type: Boolean, default: false }, // usado para moderação
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Palavra', palavraSchema);