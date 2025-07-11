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
      capa: document.getElementById('capa').value,
      genero: document.getElementById('genero').value,
      descricao: document.getElementById('descricao').value,
      trailer: document.getElementById('trailer').value
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
      container.innerHTML += `
        <div style="margin-bottom: 1rem">
          <img src="${doc.capa}" alt="${doc.titulo}" style="width: 100px; height: auto; display: block; margin-bottom: 0.5rem;">
          <strong>${doc.titulo}</strong> - ${doc.genero}<br>
          <em>${doc.descricao}</em><br>
          <a href="${doc.trailer}" target="_blank">Ver Trailer</a>
        </div>
      `;
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

function verificarUsuario() {
  const tipoUsuario = localStorage.getItem('tipoUsuario');

  if (tipoUsuario === 'admin') {
    window.location.href = 'admin-filmes.html';
  } else if (tipoUsuario === 'comum') {
    window.location.href = 'usuario.html';
  } else {
    alert('Usuário não autenticado. Faça login primeiro.');
  }
}


// Inicialização automática das listas
if (document.getElementById('lista-filmes')) carregarFilmes();
if (document.getElementById('lista-usuarios')) carregarUsuarios();
