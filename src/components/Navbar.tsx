import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Wine, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { getCategories } from '../utils/api';

interface Category {
  id: number;
  name: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <Wine className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-2xl font-serif font-bold text-primary-800">
              Vinihida<span className="text-accent-500">Beverages</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-neutral-700 hover:text-primary-600 transition-colors">
              All Products
            </Link>
            
            {categories.slice(0, 3).map((category) => (
              <Link 
                key={category.id}
                to={`/products/${category.id}`}
                className="text-neutral-700 hover:text-primary-600 transition-colors"
              >
                {category.name}
              </Link>
            ))}
            
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="relative">
                <ShoppingCart className="h-6 w-6 text-neutral-700 hover:text-primary-600 transition-colors" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </Link>
              
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center text-neutral-700 hover:text-primary-600 transition-colors">
                    <User className="h-6 w-6" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block animate-fade-in">
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      My Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="btn-outline py-2 px-4 text-sm"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Navigation Button */}
          <button 
            className="md:hidden text-neutral-700"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-neutral-200 animate-slide-down">
            <Link 
              to="/products" 
              className="block py-2 text-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              All Products
            </Link>
            
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/products/${category.id}`}
                className="block py-2 text-neutral-700"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
            ))}
            
            <Link 
              to="/cart" 
              className="block py-2 text-neutral-700"
              onClick={() => setIsOpen(false)}
            >
              Cart ({itemCount})
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/profile" 
                  className="block py-2 text-neutral-700"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <button 
                  onClick={handleLogout}
                  className="block py-2 text-neutral-700"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link 
                to="/login" 
                className="block py-2 text-neutral-700"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;