import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const OrderSuccessPage: React.FC = () => {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart after successful order
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
      <div className="container px-4 mx-auto">
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-success-500" />
          </div>
          
          <h1 className="text-3xl font-serif font-bold mb-4">Order Successful!</h1>
          
          <p className="text-lg text-neutral-600 mb-6">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
          
          <div className="mb-8 p-6 bg-primary-50 rounded-lg">
            <h3 className="text-lg font-medium mb-2">What's Next?</h3>
            <p className="text-neutral-600 mb-4">
              You will receive an email confirmation with your order details shortly.
              Your order will be prepared and shipped within 1-2 business days.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="text-left">
                <p className="font-medium">Order ID:</p>
                <p className="text-neutral-600">#ORD12345678</p>
              </div>
              <div className="text-left">
                <p className="font-medium">Estimated Delivery:</p>
                <p className="text-neutral-600">3-5 Business Days</p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
            <Link to="/profile" className="btn-outline">
              View My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;