import { useState } from 'react';
import { Product } from './ProductCard';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart } from 'lucide-react';
import { Cart } from './Cart';

interface StickyBottomBarProps {
  products: Product[];
  quantities: Record<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function StickyBottomBar({ products, quantities, onQuantityChange }: StickyBottomBarProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const cartItems = products.filter(product => quantities[product.id] > 0);
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = cartItems.reduce((sum, product) => {
    return sum + (product.price * quantities[product.id]);
  }, 0);

  // Don't show the bar if no items in cart
  if (totalItems === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg z-40 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 sm:gap-6 max-w-screen-xl mx-auto">
          {/* Cart Summary */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <div className="bg-primary/10 p-2.5 sm:p-3 rounded-full">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <Badge className="absolute -top-1.5 -right-1.5 h-5 w-5 sm:h-6 sm:w-6 rounded-full p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground">
                {totalItems > 99 ? '99+' : totalItems}
              </Badge>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-muted-foreground truncate mb-1">
                {totalItems} item{totalItems !== 1 ? 's' : ''} in cart
              </p>
              <p className="font-bold text-lg sm:text-xl truncate text-foreground">
                Rs. {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Buy Now Button */}
          <Button 
            onClick={() => setIsCartOpen(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-3 sm:py-4 h-12 sm:h-14 touch-manipulation whitespace-nowrap font-medium text-base sm:text-lg"
            size="lg"
          >
            <span className="hidden sm:inline">Buy Now</span>
            <span className="sm:hidden">Buy</span>
          </Button>
        </div>
      </div>

      {/* Cart Overlay */}
      <Cart 
        products={products}
        quantities={quantities}
        onQuantityChange={onQuantityChange}
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </>
  );
}