import os
from flask import Flask, jsonify, request, render_template, redirect, url_for, session, flash
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_migrate import Migrate
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import click

# Load environment variables
load_dotenv()

def create_app(config_name=None):
    """Application factory pattern"""
    app = Flask(__name__, 
                template_folder='templates',
                static_folder='static')
    
    # Load configuration
    config_name = config_name or os.environ.get('FLASK_ENV', 'development')
    from config import config
    app.config.from_object(config[config_name])
    
    # Import db from models and initialize
    from models import db, User, Product, Category, Order, OrderItem, Cart, CartItem
    db.init_app(app)
    
    # Initialize extensions
    jwt = JWTManager(app)
    CORS(app)
    migrate = Migrate(app, db)
    
    # CLI Commands
    @app.cli.command()
    def init_db():
        """Inicializa o banco de dados"""
        click.echo('🔄 Criando tabelas do banco de dados...')
        db.create_all()
        click.echo('✅ Banco de dados inicializado!')

    @app.cli.command()
    def seed_db():
        """Popula o banco com dados de exemplo"""
        click.echo('🌱 Populando banco de dados...')
        
        # Verifica se já existem categorias
        if Category.query.first():
            click.echo('⚠️  Dados já existem. Use --force para recriar.')
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
        
        # Cria produtos expandidos
        products = [
            Product(name='Vinho Tinto Premium', description='Vinho tinto encorpado com notas de frutas vermelhas', price=89.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Whisky Single Malt', description='Whisky escocês envelhecido por 12 anos', price=250.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Cerveja Artesanal IPA', description='India Pale Ale com lúpulos aromáticos', price=25.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Vinho Branco Seco', description='Vinho branco refrescante e mineral', price=65.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Bourbon Premium', description='Bourbon americano envelhecido em carvalho', price=180.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Cerveja Pilsner', description='Cerveja lager clara e refrescante', price=18.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Vinho Rosé Premium', description='Vinho rosé delicado com notas florais', price=72.90, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Whisky Japonês', description='Whisky japonês suave e equilibrado', price=320.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Cerveja Stout Imperial', description='Cerveja escura e encorpada', price=28.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
            Product(name='Champagne Dom Pérignon', description='Champagne francês de luxo', price=899.00, category_id=1, image_url='https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=300&h=300&fit=crop'),
            Product(name='Whisky Macallan 18', description='Single malt escocês envelhecido 18 anos', price=1200.00, category_id=2, image_url='https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=300&h=300&fit=crop'),
            Product(name='Cerveja Weiss', description='Cerveja de trigo alemã tradicional', price=19.90, category_id=3, image_url='https://images.unsplash.com/photo-1608270586620-248524c67de9?w=300&h=300&fit=crop'),
        ]
        
        for prod in products:
            db.session.add(prod)
        
        db.session.commit()
        
        click.echo(f'✅ Banco populado com {len(categories)} categorias e {len(products)} produtos!')

    @app.cli.command()
    @click.option('--force', is_flag=True, help='Força a recriação do banco')
    def reset_db(force):
        """Remove e recria o banco de dados"""
        if not force:
            click.echo('⚠️  ATENÇÃO: Esta operação irá APAGAR todos os dados!')
            if not click.confirm('Deseja continuar?'):
                click.echo('❌ Operação cancelada.')
                return
        
        click.echo('🗑️  Removendo tabelas...')
        db.drop_all()
        
        click.echo('🔄 Recriando tabelas...')
        db.create_all()
        
        click.echo('✅ Banco de dados resetado!')

    @app.cli.command()
    def show_tables():
        """Mostra informações das tabelas"""
        from sqlalchemy import text
        
        click.echo('📊 Informações do banco de dados:')
        
        tables_info = [
            ('category', Category),
            ('product', Product),
            ('user', User),
            ('cart', Cart),
            ('cart_item', CartItem),
            ('order', Order),
            ('order_item', OrderItem),
        ]
        
        for table_name, model in tables_info:
            try:
                count = db.session.query(model).count()
                click.echo(f'  📋 {table_name}: {count} registros')
            except Exception as e:
                click.echo(f'  📋 {table_name}: erro ao contar ({str(e)})')

    @app.cli.command()
    def create_admin():
        """Cria um usuário administrador"""
        email = click.prompt('Email do administrador')
        password = click.prompt('Senha', hide_input=True, confirmation_prompt=True)
        first_name = click.prompt('Nome')
        last_name = click.prompt('Sobrenome')
        
        # Verifica se usuário já existe
        if User.query.filter_by(email=email).first():
            click.echo('❌ Usuário já existe!')
            return
        
        # Cria admin
        admin = User(
            email=email,
            password=generate_password_hash(password),
            first_name=first_name,
            last_name=last_name,
            is_admin=True
        )
        
        db.session.add(admin)
        db.session.commit()
        
        click.echo('✅ Administrador criado com sucesso!')

    @app.cli.command()
    def backup_db():
        """Cria backup do banco de dados"""
        from datetime import datetime
        import shutil
        
        if not os.path.exists('instance/ecommerce.db'):
            click.echo('❌ Banco de dados não encontrado!')
            return
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = 'backups'
        backup_file = f'backup_ecommerce_{timestamp}.db'
        
        os.makedirs(backup_dir, exist_ok=True)
        
        try:
            shutil.copy('instance/ecommerce.db', f'{backup_dir}/{backup_file}')
            click.echo(f'✅ Backup criado: {backup_dir}/{backup_file}')
        except Exception as e:
            click.echo(f'❌ Erro ao criar backup: {e}')

    # Helper function to check if user is logged in
    def is_authenticated():
        return 'user_id' in session

    def get_current_user():
        if is_authenticated():
            return User.query.get(session['user_id'])
        return None

    # Template context processors
    @app.context_processor
    def inject_user():
        return dict(current_user=get_current_user(), is_authenticated=is_authenticated())

    # Frontend Routes
    @app.route('/')
    def home():
        categories = Category.query.all()
        featured_products = Product.query.limit(8).all()
        return render_template('index.html', categories=categories, featured_products=featured_products)

    @app.route('/login')
    def login_page():
        if is_authenticated():
            return redirect(url_for('home'))
        return render_template('login.html')

    @app.route('/register')
    def register_page():
        if is_authenticated():
            return redirect(url_for('home'))
        return render_template('register.html')

    @app.route('/products')
    @app.route('/products/<int:category_id>')
    def products_page(category_id=None):
        categories = Category.query.all()
        if category_id:
            products = Product.query.filter_by(category_id=category_id).all()
            current_category = Category.query.get(category_id)
        else:
            products = Product.query.all()
            current_category = None
        
        return render_template('products.html', 
                             products=products, 
                             categories=categories, 
                             current_category=current_category)

    @app.route('/product/<int:product_id>')
    def product_detail_page(product_id):
        product = Product.query.get_or_404(product_id)
        related_products = Product.query.filter(
            Product.category_id == product.category_id,
            Product.id != product.id
        ).limit(4).all()
        
        return render_template('product_detail.html', 
                             product=product, 
                             related_products=related_products)

    @app.route('/cart')
    def cart_page():
        if not is_authenticated():
            return redirect(url_for('login_page'))
        
        user = get_current_user()
        cart = Cart.query.filter_by(user_id=user.id, is_active=True).first()
        cart_items = []
        total = 0
        
        if cart:
            cart_items_db = CartItem.query.filter_by(cart_id=cart.id).all()
            for item in cart_items_db:
                product = Product.query.get(item.product_id)
                cart_items.append({
                    'id': item.id,
                    'product': product,
                    'quantity': item.quantity,
                    'subtotal': product.price * item.quantity
                })
                total += product.price * item.quantity
        
        return render_template('cart.html', cart_items=cart_items, total=total)

    @app.route('/checkout')
    def checkout_page():
        if not is_authenticated():
            return redirect(url_for('login_page'))
        return render_template('checkout.html')

    @app.route('/profile')
    def profile_page():
        if not is_authenticated():
            return redirect(url_for('login_page'))
        
        user = get_current_user()
        orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
        return render_template('profile.html', orders=orders)

    @app.route('/logout')
    def logout():
        session.clear()
        flash('Você foi desconectado com sucesso.', 'success')
        return redirect(url_for('home'))

    # Form handling routes
    @app.route('/login', methods=['POST'])
    def login_form():
        email = request.form['email']
        password = request.form['password']
        
        user = User.query.filter_by(email=email).first()
        
        if not user or not check_password_hash(user.password, password):
            flash('Credenciais inválidas', 'error')
            return redirect(url_for('login_page'))
        
        session['user_id'] = user.id
        session['is_admin'] = user.is_admin
        flash('Login realizado com sucesso!', 'success')
        return redirect(url_for('home'))

    @app.route('/register', methods=['POST'])
    def register_form():
        email = request.form['email']
        password = request.form['password']
        first_name = request.form['firstName']
        last_name = request.form['lastName']
        
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            flash('Usuário já existe', 'error')
            return redirect(url_for('register_page'))
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(
            email=email,
            password=hashed_password,
            first_name=first_name,
            last_name=last_name,
            is_admin=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        session['user_id'] = new_user.id
        session['is_admin'] = new_user.is_admin
        flash('Conta criada com sucesso!', 'success')
        return redirect(url_for('home'))

    # API Routes
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 409
        
        # Create new user
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            email=data['email'],
            password=hashed_password,
            first_name=data.get('firstName', ''),
            last_name=data.get('lastName', ''),
            is_admin=False
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({'message': 'User created successfully'}), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'message': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token, user_id=user.id, is_admin=user.is_admin), 200

    @app.route('/api/products', methods=['GET'])
    def get_products():
        category_id = request.args.get('category_id')
        
        if category_id:
            products = Product.query.filter_by(category_id=category_id).all()
        else:
            products = Product.query.all()
        
        return jsonify([{
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price,
            'image_url': product.image_url,
            'category_id': product.category_id
        } for product in products]), 200

    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        return jsonify([{
            'id': category.id,
            'name': category.name
        } for category in categories]), 200

    @app.route('/api/cart', methods=['GET'])
    @jwt_required()
    def get_cart():
        user_id = get_jwt_identity()
        
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        
        if not cart:
            return jsonify({'items': [], 'total': 0}), 200
        
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
        items = []
        total = 0
        
        for item in cart_items:
            product = Product.query.get(item.product_id)
            items.append({
                'id': item.id,
                'product_id': item.product_id,
                'quantity': item.quantity,
                'price': product.price,
                'name': product.name,
                'image_url': product.image_url
            })
            total += product.price * item.quantity
        
        return jsonify({'items': items, 'total': total}), 200

    @app.route('/api/cart/add', methods=['POST'])
    @jwt_required()
    def add_to_cart():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get or create active cart
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart:
            cart = Cart(user_id=user_id, is_active=True)
            db.session.add(cart)
            db.session.commit()
        
        # Check if product already in cart
        cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=data['product_id']).first()
        
        if cart_item:
            cart_item.quantity += data['quantity']
        else:
            cart_item = CartItem(
                cart_id=cart.id,
                product_id=data['product_id'],
                quantity=data['quantity']
            )
            db.session.add(cart_item)
        
        db.session.commit()
        return jsonify({'message': 'Item added to cart'}), 200

    @app.route('/api/cart/update', methods=['PUT'])
    @jwt_required()
    def update_cart_item():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
        
        cart_item = CartItem.query.filter_by(cart_id=cart.id, id=data['item_id']).first()
        if not cart_item:
            return jsonify({'message': 'Item not found in cart'}), 404
        
        cart_item.quantity = data['quantity']
        db.session.commit()
        
        return jsonify({'message': 'Cart updated'}), 200

    @app.route('/api/cart/remove', methods=['DELETE'])
    @jwt_required()
    def remove_from_cart():
        user_id = get_jwt_identity()
        item_id = request.args.get('item_id')
        
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart:
            return jsonify({'message': 'Cart not found'}), 404
        
        cart_item = CartItem.query.filter_by(cart_id=cart.id, id=item_id).first()
        if not cart_item:
            return jsonify({'message': 'Item not found in cart'}), 404
        
        db.session.delete(cart_item)
        db.session.commit()
        
        return jsonify({'message': 'Item removed from cart'}), 200

    @app.route('/api/checkout', methods=['POST'])
    @jwt_required()
    def checkout():
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Get active cart
        cart = Cart.query.filter_by(user_id=user_id, is_active=True).first()
        if not cart or not CartItem.query.filter_by(cart_id=cart.id).first():
            return jsonify({'message': 'Cart is empty'}), 400
        
        # Create new order
        new_order = Order(
            user_id=user_id,
            total_amount=data['total_amount'],
            shipping_address=data['shipping_address'],
            payment_method=data['payment_method'],
            status='pending'
        )
        db.session.add(new_order)
        db.session.commit()
        
        # Create order items from cart items
        cart_items = CartItem.query.filter_by(cart_id=cart.id).all()
        for item in cart_items:
            product = Product.query.get(item.product_id)
            order_item = OrderItem(
                order_id=new_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=product.price
            )
            db.session.add(order_item)
        
        # Mark cart as inactive
        cart.is_active = False
        db.session.commit()
        
        return jsonify({'message': 'Order placed successfully', 'order_id': new_order.id}), 201

    @app.route('/api/user/orders', methods=['GET'])
    @jwt_required()
    def get_user_orders():
        user_id = get_jwt_identity()
        
        orders = Order.query.filter_by(user_id=user_id).all()
        return jsonify([{
            'id': order.id,
            'date': order.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'total_amount': order.total_amount,
            'status': order.status
        } for order in orders]), 200

    @app.route('/verify-age', methods=['POST'])
    def verify_age():
        session['age_verified'] = True
        return jsonify({'status': 'success'})

    return app

# Create app instance
app = create_app()

# Run the application
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)