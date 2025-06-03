# Vinihida Beverages - E-commerce Flask

Uma loja online premium de bebidas alcoólicas construída com Flask, oferecendo uma experiência moderna e responsiva com sistema completo de migrações de banco de dados.

## 🚀 Características

- **Frontend completo em Flask**: Templates Jinja2 com Tailwind CSS
- **Sistema de autenticação**: Login/registro com sessões Flask
- **Carrinho de compras**: Funcionalidade completa de e-commerce
- **Verificação de idade**: Modal de verificação obrigatória
- **Design responsivo**: Interface moderna e otimizada para mobile
- **Backend robusto**: APIs RESTful + renderização server-side
- **Arquitetura limpa**: Application Factory Pattern
- **Sistema de migrações**: Flask-Migrate para versionamento do banco
- **Comandos CLI**: Gerenciamento completo via linha de comando

## 🛠️ Tecnologias

- **Backend**: Flask 2.3.2, SQLAlchemy, Flask-JWT-Extended, Flask-Migrate
- **Frontend**: Jinja2 Templates, Tailwind CSS, Alpine.js
- **Banco de dados**: SQLite (desenvolvimento) / PostgreSQL (produção)
- **Autenticação**: Flask-JWT-Extended + Sessions
- **Migrações**: Alembic via Flask-Migrate

## 📦 Instalação Rápida

### 1. Clone e configure o ambiente:
```bash
git clone <repository-url>
cd VinihidaBeverages

# Crie e ative o ambiente virtual
python3 -m venv venv
source venv/bin/activate

# Instale dependências
pip install -r requirements.txt
```

### 2. Inicialize o projeto:
```bash
# Executa configuração completa automaticamente
python3 init_project.py
```

### 3. Execute a aplicação:
```bash
python3 app.py
```

Acesse: http://localhost:5000

## 🗄️ Gerenciamento do Banco de Dados

### Comandos Flask CLI

```bash
# Definir variável de ambiente
export FLASK_APP=app.py

# Informações do banco
flask show-tables              # Mostra tabelas e contadores
flask backup-db                # Cria backup do banco

# Gerenciamento de usuários
flask create-admin             # Cria usuário administrador
flask seed-db                  # Popula banco com dados de exemplo

# Migrações
flask db init                  # Inicializa sistema de migrações
flask db migrate -m "msg"      # Cria nova migração
flask db upgrade               # Aplica migrações pendentes
flask db downgrade             # Reverte última migração
flask db history               # Mostra histórico de migrações
flask db current               # Mostra versão atual
```

### Fluxo de Migrações

1. **Modificar modelos** em `models.py`
2. **Criar migração**:
   ```bash
   flask db migrate -m "Descrição da mudança"
   ```
3. **Revisar migração** em `migrations/versions/`
4. **Aplicar migração**:
   ```bash
   flask db upgrade
   ```

### Exemplo de Migração

```bash
# Após modificar um modelo
export FLASK_APP=app.py
flask db migrate -m "Add stock column to products"
flask db upgrade
```

## 📁 Estrutura do Projeto

```
VinihidaBeverages/
├── app.py                    # Aplicação Flask principal
├── models.py                 # Modelos SQLAlchemy
├── config/                   # Configurações por ambiente
│   ├── __init__.py
│   └── settings.py
├── templates/                # Templates Jinja2
│   ├── base.html
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── products.html
│   └── cart.html
├── static/                   # Arquivos estáticos
│   └── css/
│       └── style.css
├── migrations/               # Migrações do banco
│   ├── versions/
│   ├── alembic.ini
│   ├── env.py
│   └── script.py.mako
├── instance/                 # Banco de dados SQLite
│   └── ecommerce.db
├── backups/                  # Backups do banco
├── requirements.txt          # Dependências Python
├── manage.py                 # Script de gerenciamento
├── init_project.py          # Script de inicialização
└── README.md
```

## 🔧 Scripts de Gerenciamento

### init_project.py
Script completo de inicialização que:
- Configura banco de dados
- Cria dados iniciais
- Configura migrações
- Cria usuário admin padrão

### manage.py
Script avançado com comandos:
- `init_db` - Inicializa banco
- `seed_db` - Popula dados
- `reset_db` - Reseta banco
- `backup_db` - Cria backup
- `show_tables` - Mostra informações

## 👤 Usuário Padrão

Após executar `init_project.py`:
- **Email**: admin@vinihida.com
- **Senha**: admin123
- **Tipo**: Administrador

## 🔄 Comandos de Desenvolvimento

```bash
# Desenvolvimento
python3 app.py                # Executa em modo debug

# Banco de dados
flask show-tables              # Status das tabelas
flask backup-db                # Backup automático
flask seed-db                  # Dados de exemplo

# Migrações
flask db migrate -m "msg"      # Nova migração
flask db upgrade               # Aplica migrações
flask db history               # Histórico

# Produção
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

## 🚀 Deploy

### Desenvolvimento
```bash
python3 app.py
```

### Produção
```bash
# Com Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app

# Com variáveis de ambiente
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:pass@localhost/db
gunicorn app:app
```

## 📊 Funcionalidades

### E-commerce
- ✅ Catálogo de produtos com categorias
- ✅ Carrinho de compras persistente
- ✅ Sistema de checkout
- ✅ Histórico de pedidos
- ✅ Gerenciamento de estoque

### Autenticação
- ✅ Registro e login de usuários
- ✅ Sessões seguras
- ✅ Níveis de acesso (admin/user)
- ✅ Verificação de idade

### Administração
- ✅ Comandos CLI para gerenciamento
- ✅ Sistema de backup automático
- ✅ Migrações versionadas
- ✅ Logs de atividade

## 🔒 Segurança

- Senhas hasheadas com Werkzeug
- Proteção CSRF
- Validação de entrada
- Sessões seguras
- Verificação de idade obrigatória

## 📝 Logs e Monitoramento

```bash
# Logs da aplicação
tail -f logs/app.log

# Backup automático
flask backup-db

# Status do sistema
flask show-tables
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Faça commit das mudanças
4. Crie uma migração se necessário
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor:

1. Verifique as issues existentes
2. Crie uma nova issue com detalhes do problema
3. Inclua logs de erro se disponíveis

---

**Vinihida Beverages** - Sua loja premium de bebidas alcoólicas 🍷🥃🍺