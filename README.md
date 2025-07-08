# 🎬 Projeto Streaming de Filmes - Sistema de Autenticação e Gerenciamento de Filmes

Este projeto é um clone funcional da Netflix com funcionalidades básicas de autenticação de usuários, cadastro de filmes e gerenciamento de permissões. Desenvolvido com foco em aprendizado de HTML, CSS, JavaScript e uso do banco de dados local [PouchDB](https://pouchdb.com/).

## 📌 Funcionalidades

- **Login de Usuário**
  - Validação com armazenamento local.
  - Diferenciação entre usuários comuns e administradores.

- **Tipos de Usuário**
  - 👤 **Administrador**: pode cadastrar usuários e filmes.
  - 👥 **Usuário comum**: pode visualizar filmes e alterar sua senha.

- **Cadastro de Usuários**
  - Acesso exclusivo do administrador.
  - Prevenção de duplicidade de usuários.

- **Cadastro de Filmes**
  - Realizado apenas por administradores.
  - Armazenamento no banco local `filmes`.

- **Interface Responsiva**
  - Estilo semelhante ao da Netflix.
  - Compatível com dispositivos móveis.

- **Banco de Dados Local (PouchDB)**
  - Os dados são salvos no navegador do usuário.
  - Sem necessidade de backend.

---

## 🧱 Estrutura do Projeto

📁 projeto/
├── index.html # Tela inicial com verificação de tipo de usuário
├── login.html # Tela de autenticação
├── admin-filmes.html # Área administrativa (admin)
├── usuario.html # Área para usuários comuns
├── js/
│ ├── app.js # Lógica de autenticação, cadastro e interação com o banco
│ └── db.js # Inicialização do banco de dados
├── assets/
│ ├── css/
│ │ ├── style.css # Estilo principal da aplicação
│ │ ├── admin.css # Estilos para admin-filmes.html
│ │ └── usuario.css # Estilos para usuario.html
│ ├── img/ # Imagens (logo, avatar, etc.)
│ └── video/ # Vídeo de fundo (Nosferatu.mp4, etc.)
└── README.md # Este arquivo


## 🛠️ Tecnologias Utilizadas
HTML5

CSS3

JavaScript (Vanilla)

PouchDB (armazenamento local no navegador)

Bootstrap Icons


✨ Autor
Desenvolvido com dedicação por Ellen Cristina Cassol
