#!/usr/bin/env python3
"""
Script de gerenciamento do banco de dados Vinihida Beverages
Usa Flask-Migrate para gerenciar migrações do SQLAlchemy
"""

import os
import sys
from flask.cli import FlaskGroup
from flask_migrate import init, migrate, upgrade, downgrade, history, show
from app import create_app
from models import db, User, Product, Category, Order, OrderItem, Cart, CartItem

def create_app_for_cli():
    """Cria instância da app para CLI"""
    return create_app()

cli = FlaskGroup(create_app=create_app_for_cli)

@cli.command()
def init_db():
    """Inicializa o banco de dados com migrações"""
    print("🔄 Inicializando sistema de migrações...")
    
    # Verifica se já existe o diretório migrations
    if os.path.exists('migrations'):
        print("⚠️  Diretório migrations já existe. Removendo...")
        import shutil
        shutil.rmtree('migrations')
    
    # Inicializa as migrações
    init()
    print("✅ Sistema de migrações inicializado!")
    
    # Cria migração inicial
    print("🔄 Criando migração inicial...")
    migrate(message='Initial migration')
    print("✅ Migração inicial criada!")
    
    # Aplica a migração
    print("🔄 Aplicando migração...")
    upgrade()
    print("✅ Migração aplicada com sucesso!")

@cli.command()
def seed_db():
    """Popula o banco com dados iniciais"""
    print("🌱 Populando banco de dados com dados iniciais...")
    
    # Verifica se já existem categorias
    if Category.query.first():
        print("⚠️  Dados já existem no banco. Pulando seed...")
        return
    
    # Cria categorias
    categories = [
        Category(name='Vinhos'),
        Category(name='Whiskies'),
        Category(name='Cervejas')
    ]
    
    for cat in categories:
        db.session.add(cat)
    
    db.session.commit()
    print("✅ Categorias criadas!")
    
    # Cria produtos
    products = [
        Product(name='Vinho Tinto Premium', description='Vinho tinto encorpado com notas de frutas vermelhas', price=89.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
        Product(name='Whisky Single Malt', description='Whisky escocês envelhecido por 12 anos', price=250.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
        Product(name='Cerveja Artesanal IPA', description='India Pale Ale com lúpulos aromáticos', price=25.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
        Product(name='Vinho Branco Seco', description='Vinho branco refrescante e mineral', price=65.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
        Product(name='Bourbon Premium', description='Bourbon americano envelhecido em carvalho', price=180.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
        Product(name='Cerveja Pilsner', description='Cerveja lager clara e refrescante', price=18.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
        Product(name='Vinho Rosé', description='Vinho rosé delicado e frutado', price=45.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
        Product(name='Whisky Japonês', description='Whisky japonês suave e complexo', price=320.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
        Product(name='Cerveja Stout', description='Cerveja escura e cremosa', price=22.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
        Product(name='Champagne Premium', description='Champagne francês de alta qualidade', price=450.00, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
    ]
    
    for prod in products:
        db.session.add(prod)
    
    db.session.commit()
    print("✅ Produtos criados!")
    
    print(f"🎉 Banco populado com {len(categories)} categorias e {len(products)} produtos!")

@cli.command()
def reset_db():
    """Remove e recria o banco de dados"""
    print("⚠️  ATENÇÃO: Isso irá APAGAR todos os dados!")
    confirm = input("Digite 'CONFIRMAR' para continuar: ")
    
    if confirm != 'CONFIRMAR':
        print("❌ Operação cancelada.")
        return
    
    print("🗑️  Removendo banco de dados...")
    db.drop_all()
    
    print("🔄 Recriando banco de dados...")
    db.create_all()
    
    print("✅ Banco de dados resetado!")
    print("💡 Execute 'python manage.py seed_db' para popular com dados iniciais.")

@cli.command()
def show_tables():
    """Mostra as tabelas do banco de dados"""
    print("📊 Tabelas no banco de dados:")
    
    # Conecta ao banco e lista tabelas
    with db.engine.connect() as conn:
        from sqlalchemy import text
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table';"))
        tables = result.fetchall()
        
        if not tables:
            print("❌ Nenhuma tabela encontrada.")
            return
        
        for table in tables:
            table_name = table[0]
            print(f"  📋 {table_name}")
            
            # Conta registros
            count_result = conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
            count = count_result.fetchone()[0]
            print(f"     └── {count} registros")

@cli.command()
def backup_db():
    """Cria backup do banco de dados"""
    from datetime import datetime
    import shutil
    
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"backup_ecommerce_{timestamp}.db"
    
    try:
        shutil.copy('instance/ecommerce.db', f'backups/{backup_name}')
        print(f"✅ Backup criado: backups/{backup_name}")
    except FileNotFoundError:
        os.makedirs('backups', exist_ok=True)
        shutil.copy('instance/ecommerce.db', f'backups/{backup_name}')
        print(f"✅ Backup criado: backups/{backup_name}")
    except Exception as e:
        print(f"❌ Erro ao criar backup: {e}")

@cli.command()
def create_migration():
    """Cria uma nova migração"""
    message = input("Digite a mensagem da migração: ")
    if not message:
        message = "Auto migration"
    
    print(f"🔄 Criando migração: {message}")
    migrate(message=message)
    print("✅ Migração criada!")

@cli.command()
def apply_migrations():
    """Aplica todas as migrações pendentes"""
    print("🔄 Aplicando migrações...")
    upgrade()
    print("✅ Migrações aplicadas!")

@cli.command()
def migration_history():
    """Mostra histórico de migrações"""
    print("📜 Histórico de migrações:")
    history()

if __name__ == '__main__':
    cli() 