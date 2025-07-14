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
// Exibe o botão só se o usuário for 'admin'
const usuarioLogado = localStorage.getItem('usuarioLogado');
if (usuarioLogado !== 'admin') {
  const btnLimpar = document.getElementById('limparBanco');
  if (btnLimpar) btnLimpar.style.display = 'none';
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

document.getElementById('limparBanco')?.addEventListener('click', async () => {
  if (!confirm("Tem certeza que deseja apagar todos os dados? Isso é irreversível.")) return;

  try {
    // Limpa os FILMES
    const filmes = await dbFilmes.allDocs({ include_docs: true });
    for (const row of filmes.rows) {
      await dbFilmes.remove(row.doc);
    }

    // Limpa os USUÁRIOS, mantendo apenas admin e ellen4
    const usuarios = await dbUsuarios.allDocs({ include_docs: true });
    for (const row of usuarios.rows) {
      const { username } = row.doc;
      if (username !== 'admin') {
        await dbUsuarios.remove(row.doc);
      }
    }

    // Recria admin
    dbUsuarios.get('admin').catch(() => {
      return dbUsuarios.put({
        _id: 'admin',
        username: 'admin',
        senha: 'admin',
        tipo: 'admin'
      });
    });

    alert("Banco de dados limpo! Apenas 'admin' foi mantido.");
    carregarUsuarios();
    carregarFilmes();

  } catch (err) {
    console.error("Erro ao limpar banco:", err);
    alert("Erro ao limpar banco. Verifique o console.");
  }
});

function carregarAssistidos() {
  const container = document.getElementById('lista-assistidos');
  if (!container) return;

  const usuario = localStorage.getItem('usuarioLogado');
  dbAssistidos.allDocs({ include_docs: true }).then(result => {
    container.innerHTML = '';
    result.rows
      .filter(row => row.doc.username === usuario)
      .forEach(row => {
        const doc = row.doc;
        container.innerHTML += `
          <div style="margin-bottom: 1rem">
            <img src="${doc.capa}" alt="${doc.titulo}" style="width: 100px;"><br>
            <strong>${doc.titulo}</strong> - ${doc.genero}<br>
            <em>${doc.descricao}</em><br>
            ${doc.trailer ? `<a href="${doc.trailer}" target="_blank">Trailer</a><br>` : ''}
          </div>
        `;
      });
  });
}

// Carrega automaticamente ao entrar
if (document.getElementById('lista-assistidos')) carregarAssistidos();

function marcarComoAssistido(titulo, capa, genero, descricao, trailer) {
  const username = localStorage.getItem('usuarioLogado');
  if (!username) {
    alert("Você precisa estar logado para assistir.");
    return;
  }

  const idUnico = `${username}_${titulo}`; // Evita duplicatas para mesmo user + filme

  dbAssistidos.get(idUnico).catch(err => {
    if (err.name === 'not_found') {
      return dbAssistidos.put({
        _id: idUnico,
        username,
        titulo,
        capa,
        genero,
        descricao,
        trailer
      });
    }
  }).then(() => {
    alert(`"${titulo}" marcado como assistido!`);
    carregarAssistidos(); // Atualiza a lista se estiver na página certa
  }).catch(err => {
    console.error('Erro ao marcar como assistido:', err);
  });
}

const dbAssistidos = new PouchDB('filmes_assistidos');


function carregarFilmesAssistidos() {
  const container = document.getElementById('lista-assistidos');
  if (!container) return;

  const usuario = localStorage.getItem('usuarioLogado');
  if (!usuario) {
    container.innerHTML = "<p>Usuário não logado.</p>";
    return;
  }

  dbAssistidos.allDocs({ include_docs: true }).then(result => {
    const assistidos = result.rows.filter(row => row.doc.username === usuario);

    if (assistidos.length === 0) {
      container.innerHTML = "<p>Nenhum filme ou série assistido ainda.</p>";
      return;
    }

    container.innerHTML = '';
    assistidos.forEach(row => {
      const doc = row.doc;
      container.innerHTML += `
        <div class="card-filme">
          <img src="${doc.capa}" alt="${doc.titulo}" />
          <p><strong>${doc.titulo}</strong></p>
          <p><em>${doc.genero}</em></p>
        </div>
      `;
    });
  }).catch(err => {
    console.error("Erro ao carregar assistidos:", err);
    container.innerHTML = "<p>Erro ao carregar filmes assistidos.</p>";
  });
}

function alterarSenha() {
  const novaSenha = document.getElementById('novaSenha').value;
  if (!novaSenha) return;

  const username = localStorage.getItem('usuarioLogado');
  const dbUsuarios = new PouchDB('usuarios');

  dbUsuarios.allDocs({ include_docs: true }).then(result => {
    const user = result.rows.find(r => r.doc.username === username);
    if (user) {
      const atualizado = {
        ...user.doc,
        senha: novaSenha
      };

      dbUsuarios.put(atualizado).then(() => {
        alert("Senha atualizada com sucesso!");
      });
    }
  });
}



