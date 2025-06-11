
function toggleMenu() {
  const menu = document.getElementById("menu");
  menu.classList.toggle("hidden");
}

function translate() {
  const input = document.getElementById("translateInput");
  const resultDiv = document.getElementById("translationResult");
  const word = input.value.trim().toLowerCase();
  const dict = { "universidade": "wai-universi", "livro": "wai-libru", "aula": "wai-aura" };
  resultDiv.textContent = dict[word] || "Tradução não encontrada.";
}

function registerUser() {
  const name = document.getElementById("registerName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const password = document.getElementById("registerPassword").value.trim();
  if (!name || !email || !password) return alert("Preencha todos os campos.");
  const users = JSON.parse(localStorage.getItem("users") || "[]");
  if (users.some(u => u.email === email)) return alert("Email já cadastrado.");
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  alert("Cadastro realizado com sucesso!");
  window.location.href = '/login';
}

