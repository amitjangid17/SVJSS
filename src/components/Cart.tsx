import { useState } from 'react';
import { Product } from './ProductCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { ShoppingCart, MessageCircle, Trash2, Shield, AlertTriangle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from './ui/sheet';

interface CartProps {
  products: Product[];
  quantities: Record<string, number>;
  onQuantityChange: (productId: string, quantity: number) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Cart({ products, quantities, onQuantityChange, isOpen = false, onOpenChange }: CartProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  
  // Use external state if provided, otherwise use internal state
  const cartIsOpen = onOpenChange ? isOpen : internalIsOpen;
  const setCartIsOpen = onOpenChange || setInternalIsOpen;

  const cartItems = products.filter(product => quantities[product.id] > 0);
  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = cartItems.reduce((sum, product) => {
    return sum + (product.price * quantities[product.id]);
  }, 0);

  const generateWhatsAppMessage = () => {
    if (cartItems.length === 0) return '';
    
    let message = '🎆 *Firework Order Request* 🎆\\n\\n';
    message += '*Order Details:*\\n';
    
    cartItems.forEach((product) => {
      const quantity = quantities[product.id];
      const itemTotal = product.price * quantity;
      message += `• ${product.name} × ${quantity} = Rs. ${itemTotal.toFixed(2)}\\n`;
    });
    
    message += `\\n*Total Amount: Rs. ${totalPrice.toFixed(2)}*\\n`;
    message += `*Total Items: ${totalItems}*\\n\\n`;
    message += 'Please confirm this order and provide delivery details. Thank you!';
    
    return encodeURIComponent(message);
  };

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage();
    const phoneNumber = '+1234567890'; // Replace with actual business phone number
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const removeItem = (productId: string) => {
    onQuantityChange(productId, 0);
  };

  return (
    <Sheet open={cartIsOpen} onOpenChange={setCartIsOpen}>
      <SheetContent className="w-full sm:max-w-lg p-0">
        <div className="p-4 sm:p-6 h-full flex flex-col">
          <SheetHeader className="mb-4">
            <SheetTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <ShoppingCart className="h-5 w-5" />
              Your Cart ({totalItems} items)
            </SheetTitle>
            <SheetDescription className="text-sm">
              Review your selected fireworks and proceed to checkout via WhatsApp
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex flex-col flex-1 min-h-0">
            {cartItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Your cart is empty</p>
                  <Button variant="outline" onClick={() => setCartIsOpen(false)} className="touch-manipulation">
                    Continue Shopping
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Safety and Quality Notices */}
                <div className="space-y-3 mb-4">
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600 shrink-0" />
                    <AlertDescription className="text-orange-800 text-xs sm:text-sm">
                      <strong>Safety First:</strong> All fireworks should be used by adults only and in accordance with local laws. 
                      Keep safety distance, have water nearby, and never relight a "dud" firework.
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="border-green-200 bg-green-50">
                    <Shield className="h-4 w-4 text-green-600 shrink-0" />
                    <AlertDescription className="text-green-800 text-xs sm:text-sm">
                      <strong>Quality Guaranteed:</strong> All our fireworks are professionally tested and meet safety standards. 
                      We offer a 100% satisfaction guarantee on all products.
                    </AlertDescription>
                  </Alert>
                </div>

                <ScrollArea className="flex-1 -mx-4 px-4 sm:-mx-6 sm:px-6">
                  <div className="space-y-3 pb-4">
                    {cartItems.map((product) => {
                      const quantity = quantities[product.id];
                      const itemTotal = product.price * quantity;
                      
                      return (
                        <Card key={product.id}>
                          <CardContent className="p-3 sm:p-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm sm:text-base truncate">{product.name}</h4>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Rs. {product.price} × {quantity}
                                </p>
                                <p className="font-medium text-sm sm:text-base">Rs. {itemTotal.toFixed(2)}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(product.id)}
                                className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 touch-manipulation flex-shrink-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </ScrollArea>
                
                <div className="border-t pt-4 mt-4 bg-background">
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm sm:text-base">
                      <span>Total Items:</span>
                      <span className="font-medium">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-base sm:text-lg font-bold">
                      <span>Total Amount:</span>
                      <span>Rs. {totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleWhatsAppOrder}
                    className="w-full bg-green-600 hover:bg-green-700 text-white h-11 sm:h-12 touch-manipulation"
                    size="lg"
                  >
                    <MessageCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Order via WhatsApp
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    You'll be redirected to WhatsApp to complete your order
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}