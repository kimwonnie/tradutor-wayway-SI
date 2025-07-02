// Mostrar/ocultar formulários
function editarPerfil() {
  document.getElementById('dados-perfil').hidden = true;
  document.getElementById('form-perfil').hidden = false;
}

function cancelarEdicao() {
  document.getElementById('form-perfil').hidden = true;
  document.getElementById('dados-perfil').hidden = false;
}

function configurarConta() {
  document.getElementById('dados-perfil').hidden = true;
  document.getElementById('configurar-conta').hidden = false;
}

function fecharConfiguracoes() {
  document.getElementById('configurar-conta').hidden = true;
  document.getElementById('dados-perfil').hidden = false;
}

function alterarSenha() {
  document.getElementById('configurar-conta').hidden = true;
  document.getElementById('form-senha').hidden = false;
}

function cancelarSenha() {
  document.getElementById('form-senha').hidden = true;
  document.getElementById('configurar-conta').hidden = false;
  document.getElementById('senhaAtual').value = "";
  document.getElementById('novaSenha').value = "";
  document.getElementById('confirmarNovaSenha').value = "";
}

document.getElementById('formEditarPerfil').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome = document.getElementById('editarNome').value.trim();
  const email = document.getElementById('editarEmail').value.trim();
  const modoConta = document.getElementById("modoConta").value;

  try {
    const resposta = await fetch('/perfil', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, modoConta})
    });

    const dados = await resposta.json();
    alert(dados.mensagem);
    if (dados.sucesso) {
      location.reload(); // recarrega a página após salvar
    }
  } catch (erro) {
    console.error('Erro ao editar perfil:', erro);
    alert('Erro ao atualizar o perfil');
  }
});

document.getElementById('formEditarSenha').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const senha = document.getElementById('senhaAtual').value.trim();
  const novaSenha = document.getElementById('novaSenha').value.trim();
  const confirmarNovaSenha = document.getElementById("confirmarNovaSenha").value.trim();
  
  if (!senha || !novaSenha || !confirmarNovaSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (novaSenha.length < 8) {
    alert("A nova senha deve ter no mínimo 8 caracteres.");
    return;
  }

  if (novaSenha !== confirmarNovaSenha) {
    alert("A nova senha e a confirmação não coincidem.");
    return;
  }
  
  try {
    const res = await fetch("/perfil/alterar-senha", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senha, novaSenha })
    });

    const data = await res.json();
    alert(data.mensagem);
    
    if (data.sucesso) {
      // limpa o formulário e oculta
      document.getElementById('formEditarSenha').reset();
      document.getElementById('form-senha').hidden = true;
      document.getElementById('configurar-conta').hidden = false;
    }

  } catch (err) {
    console.error("Erro ao alterar senha:", err);
    alert("Erro ao alterar a senha");
  }
});

function solicitarTradutor() {
  if (!confirm("Tem certeza que deseja solicitar para se tornar Tradutor?")) return;

  fetch("/tradutor/solicitar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
    .then(res => res.json())
    .then(data => alert(data.mensagem))
    .catch(err => {
      console.error("Erro ao solicitar ser tradutor:", err);
      alert("Erro ao enviar a solicitação");
    });
}

function excluirConta() {
  if (!confirm("Deseja realmente excluir sua conta? Esta ação é irreversível.")) return;

  fetch("/perfil/excluir", {
    method: "DELETE" })
    .then(res => res.json())
    .then(data => {
      alert(data.mensagem);
      if (data.sucesso) window.location.href = "/";
    })
    .catch(err => {
      console.error("Erro ao excluir conta:", err);
      alert("Erro ao excluir a conta");
    });
}