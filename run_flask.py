#!/usr/bin/env python3

import os
import sys

# Import and run the Flask app directly from current directory
from app import app, db

if __name__ == '__main__':
    with app.app_context():
        # Create all database tables
        db.create_all()
        
        # Import models for table creation
        from models import User, Product, Category, Order, OrderItem, Cart, CartItem
        
        # Add sample data if no categories exist
        if not Category.query.first():
            categories = [
                Category(name='Vinhos'),
                Category(name='Whiskies'),
                Category(name='Cervejas')
            ]
            for cat in categories:
                db.session.add(cat)
            
            # Add some sample products
            products = [
                Product(name='Vinho Tinto Premium', description='Vinho tinto encorpado com notas de frutas vermelhas', price=89.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
                Product(name='Whisky Single Malt', description='Whisky escocês envelhecido por 12 anos', price=250.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
                Product(name='Cerveja Artesanal IPA', description='India Pale Ale com lúpulos aromáticos', price=25.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
                Product(name='Vinho Branco Seco', description='Vinho branco refrescante e mineral', price=65.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
                Product(name='Bourbon Premium', description='Bourbon americano envelhecido em carvalho', price=180.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
                Product(name='Cerveja Pilsner', description='Cerveja lager clara e refrescante', price=18.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            ]
            for prod in products:
                db.session.add(prod)
            
            db.session.commit()
            print("✅ Dados de exemplo adicionados ao banco de dados!")
    
    print("🚀 Iniciando Vinihida Beverages...")
    print("📍 Acesse: http://localhost:5000")
    print("🛑 Para parar o servidor, pressione Ctrl+C")
    
    app.run(debug=True, host='0.0.0.0', port=5000) 