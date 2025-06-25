async function registerUser() {
  const nome = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const senha = document.getElementById('registerPassword').value;

  try {
    const resposta = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
      alert(dados.mensagem);
      window.location.href = '/'; // ou página principal
    } else {
      alert(dados.mensagem);
    }
  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);
    alert('Erro ao tentar realizar cadastro.');
  }
}