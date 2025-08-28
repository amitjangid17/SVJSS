import { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Minus, Plus, CheckCircle } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: string;
  piecesPerBox: number;
}

interface ProductCardProps {
  product: Product;
  onQuantityChange: (productId: string, quantity: number) => void;
  quantity: number;
}

export function ProductCard({ product, onQuantityChange, quantity }: ProductCardProps) {
  const handleIncrement = () => {
    onQuantityChange(product.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      onQuantityChange(product.id, quantity - 1);
    }
  };



  const isSelected = quantity > 0;

  return (
    <Card className={`overflow-hidden transition-all duration-300 ${
      isSelected 
        ? 'ring-2 ring-primary ring-offset-2 shadow-lg bg-primary/5 border-primary/20' 
        : 'hover:shadow-lg'
    }`}>
      <div className="aspect-square overflow-hidden relative">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {isSelected && (
          <div className="absolute top-2 left-2">
            <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-lg">
              <CheckCircle className="h-4 w-4" />
            </div>
          </div>
        )}
      </div>
      <CardContent className="p-3 sm:p-4">
        <h3 className="font-medium text-base sm:text-lg leading-tight mb-2">{product.name}</h3>
        <p className="text-muted-foreground text-xs sm:text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-xs sm:text-sm text-blue-600 mb-2 font-medium">No of pcs. in a box: {product.piecesPerBox}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg sm:text-xl font-semibold">Rs. {product.price}</span>
          <div className={`flex items-center gap-1 sm:gap-2 ${
            isSelected ? 'p-2 bg-primary/10 rounded-lg' : ''
          }`}>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecrement}
              disabled={quantity === 0}
              className={`h-9 w-9 p-0 touch-manipulation ${
                isSelected ? 'border-primary/30 hover:border-primary/50' : ''
              }`}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className={`w-8 text-center font-medium text-sm sm:text-base ${
              isSelected ? 'text-primary font-bold' : ''
            }`}>
              {quantity}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleIncrement}
              className={`h-9 w-9 p-0 touch-manipulation ${
                isSelected ? 'border-primary/30 hover:border-primary/50' : ''
              }`}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}