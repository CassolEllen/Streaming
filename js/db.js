// js/db.js
window.db = new PouchDB('usuarios');

// Criar usuário de teste
db.put({
  _id: 'usuario-teste',
  username: 'username',
  senha: 'senha',
  tipo: 'admin'
}).catch(err => {
  if (err.name !== 'conflict') {
    console.error('Erro ao criar usuário de teste:', err);
  }
});
