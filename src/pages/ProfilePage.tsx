import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, Package } from 'lucide-react';
import { getUserOrders } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

interface Order {
  id: number;
  date: string;
  total_amount: number;
  status: string;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        try {
          setLoading(true);
          const data = await getUserOrders();
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, [activeTab]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-success-500 bg-success-50';
      case 'pending':
        return 'text-warning-500 bg-warning-50';
      case 'cancelled':
        return 'text-error-500 bg-error-50';
      default:
        return 'text-neutral-500 bg-neutral-50';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-8">My Account</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 bg-primary-800 text-white">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">{user?.email}</p>
                    <p className="text-sm text-primary-200">Member since 2023</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg ${
                      activeTab === 'profile' 
                        ? 'bg-primary-50 text-primary-800' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <User className="h-5 w-5 mr-3" />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full flex items-center px-4 py-3 rounded-lg ${
                      activeTab === 'orders' 
                        ? 'bg-primary-50 text-primary-800' 
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <ShoppingBag className="h-5 w-5 mr-3" />
                    <span>Orders</span>
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    <span>Sign Out</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md p-6">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Profile Information</h2>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Email Address</p>
                        <p className="font-medium">{user?.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">Account Type</p>
                        <p className="font-medium">{user?.isAdmin ? 'Administrator' : 'Customer'}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-200">
                      <h3 className="text-lg font-medium mb-4">Password</h3>
                      
                      <button className="btn-outline py-2 px-4">
                        Change Password
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-200">
                      <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                      
                      <p className="text-neutral-600 mb-4">No shipping addresses saved yet.</p>
                      
                      <button className="btn-outline py-2 px-4">
                        Add Shipping Address
                      </button>
                    </div>
                    
                    <div className="pt-6 border-t border-neutral-200">
                      <h3 className="text-lg font-medium mb-4">Payment Methods</h3>
                      
                      <p className="text-neutral-600 mb-4">No payment methods saved yet.</p>
                      
                      <button className="btn-outline py-2 px-4">
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-xl font-medium mb-6">Order History</h2>
                  
                  {loading ? (
                    <div className="flex justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
                    </div>
                  ) : orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-neutral-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                #{order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                {new Date(order.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                ${order.total_amount.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-primary-600 hover:text-primary-700">
                                  View Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-neutral-50 rounded-lg">
                      <div className="flex justify-center mb-4">
                        <Package className="h-12 w-12 text-neutral-400" />
                      </div>
                      <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                      <p className="text-neutral-600 mb-4">
                        You haven't placed any orders yet. Start shopping to create your first order.
                      </p>
                      <button 
                        onClick={() => navigate('/products')}
                        className="btn-primary"
                      >
                        Browse Products
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;