import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { checkout } from '../utils/api';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const { items, total } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '')
        .replace(/(\d{4})/g, '$1 ')
        .trim()
        .slice(0, 19);
      
      setFormData((prev) => ({
        ...prev,
        cardNumber: formatted,
      }));
      return;
    }
    
    // Format expiry date (MM/YY)
    if (name === 'expiryDate') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/, '$1/$2')
        .slice(0, 5);
      
      setFormData((prev) => ({
        ...prev,
        expiryDate: formatted,
      }));
      return;
    }
    
    // Format CVV (numbers only)
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 3);
      
      setFormData((prev) => ({
        ...prev,
        cvv: formatted,
      }));
      return;
    }
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      firstName,
      lastName,
      email,
      address,
      city,
      state,
      zipCode,
      cardName,
      cardNumber,
      expiryDate,
      cvv,
    } = formData;
    
    if (!firstName || !lastName || !email || !address || !city || !state || !zipCode) {
      setError('Please fill in all shipping information fields');
      return false;
    }
    
    if (!cardName || !cardNumber || !expiryDate || !cvv) {
      setError('Please fill in all payment information fields');
      return false;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setError('Please enter a valid card number');
      return false;
    }
    
    if (!expiryDate.match(/^\d{2}\/\d{2}$/)) {
      setError('Please enter a valid expiry date (MM/YY)');
      return false;
    }
    
    if (cvv.length !== 3) {
      setError('Please enter a valid CVV');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    const totalWithTax = total + (total * 0.1);
    const shippingAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
    
    try {
      setLoading(true);
      setError('');
      
      await checkout({
        total_amount: totalWithTax,
        shipping_address: shippingAddress,
        payment_method: 'Credit Card',
      });
      
      navigate('/order-success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const tax = total * 0.1;
  const totalWithTax = total + tax;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">Checkout</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-error-50 border border-error-100 text-error-700 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 text-error-500 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Shipping and Payment Information */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="label">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="input"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="lastName" className="label">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="input"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="email" className="label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="label">Street Address</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      className="input"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="label">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      className="input"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="state" className="label">State</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        className="input"
                        value={formData.state}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="label">ZIP Code</label>
                      <input
                        type="text"
                        id="zipCode"
                        name="zipCode"
                        className="input"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-medium mb-4">Payment Information</h2>
                
                <div className="mb-4">
                  <div className="p-4 bg-primary-50 border border-primary-100 rounded-md flex items-center">
                    <CreditCard className="h-6 w-6 text-primary-500 mr-3" />
                    <div>
                      <p className="font-medium text-primary-800">Credit Card</p>
                      <p className="text-sm text-primary-600">All transactions are secure and encrypted</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="cardName" className="label">Name on Card</label>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      className="input"
                      value={formData.cardName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="cardNumber" className="label">Card Number</label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      className="input"
                      placeholder="0000 0000 0000 0000"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="label">Expiry Date</label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        className="input"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="cvv" className="label">CVV</label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        className="input"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
                <h2 className="text-xl font-medium mb-4">Order Summary</h2>
                
                <div className="max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center mb-3 pb-3 border-b border-neutral-100">
                      <div className="w-12 h-12 flex-shrink-0">
                        <img 
                          src={item.image_url} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <p className="font-medium">{item.name}</p>
                        <div className="flex justify-between text-sm text-neutral-600">
                          <span>Qty: {item.quantity}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
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
                    <span className="text-neutral-600">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="pt-3 border-t border-neutral-200 flex justify-between font-medium">
                    <span>Total</span>
                    <span className="text-xl font-serif text-primary-800">
                      ${totalWithTax.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="btn-primary w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-white rounded-full animate-spin mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    'Complete Order'
                  )}
                </button>
                
                <div className="mt-4 flex items-center justify-center text-sm text-neutral-600">
                  <Check className="h-4 w-4 text-success-500 mr-1" />
                  <span>Your personal data is secure</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;