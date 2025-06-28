// Usa o banco já definido em db.js
console.log('DB disponível?', typeof db !== 'undefined' ? 'Sim ✅' : 'Não ❌');

function salvarUsuario() {
  const username = document.getElementById('registerUsername').value;
  const senha = document.getElementById('registerPassword').value;
  const tipo = document.getElementById('registerTipo').value;

  const usuario = {
    _id: new Date().toISOString(),
    username,
    senha,
    tipo
  };

  db.put(usuario)
    .then(() => {
      alert('Usuário cadastrado com sucesso!');
      document.getElementById('registerUsername').value = '';
      document.getElementById('registerPassword').value = '';
      document.getElementById('registerTipo').value = 'comum';
    })
    .catch(err => {
      console.error('Erro ao salvar usuário:', err);
      alert('Erro ao cadastrar usuário.');
    });
}

function autenticarUsuario() {
  const username = document.getElementById('loginUsername').value;
  const senha = document.getElementById('loginPassword').value;

  db.allDocs({ include_docs: true })
    .then(result => {
      const usuario = result.rows.find(row =>
        row.doc.username === username && row.doc.senha === senha
      );

      if (usuario) {
        alert('Login bem-sucedido!');
        localStorage.setItem('tipoUsuario', usuario.doc.tipo);
        localStorage.setItem('usuarioLogado', usuario.doc.username);

        if (usuario.doc.tipo === 'admin') {
          window.location.href = 'admin-filmes.html';
        } else {
          window.location.href = 'index.html';
        }
      } else {
        alert('Usuário ou senha incorretos.');
      }
    })
    .catch(err => {
      console.error('Erro na autenticação:', err);
      alert('Erro no login.');
    });
}
