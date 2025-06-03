#!/usr/bin/env python3
"""
Script de inicialização completo do projeto Vinihida Beverages
Configura banco de dados, migrações e dados iniciais
"""

import os
import sys
import subprocess
from app import create_app
from models import db, User, Product, Category, Order, OrderItem, Cart, CartItem
from werkzeug.security import generate_password_hash

def run_command(command, description):
    """Executa um comando e mostra o resultado"""
    print(f"🔄 {description}...")
    try:
        result = subprocess.run(command, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} concluído!")
            if result.stdout.strip():
                print(f"   {result.stdout.strip()}")
        else:
            print(f"❌ Erro em {description}:")
            print(f"   {result.stderr.strip()}")
            return False
    except Exception as e:
        print(f"❌ Erro ao executar {description}: {e}")
        return False
    return True

def init_database():
    """Inicializa o banco de dados"""
    print("🗄️  Inicializando banco de dados...")
    
    app = create_app()
    with app.app_context():
        # Cria todas as tabelas
        db.create_all()
        print("✅ Tabelas criadas!")
        
        # Verifica se já existem dados
        if Category.query.first():
            print("⚠️  Dados já existem no banco.")
            return True
        
        # Cria categorias
        categories = [
            Category(name='Vinhos'),
            Category(name='Whiskies'),
            Category(name='Cervejas'),
            Category(name='Destilados'),
            Category(name='Espumantes')
        ]
        
        for cat in categories:
            db.session.add(cat)
        
        db.session.commit()
        print("✅ Categorias criadas!")
        
        # Cria produtos
        products = [
            # Vinhos
            Product(name='Vinho Tinto Premium', description='Vinho tinto encorpado com notas de frutas vermelhas', price=89.90, category_id=1, stock=25, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Vinho Branco Seco', description='Vinho branco refrescante e mineral', price=65.90, category_id=1, stock=30, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Vinho Rosé Premium', description='Vinho rosé delicado com notas florais', price=72.90, category_id=1, stock=20, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Champagne Dom Pérignon', description='Champagne francês de luxo', price=899.00, category_id=1, stock=5, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            
            # Whiskies
            Product(name='Whisky Single Malt', description='Whisky escocês envelhecido por 12 anos', price=250.00, category_id=2, stock=15, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Bourbon Premium', description='Bourbon americano envelhecido em carvalho', price=180.00, category_id=2, stock=20, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Whisky Japonês', description='Whisky japonês suave e equilibrado', price=320.00, category_id=2, stock=10, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Whisky Macallan 18', description='Single malt escocês envelhecido 18 anos', price=1200.00, category_id=2, stock=3, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            
            # Cervejas
            Product(name='Cerveja Artesanal IPA', description='India Pale Ale com lúpulos aromáticos', price=25.90, category_id=3, stock=50, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Cerveja Pilsner', description='Cerveja lager clara e refrescante', price=18.90, category_id=3, stock=60, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Cerveja Stout Imperial', description='Cerveja escura e encorpada', price=28.90, category_id=3, stock=40, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Cerveja Weiss', description='Cerveja de trigo alemã tradicional', price=19.90, category_id=3, stock=45, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
        ]
        
        for prod in products:
            db.session.add(prod)
        
        db.session.commit()
        print(f"✅ {len(products)} produtos criados!")
        
        # Cria usuário admin padrão
        admin = User(
            email='admin@vinihida.com',
            password=generate_password_hash('admin123'),
            first_name='Administrador',
            last_name='Sistema',
            is_admin=True
        )
        
        db.session.add(admin)
        db.session.commit()
        print("✅ Usuário administrador criado!")
        print("   📧 Email: admin@vinihida.com")
        print("   🔑 Senha: admin123")
        
        return True

def main():
    """Função principal"""
    print("🚀 Inicializando projeto Vinihida Beverages")
    print("=" * 50)
    
    # Verifica se está no ambiente virtual
    if not os.environ.get('VIRTUAL_ENV'):
        print("⚠️  Recomendado usar ambiente virtual!")
        print("   Execute: source venv/bin/activate")
        print()
    
    # Cria diretórios necessários
    os.makedirs('instance', exist_ok=True)
    os.makedirs('backups', exist_ok=True)
    os.makedirs('logs', exist_ok=True)
    
    # Inicializa banco de dados
    if not init_database():
        print("❌ Falha na inicialização do banco de dados")
        return False
    
    # Configura migrações se não existir
    if not os.path.exists('migrations'):
        print("🔄 Configurando sistema de migrações...")
        os.environ['FLASK_APP'] = 'app.py'
        
        if not run_command('flask db init', 'Inicializando migrações'):
            return False
        
        if not run_command('flask db stamp head', 'Marcando estado atual'):
            return False
    
    print()
    print("🎉 Projeto inicializado com sucesso!")
    print("=" * 50)
    print("📋 Próximos passos:")
    print("   1. Execute: python3 app.py")
    print("   2. Acesse: http://localhost:5000")
    print("   3. Login admin: admin@vinihida.com / admin123")
    print()
    print("🛠️  Comandos úteis:")
    print("   • flask show-tables     - Mostra tabelas")
    print("   • flask backup-db       - Cria backup")
    print("   • flask create-admin    - Cria novo admin")
    print("   • flask db migrate      - Cria migração")
    print("   • flask db upgrade      - Aplica migrações")
    print()
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1) 