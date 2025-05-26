import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy
from dotenv import load_dotenv
import datetime

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key-replace-in-production')
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///ecommerce.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=1)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Import models after db initialization to avoid circular imports
from models import User, Product, Category, Order, OrderItem, Cart, CartItem

# Routes
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

# Run the application
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Create default categories if they don't exist
        if not Category.query.first():
            categories = [
                Category(name="Beers"),
                Category(name="Wines"),
                Category(name="Spirits"),
                Category(name="Cocktails"),
                Category(name="Non-Alcoholic")
            ]
            db.session.add_all(categories)
            db.session.commit()
            
            # Add some sample products
            products = [
                Product(name="Craft IPA", description="Hoppy India Pale Ale with citrus notes", price=12.99, image_url="https://images.pexels.com/photos/1089930/pexels-photo-1089930.jpeg", category_id=1),
                Product(name="Red Wine Blend", description="Full-bodied red wine with notes of cherry and oak", price=24.99, image_url="https://images.pexels.com/photos/2912108/pexels-photo-2912108.jpeg", category_id=2),
                Product(name="Single Malt Whiskey", description="Aged 12 years with smoky flavor profile", price=59.99, image_url="https://images.pexels.com/photos/4667031/pexels-photo-4667031.jpeg", category_id=3),
                Product(name="Margarita Mix", description="Premium ready-to-mix cocktail", price=18.99, image_url="https://images.pexels.com/photos/3407782/pexels-photo-3407782.jpeg", category_id=4),
                Product(name="Artisanal Root Beer", description="Craft non-alcoholic root beer", price=8.99, image_url="https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg", category_id=5)
            ]
            db.session.add_all(products)
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)