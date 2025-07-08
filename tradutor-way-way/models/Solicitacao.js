const mongoose = require('mongoose');

const solicitacaoSchema = new mongoose.Schema({
    solicitadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
    tipoSolicitacao: { type: String, enum: ['tradutor'], default: 'tradutor' },
    status: { type: String, enum: ['pendente', 'aprovada', 'rejeitada', 'cancelada'], default: 'pendente' },
    avaliadoPor: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' },
    mensagemAdmin: { type: String },
    cancelada: { type: Boolean, default: false },
    dataSolicitacao: { type: Date, default: Date.now },
    dataAvaliacao: { type: Date },
    dataCancelamento: { type: Date }
});

module.exports = mongoose.model('Solicitacao', solicitacaoSchema);