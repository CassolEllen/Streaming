const db = new PouchDB('usuarios');
const filmesAssistidos = ['Nosferatu', 'O Iluminado', 'Corra!', 'Fragmentado'];

document.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  if (!user || user.tipo !== 'usuario') {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('username').textContent = user.username;
  const ul = document.getElementById('filmesAssistidos');
  filmesAssistidos.forEach(filme => {
    const li = document.createElement('li');
    li.textContent = filme;
    li.className = 'list-group-item';
    ul.appendChild(li);
  });
});

function alterarSenha(event) {
  event.preventDefault();
  const user = JSON.parse(localStorage.getItem('usuarioLogado'));
  const senhaAtual = document.getElementById('senhaAtual').value;
  const novaSenha = document.getElementById('novaSenha').value;

  db.get(user._id).then(doc => {
    if (doc.senha !== senhaAtual) {
      alert('Senha atual incorreta');
      return;
    }
    doc.senha = novaSenha;
    return db.put(doc);
  }).then(() => {
    alert('Senha atualizada com sucesso!');
    document.getElementById('senhaAtual').value = '';
    document.getElementById('novaSenha').value = '';
  }).catch(err => {
    console.error(err);
    alert('Erro ao atualizar senha.');
  });
}

function logout() {
  localStorage.removeItem('usuarioLogado');
  window.location.href = 'login.html';
}
