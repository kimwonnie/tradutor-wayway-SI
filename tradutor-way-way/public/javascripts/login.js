async function loginUser() {
  const email = document.getElementById('loginEmail').value.trim();
  const senha = document.getElementById('loginPassword').value;

  const mensagem = document.getElementById('login-message');
  mensagem.textContent = '';

  try {
    const resposta = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
      mensagem.textContent = 'Login bem-sucedido!';
      mensagem.style.color = 'green';
      // Redireciona para home
      window.location.href = '/';
    } else {
      mensagem.textContent = dados.mensagem;
      mensagem.style.color = 'red';
    }
  } catch (erro) {
    console.error('Erro ao fazer login:', erro);
    mensagem.textContent = 'Erro ao tentar fazer login.';
    mensagem.style.color = 'red';
  }
}