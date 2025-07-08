async function registro() {
  const nome = document.getElementById('nomeUsuario').value.trim();
  const email = document.getElementById('emailUsuario').value.trim();
  const confirmarEmail = document.getElementById('confirmarEmailUsuario').value.trim();
  const senha = document.getElementById('senhaUsuario').value;
  const confirmarSenha = document.getElementById('confirmarSenhaUsuario').value;
  
  try {
    const resposta = await fetch('/cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, confirmarEmail, senha, confirmarSenha })
    });

    const dados = await resposta.json();

    if (dados.sucesso) {
      alert(dados.mensagem);
      window.location.href = '/'; // página principal
    } else {
      alert(dados.mensagem);
    }
  } catch (erro) {
    console.error('Erro ao cadastrar:', erro);
    alert('Erro ao tentar realizar cadastro.');
  }
}