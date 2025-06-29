// js/app.js

// Inicializa os bancos de dados
const dbUsuarios = new PouchDB('usuarios');
const dbFilmes = new PouchDB('filmes');

// Cria o usuário admin padrão (apenas uma vez)
dbUsuarios.get('admin').catch(err => {
  if (err.name === 'not_found') {
    return dbUsuarios.put({
      _id: 'admin',
      username: 'admin',
      senha: 'admin123',
      tipo: 'admin'
    });
  }
});

// Função de autenticação
function autenticarUsuario() {
  const username = document.getElementById('loginUsername').value;
  const senha = document.getElementById('loginPassword').value;

  dbUsuarios.allDocs({ include_docs: true }).then(result => {
    const usuario = result.rows.find(row => row.doc.username === username && row.doc.senha === senha);

    if (usuario) {
      localStorage.setItem('usuarioLogado', usuario.doc.username);
      localStorage.setItem('tipoUsuario', usuario.doc.tipo);

      if (usuario.doc.tipo === 'admin') {
        window.location.href = 'admin-filmes.html';
      } else {
        window.location.href = 'index.html';
      }
    } else {
      alert('Usuário ou senha inválidos');
    }
  });
}

// Cadastro de usuários (apenas para admin)
const formUsuario = document.getElementById('form-usuario');
if (formUsuario) {
  formUsuario.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const senha = document.getElementById('registerPassword').value;
    const tipo = document.getElementById('registerTipo').value;

    dbUsuarios.allDocs({ include_docs: true }).then(result => {
      const existe = result.rows.find(row => row.doc.username === username);

      if (existe) {
        alert('Usuário já existe!');
      } else {
        dbUsuarios.put({
          _id: new Date().toISOString(),
          username,
          senha,
          tipo
        }).then(() => {
          alert('Usuário cadastrado com sucesso!');
          formUsuario.reset();
          carregarUsuarios();
        });
      }
    });
  });
}

// Cadastro de filmes
const formFilme = document.getElementById('form-filme');
if (formFilme) {
  formFilme.addEventListener('submit', function (e) {
    e.preventDefault();

    const filme = {
      _id: new Date().toISOString(),
      titulo: document.getElementById('titulo').value,
      genero: document.getElementById('genero').value,
      descricao: document.getElementById('descricao').value,
      
    };

    dbFilmes.put(filme)
      .then(() => {
        alert('Filme salvo com sucesso!');
        formFilme.reset();
        carregarFilmes();
      })
      .catch(err => {
        console.error('Erro ao salvar filme:', err);
        alert('Erro ao salvar filme.');
      });
  });
}

// Carregar filmes
function carregarFilmes() {
  const container = document.getElementById('lista-filmes');
  if (!container) return;

  dbFilmes.allDocs({ include_docs: true }).then(result => {
    container.innerHTML = '';
    result.rows.forEach(row => {
      const doc = row.doc;
      container.innerHTML += `<p><strong>${doc.titulo}</strong> - ${doc.categoria}</p>`;
    });
  });
}

// Carregar usuários
function carregarUsuarios() {
  const container = document.getElementById('lista-usuarios');
  if (!container) return;

  dbUsuarios.allDocs({ include_docs: true }).then(result => {
    container.innerHTML = '';
    result.rows.forEach(row => {
      const doc = row.doc;
      container.innerHTML += `<p><strong>${doc.username}</strong> - ${doc.tipo}</p>`;
    });
  });
}

// Inicialização automática das listas
if (document.getElementById('lista-filmes')) carregarFilmes();
if (document.getElementById('lista-usuarios')) carregarUsuarios();
