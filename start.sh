#!/bin/bash

echo "🔧 Instalando dependências do projeto..."
pip install -r requirements.txt

echo "📦 Definindo variável de ambiente FLASK_APP=app.py"
export FLASK_APP=app.py

echo "🔍 Verificando se diretório de migrações já existe..."
if [ ! -d "migrations" ]; then
    echo "🛠️ Inicializando sistema de migrações..."
    flask db init
else
    echo "✅ Diretório de migrações já existe. Pulando 'flask db init'."
fi

echo "📐 Criando nova migração..."
flask db migrate -m "Initial migration"

echo "⬆️ Aplicando migrações..."
flask db upgrade

echo "💾 Mostrando tabelas existentes:"
flask show-tables

echo "🧬 Criando admin e populando base com dados fictícios..."
flask create-admin
flask seed-db

echo "✅ Setup completo!"
