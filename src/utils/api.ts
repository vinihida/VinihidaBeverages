import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authorization header for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const login = async (email: string, password: string) => {
  const response = await api.post('/login', { email, password });
  return response.data;
};

export const register = async (userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const response = await api.post('/register', userData);
  return response.data;
};

// Products API
export const getProducts = async (categoryId?: string) => {
  const response = await api.get('/products', {
    params: categoryId ? { category_id: categoryId } : {},
  });
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Cart API
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

export const addToCart = async (productId: number, quantity: number) => {
  const response = await api.post('/cart/add', { product_id: productId, quantity });
  return response.data;
};

export const updateCartItem = async (itemId: number, quantity: number) => {
  const response = await api.put('/cart/update', { item_id: itemId, quantity });
  return response.data;
};

export const removeFromCart = async (itemId: number) => {
  const response = await api.delete(`/cart/remove?item_id=${itemId}`);
  return response.data;
};

// Orders API
export const checkout = async (orderData: {
  total_amount: number;
  shipping_address: string;
  payment_method: string;
}) => {
  const response = await api.post('/checkout', orderData);
  return response.data;
};

export const getUserOrders = async () => {
  const response = await api.get('/user/orders');
  return response.data;
};

export default api;