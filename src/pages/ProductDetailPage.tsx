import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, ArrowLeft, Check } from 'lucide-react';
import { getProducts } from '../utils/api';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
}

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const products = await getProducts();
        
        const foundProduct = products.find(p => p.id === parseInt(productId!));
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Get related products (same category)
          const related = products.filter(p => 
            p.category_id === foundProduct.category_id && p.id !== foundProduct.id
          ).slice(0, 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    try {
      setAddingToCart(true);
      await addToCart(product.id, quantity);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-neutral-600 mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="btn-primary">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4 mx-auto">
        {/* Back Navigation */}
        <Link to="/products" className="inline-flex items-center text-primary-600 mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
        
        {/* Product Details */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Product Image */}
            <div className="h-full">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col">
              <h1 className="text-3xl font-serif font-bold mb-2">{product.name}</h1>
              <p className="text-2xl font-serif text-primary-800 mb-4">${product.price.toFixed(2)}</p>
              
              <div className="border-t border-b border-neutral-200 py-4 my-4">
                <p className="text-neutral-600 leading-relaxed">
                  {product.description}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm font-medium text-neutral-700 mb-2">Quantity</p>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-l-md bg-neutral-100"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <div className="w-14 h-10 flex items-center justify-center border-t border-b border-neutral-300 bg-white">
                    {quantity}
                  </div>
                  <button 
                    onClick={increaseQuantity}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-300 rounded-r-md bg-neutral-100"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="mt-auto">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handleAddToCart}
                    disabled={addingToCart}
                    className="btn-primary flex-1"
                  >
                    {addingToCart ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                        Adding...
                      </div>
                    ) : addedToCart ? (
                      <div className="flex items-center justify-center">
                        <Check className="h-5 w-5 mr-2" />
                        Added to Cart
                      </div>
                    ) : (
                      'Add to Cart'
                    )}
                  </button>
                  <Link to="/cart" className="btn-outline flex-1">
                    View Cart
                  </Link>
                </div>
                
                <div className="mt-6">
                  <div className="flex items-center justify-center space-x-4 text-sm text-neutral-600">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-success-500 mr-1" />
                      <span>In Stock</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-success-500 mr-1" />
                      <span>Free Shipping</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-success-500 mr-1" />
                      <span>Secure Payment</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-serif font-semibold mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link 
                  key={relatedProduct.id} 
                  to={`/product/${relatedProduct.id}`}
                  className="card hover:shadow-lg transition-shadow"
                >
                  <img 
                    src={relatedProduct.image_url} 
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium mb-1">{relatedProduct.name}</h3>
                    <p className="text-primary-800 font-serif">${relatedProduct.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;