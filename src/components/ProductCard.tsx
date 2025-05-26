import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, description }) => {
  const { addToCart } = useCart();

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await addToCart(id, 1);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <Link to={`/product/${id}`} className="group">
      <div className="card h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img 
            src={imageUrl} 
            alt={name}
            className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button 
              onClick={handleAddToCart}
              className="bg-white text-primary-600 p-3 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="font-medium text-lg">{name}</h3>
          <p className="text-neutral-600 text-sm mt-1 line-clamp-2 flex-grow">{description}</p>
          <div className="mt-4 flex justify-between items-center">
            <span className="text-xl font-serif font-semibold text-primary-800">${price.toFixed(2)}</span>
            <button 
              onClick={handleAddToCart}
              className="md:hidden bg-primary-600 text-white p-2 rounded-full"
            >
              <ShoppingCart className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;