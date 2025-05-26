import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartPage: React.FC = () => {
  const { items, total, loading, updateItem, removeFromCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleQuantityChange = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await updateItem(itemId, quantity);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Your Cart</h1>
        
        {items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="flex justify-center mb-4">
              <ShoppingBag className="h-16 w-16 text-neutral-300" />
            </div>
            <h2 className="text-2xl font-medium mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-medium mb-4">Cart Items ({items.length})</h2>
                  
                  <div className="divide-y divide-neutral-200">
                    {items.map((item) => (
                      <div key={item.id} className="py-6 flex flex-col sm:flex-row">
                        <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                          <img 
                            src={item.image_url} 
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        
                        <div className="sm:ml-6 flex-1">
                          <div className="flex justify-between mb-2">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="font-serif text-primary-800">${item.price.toFixed(2)}</p>
                          </div>
                          
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4">
                            <div className="flex items-center mb-4 sm:mb-0">
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-l-md bg-neutral-100"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <div className="w-10 h-8 flex items-center justify-center border-t border-b border-neutral-300 bg-white">
                                {item.quantity}
                              </div>
                              <button 
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center border border-neutral-300 rounded-r-md bg-neutral-100"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            
                            <button 
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-error-600 text-sm flex items-center hover:text-error-700"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              <span>Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Tax</span>
                    <span>${(total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-xl font-serif text-primary-800">
                      ${(total + (total * 0.1)).toFixed(2)}
                    </span>
                  </div>
                </div>
                
                {!isAuthenticated ? (
                  <div className="mb-4 p-3 bg-warning-50 border border-warning-100 text-warning-700 rounded-md flex items-start">
                    <AlertTriangle className="h-5 w-5 text-warning-500 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium">Please sign in to continue</p>
                      <p className="text-xs mt-1">You need to be logged in to proceed to checkout</p>
                    </div>
                  </div>
                ) : null}
                
                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Link 
                      to="/checkout" 
                      className="btn-primary w-full"
                    >
                      Proceed to Checkout
                    </Link>
                  ) : (
                    <Link 
                      to="/login" 
                      className="btn-primary w-full"
                    >
                      Sign In to Checkout
                    </Link>
                  )}
                  
                  <Link 
                    to="/products" 
                    className="btn-outline w-full"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;