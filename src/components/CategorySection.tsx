import { useState } from 'react';
import { ProductCard, Product } from './ProductCard';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface CategorySectionProps {
  categoryName: string;
  products: Product[];
  quantities: Record<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
}

export function CategorySection({ categoryName, products, quantities, onQuantityChange }: CategorySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="mb-8 sm:mb-12">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="flex items-center justify-between w-full mb-4 sm:mb-6 p-2 sm:p-3 rounded-lg hover:bg-accent/50 transition-colors">
            <div className="flex items-center gap-2 sm:gap-3 text-left">
              <h2 className="text-xl sm:text-2xl font-bold">{categoryName}</h2>
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs sm:text-sm">
                {products.length}
              </span>
            </div>
            <ChevronDown 
              className={`h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground transition-transform duration-200 ${
                isOpen ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                quantity={quantities[product.id] || 0}
                onQuantityChange={onQuantityChange}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
}