import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { CategorySection } from './components/CategorySection';
import { StickyBottomBar } from './components/StickyBottomBar';
import { FilterBar, FilterState } from './components/FilterBar';
import { fireworkProducts, categories } from './data/products';

export default function App() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchTerm: '',
    selectedCategories: [],
    sortBy: 'name'
  });

  const handleQuantityChange = (productId: string, quantity: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }));
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = fireworkProducts.filter(product => {
      // Search term filter
      if (filters.searchTerm && !product.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !product.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filters.selectedCategories.length > 0 && !filters.selectedCategories.includes(product.category)) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (filters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'pieces':
        filtered.sort((a, b) => b.piecesPerBox - a.piecesPerBox);
        break;
      case 'name':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }, [filters]);

  const getProductsByCategory = (category: string) => {
    return filteredProducts.filter(product => product.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      
      {/* Filter Bar */}
      <div className="px-3 sm:px-4 mt-6 sm:mt-8">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          totalProductsCount={fireworkProducts.length}
          filteredProductsCount={filteredProducts.length}
        />
      </div>

      {/* Product Categories */}
      <main className="px-3 pb-24 sm:px-4 sm:pb-32">
        {categories.map((category) => {
          const categoryProducts = getProductsByCategory(category);
          if (categoryProducts.length === 0) return null;
          
          return (
            <CategorySection
              key={category}
              categoryName={category}
              products={categoryProducts}
              quantities={quantities}
              onQuantityChange={handleQuantityChange}
            />
          );
        })}
        
        {filteredProducts.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🎆</div>
            <h3 className="text-lg sm:text-xl font-medium mb-2">No fireworks found</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base px-4">
              Try adjusting your filters or search terms to find the perfect fireworks for your celebration.
            </p>
          </div>
        )}
      </main>

      {/* Sticky Bottom Bar */}
      <StickyBottomBar 
        products={fireworkProducts}
        quantities={quantities}
        onQuantityChange={handleQuantityChange}
      />

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 mt-8 sm:mt-16 mb-24 sm:mb-32">
        <div className="px-3 sm:px-4 text-center">
          <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">PyroWorld - Light Up Your Celebrations</h3>
          <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">
            Professional fireworks for weddings, parties, and special events
          </p>
          <div className="flex flex-col sm:flex-row sm:flex-wrap justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            <span>📱 WhatsApp Orders: +1 (555) 123-4567</span>
            <span>🚚 Fast Nationwide Shipping</span>
            <span>🔒 Secure & Safe Products</span>
            <span>💯 100% Satisfaction Guarantee</span>
          </div>
          <p className="text-xs text-gray-500 mt-3 sm:mt-4">
            © 2025 PyroWorld. All rights reserved. Use fireworks responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
}