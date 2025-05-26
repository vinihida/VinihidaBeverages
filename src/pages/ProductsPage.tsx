import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, Search, ChevronDown } from 'lucide-react';
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

const ProductsPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId?: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [sortOption, setSortOption] = useState<string>('default');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(categoryId),
          getCategories()
        ]);
        
        setProducts(productsData);
        setFilteredProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply price range filter
    result = result.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Apply sorting
    switch (sortOption) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (newest first)
        break;
    }
    
    setFilteredProducts(result);
  }, [products, searchTerm, priceRange, sortOption]);

  const getCategoryName = () => {
    if (!categoryId) return 'All Products';
    const category = categories.find(cat => cat.id === parseInt(categoryId));
    return category ? category.name : 'Products';
  };

  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setPriceRange(prev => {
      if (name === 'min') {
        return [numValue, prev[1]];
      } else {
        return [prev[0], numValue];
      }
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container px-4 mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold mb-2">{getCategoryName()}</h1>
          <p className="text-neutral-600">
            Discover our premium selection of {getCategoryName().toLowerCase()}
          </p>
        </div>
        
        {/* Filters and Sorting - Desktop */}
        <div className="hidden md:flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-neutral-600">Price:</span>
              <input
                type="number"
                name="min"
                min="0"
                max={priceRange[1]}
                value={priceRange[0]}
                onChange={handleRangeChange}
                className="w-16 px-2 py-1 border border-neutral-300 rounded-md"
              />
              <span>-</span>
              <input
                type="number"
                name="max"
                min={priceRange[0]}
                max="1000"
                value={priceRange[1]}
                onChange={handleRangeChange}
                className="w-16 px-2 py-1 border border-neutral-300 rounded-md"
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <label htmlFor="sort" className="mr-2 text-sm text-neutral-600">Sort by:</label>
            <select
              id="sort"
              className="px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={sortOption}
              onChange={handleSortChange}
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>
        </div>
        
        {/* Filters and Sorting - Mobile */}
        <div className="md:hidden mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="relative flex-1 mr-2">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 h-4 w-4" />
            </div>
            
            <button 
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="flex items-center bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md"
            >
              <Filter className="h-4 w-4 mr-1" />
              <span>Filter</span>
              <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${filtersOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
          
          {filtersOpen && (
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4 animate-slide-down">
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Price Range</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    name="min"
                    min="0"
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={handleRangeChange}
                    className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                    placeholder="Min"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    name="max"
                    min={priceRange[0]}
                    max="1000"
                    value={priceRange[1]}
                    onChange={handleRangeChange}
                    className="w-full px-2 py-1 border border-neutral-300 rounded-md"
                    placeholder="Max"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="mobile-sort" className="block text-sm font-medium text-neutral-700 mb-1">Sort by:</label>
                <select
                  id="mobile-sort"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  value={sortOption}
                  onChange={handleSortChange}
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                </select>
              </div>
            </div>
          )}
        </div>
        
        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
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
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">No products found</h3>
            <p className="text-neutral-600 mb-4">Try adjusting your search or filter criteria</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setPriceRange([0, 200]);
                setSortOption('default');
              }}
              className="btn-secondary"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;