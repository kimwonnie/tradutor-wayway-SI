const mongoose = require('mongoose');

const palavraSchema = new mongoose.Schema({
  portugues: { type: String, required: true, trim: true },
  waiwai: { type: String, required: true, trim: true },
  descricao: { type: String, trim: true },
  criadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  aprovado: { type: Boolean, default: false },
  dataCriacao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Palavra', palavraSchema);
