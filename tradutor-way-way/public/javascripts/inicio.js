// Simulação de dicionário
const dicionarioSimulado = {
  "universidade": "wai-universi",
  "livro": "wai-libru",
  "aula": "wai-aura"
};

// Tradução
function translate() {
  const input = document.getElementById("translateInput").value.trim().toLowerCase();
  const resultDiv = document.getElementById("translationResult");
  const messageDiv = document.getElementById("message");

  resultDiv.textContent = "";
  messageDiv.textContent = "";

  if (input === "") {
    messageDiv.textContent = "Digite uma palavra para traduzir.";
    return;
  }

  if (dicionarioSimulado[input]) {
    resultDiv.innerHTML = `<strong>Tradução:</strong> ${dicionarioSimulado[input]}`;
  } else {
    resultDiv.innerHTML = `Palavra não encontrada.`;
  }
}

// Mostrar/ocultar formulários
function mostrarFormularioSugestao() {
  document.getElementById("tradutor").hidden = true;
  document.getElementById("cadastro").hidden = false;
}

function voltarParaTradutor() {
  document.getElementById("cadastro").hidden = true;
  document.getElementById("tradutor").hidden = false;
}

// Enviar sugestão
function submitSuggestion() {
  const pt = document.getElementById("suggestPt").value.trim();
  const wai = document.getElementById("suggestWai").value.trim();
  const msg = document.getElementById("messageSuggestion");
  const list = document.getElementById("suggestionsList");

  msg.textContent = "";
  list.innerHTML = "";

  if (!pt || !wai) {
    msg.textContent = "Preencha ambos os campos.";
    return;
  }

  // Aqui futuramente entra a lógica para enviar ao backend via fetch/AJAX
  msg.textContent = "Sugestão enviada para análise!";
  list.innerHTML = `<p><strong>${pt}</strong> → ${wai}</p>`;

  // Limpa os campos
  document.getElementById("suggestPt").value = "";
  document.getElementById("suggestWai").value = "";
}

// Espera o DOM carregar para conectar os eventos
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("btnTraduzir").addEventListener("click", translate);
});