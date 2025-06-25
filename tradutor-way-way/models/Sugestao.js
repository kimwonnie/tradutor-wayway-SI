const mongoose = require('mongoose');

const sugestaoSchema = new mongoose.Schema({
  portugues: { type: String, required: true },
  waiwai: { type: String, required: true },
  descricao: { type: String },
  sugeridoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
  status: {
    type: String,
    enum: ['pendente', 'aprovada', 'rejeitada'],
    default: 'pendente'
  },
  dataSugestao: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Sugestao', sugestaoSchema);