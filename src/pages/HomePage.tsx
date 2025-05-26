import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Wine, Beer, Martini } from 'lucide-react';
import { getProducts, getCategories } from '../utils/api';
import ProductCard from '../components/ProductCard';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category_id: number;
}

interface Category {
  id: number;
  name: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        const categoriesData = await getCategories();
        
        // Use only first 4 products as featured
        setFeaturedProducts(productsData.slice(0, 4));
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getCategoryIcon = (categoryName: string) => {
    switch(categoryName.toLowerCase()) {
      case 'wines':
        return <Wine className="h-10 w-10 text-primary-600" />;
      case 'beers':
        return <Beer className="h-10 w-10 text-primary-600" />;
      case 'spirits':
        return <Martini className="h-10 w-10 text-primary-600" />;
      default:
        return <Wine className="h-10 w-10 text-primary-600" />;
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-hero-pattern bg-cover bg-center h-screen flex items-center">
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="container relative z-10 px-4 mx-auto">
          <div className="max-w-xl animate-fade-in">
            <h1 className="text-white font-serif text-5xl md:text-6xl font-bold mb-4">
              Premium Spirits & Beverages
            </h1>
            <p className="text-white text-xl mb-8">
              Discover our curated collection of fine alcoholic beverages from around the world.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/products" className="btn-accent">
                Shop Now
              </Link>
              <Link to="/products/1" className="btn bg-white text-primary-800 hover:bg-neutral-100">
                Explore Beers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container px-4 mx-auto">
          <h2 className="text-3xl font-serif font-semibold text-center mb-12">
            Explore Our Collections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.slice(0, 3).map((category) => (
              <Link 
                key={category.id} 
                to={`/products/${category.id}`}
                className="card p-8 text-center hover:shadow-xl transition-all duration-300 group"
              >
                <div className="inline-flex items-center justify-center bg-primary-100 p-4 rounded-full mb-4">
                  {getCategoryIcon(category.name)}
                </div>
                <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                <p className="text-neutral-600 mb-4">
                  Explore our premium selection of {category.name.toLowerCase()}
                </p>
                <span className="inline-flex items-center text-primary-600 font-medium group-hover:translate-x-1 transition-transform duration-200">
                  Browse Collection <ChevronRight className="h-4 w-4 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container px-4 mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-serif font-semibold">Featured Products</h2>
            <Link 
              to="/products" 
              className="flex items-center text-primary-600 font-medium hover:underline"
            >
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.image_url}
                  description={product.description}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="py-16 bg-primary-800 text-white">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-8 md:mb-0 md:w-1/2">
              <h2 className="text-3xl font-serif font-bold mb-4">
                Join Our Premium Membership
              </h2>
              <p className="text-primary-100 mb-6 max-w-md">
                Enjoy exclusive discounts, early access to limited releases, and personalized recommendations.
              </p>
              <Link to="/register" className="btn-accent">
                Sign Up Now
              </Link>
            </div>
            <div className="md:w-1/3">
              <div className="glass p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-4">Member Benefits</h3>
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    <span>10% off on all purchases</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    <span>Free shipping on orders over $100</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    <span>Exclusive tasting events</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-accent-500 rounded-full mr-2"></span>
                    <span>Early access to limited editions</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;