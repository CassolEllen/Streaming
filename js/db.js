// js/db.js

// Banco de dados separado para usuários
window.dbUsuarios = new PouchDB('usuarios');

// Banco de dados separado para filmes
window.dbFilmes = new PouchDB('filmes');

// Criar usuário de teste (apenas se ainda não existir)
dbUsuarios.put({
  _id: 'admin',
  username: 'admin',
  senha: 'admin123',
  tipo: 'admin'
}).catch(err => {
  if (err.name !== 'conflict') {
    console.error('Erro ao criar usuário de teste:', err);
  }
});

window.dbAssistidos = new PouchDB('filmes_assistidos');
