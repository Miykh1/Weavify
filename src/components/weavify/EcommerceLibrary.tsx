import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ShoppingCart, CreditCard, Package, Star, DollarSign, 
  Truck, Gift, Tag, TrendingUp, Users 
} from "lucide-react";

interface EcommerceLibraryProps {
  onDragStart: (type: string, name: string) => void;
}

export const EcommerceLibrary = ({ onDragStart }: EcommerceLibraryProps) => {
  const components = [
    { type: 'productcard', name: 'Product Card', icon: Package, description: 'Display products with image, title, price' },
    { type: 'pricetable', name: 'Price Table', icon: DollarSign, description: 'Pricing plans and comparisons' },
    { type: 'cart', name: 'Shopping Cart', icon: ShoppingCart, description: 'Add to cart functionality' },
    { type: 'checkout', name: 'Checkout Form', icon: CreditCard, description: 'Payment and shipping details' },
    { type: 'testimonial', name: 'Testimonial', icon: Star, description: 'Customer reviews and ratings' },
    { type: 'shipping', name: 'Shipping Tracker', icon: Truck, description: 'Order tracking interface' },
    { type: 'coupon', name: 'Coupon Code', icon: Gift, description: 'Discount code input' },
    { type: 'deals', name: 'Deal Badge', icon: Tag, description: 'Sale and discount badges' },
    { type: 'trending', name: 'Trending Products', icon: TrendingUp, description: 'Popular items showcase' },
    { type: 'wishlist', name: 'Wishlist', icon: Star, description: 'Save favorite products' },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-semibold text-gradient mb-3">E-commerce Components</h4>
        {components.map((component) => (
          <Card
            key={component.type}
            className="p-3 cursor-move hover:bg-accent/10 transition-colors drag-handle"
            draggable
            onDragStart={() => onDragStart(component.type, component.name)}
          >
            <div className="flex items-start gap-2">
              <component.icon className="w-4 h-4 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium">{component.name}</p>
                <p className="text-xs text-muted-foreground">{component.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
