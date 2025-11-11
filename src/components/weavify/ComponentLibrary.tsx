import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, Type, Square, Image, Rows, Grid3x3, Columns, Heading1, Video, Link2, List, Table, Menu, ArrowRight, PanelLeft, CreditCard, LayoutGrid, FileText, AlignLeft, CheckSquare, Circle, Code2, Quote, Music, Images, Sparkles, ChevronDown, SlidersHorizontal, ToggleLeft, MessageSquare, Bell, Tag, Loader, User, Minus, BarChart, MapPin, Calendar, Search as SearchIcon, ChevronRight, Paintbrush, Shapes, ShoppingCart } from "lucide-react";

interface ComponentLibraryProps {
  onDragStart: (type: string, name: string) => void;
}

const components = [
  // Layout & Structure
  { type: 'section', name: 'Section', icon: LayoutGrid, category: 'Layout' },
  { type: 'container', name: 'Container', icon: Box, category: 'Layout' },
  { type: 'flex', name: 'Flex Container', icon: Rows, category: 'Layout' },
  { type: 'grid', name: 'Grid Container', icon: Grid3x3, category: 'Layout' },
  { type: 'columns', name: 'Columns', icon: Columns, category: 'Layout' },
  { type: 'header', name: 'Header', icon: Heading1, category: 'Layout' },
  { type: 'footer', name: 'Footer', icon: Box, category: 'Layout' },
  { type: 'sidebar', name: 'Sidebar', icon: PanelLeft, category: 'Layout' },
  
  // Navigation
  { type: 'navbar', name: 'Navbar', icon: Menu, category: 'Navigation' },
  { type: 'menu', name: 'Menu', icon: Menu, category: 'Navigation' },
  { type: 'breadcrumb', name: 'Breadcrumb', icon: ArrowRight, category: 'Navigation' },
  
  // Content
  { type: 'text', name: 'Text', icon: Type, category: 'Content' },
  { type: 'heading', name: 'Heading', icon: Heading1, category: 'Content' },
  { type: 'paragraph', name: 'Paragraph', icon: AlignLeft, category: 'Content' },
  { type: 'link', name: 'Link', icon: Link2, category: 'Content' },
  { type: 'list', name: 'List', icon: List, category: 'Content' },
  { type: 'table', name: 'Table', icon: Table, category: 'Content' },
  { type: 'code', name: 'Code Block', icon: Code2, category: 'Content' },
  { type: 'quote', name: 'Quote', icon: Quote, category: 'Content' },
  
  // Media
  { type: 'image', name: 'Image', icon: Image, category: 'Media' },
  { type: 'video', name: 'Video', icon: Video, category: 'Media' },
  { type: 'audio', name: 'Audio Player', icon: Music, category: 'Media' },
  { type: 'icon', name: 'Icon', icon: Sparkles, category: 'Media' },
  { type: 'gallery', name: 'Gallery', icon: Images, category: 'Media' },
  { type: 'carousel', name: 'Carousel', icon: Image, category: 'Media' },
  
  // Forms
  { type: 'input', name: 'Input', icon: Type, category: 'Forms' },
  { type: 'textarea', name: 'Textarea', icon: AlignLeft, category: 'Forms' },
  { type: 'select', name: 'Select', icon: ChevronDown, category: 'Forms' },
  { type: 'checkbox', name: 'Checkbox', icon: CheckSquare, category: 'Forms' },
  { type: 'radio', name: 'Radio', icon: Circle, category: 'Forms' },
  { type: 'button', name: 'Button', icon: Square, category: 'Forms' },
  { type: 'form', name: 'Form', icon: FileText, category: 'Forms' },
  { type: 'slider', name: 'Slider', icon: SlidersHorizontal, category: 'Forms' },
  { type: 'toggle', name: 'Toggle', icon: ToggleLeft, category: 'Forms' },
  { type: 'loginform', name: 'Login Form', icon: User, category: 'Forms' },
  { type: 'signupform', name: 'Signup Form', icon: User, category: 'Forms' },
  { type: 'contactform', name: 'Contact Form', icon: FileText, category: 'Forms' },
  
  // Components
  { type: 'card', name: 'Card', icon: CreditCard, category: 'Components' },
  { type: 'modal', name: 'Modal', icon: Square, category: 'Components' },
  { type: 'accordion', name: 'Accordion', icon: ChevronDown, category: 'Components' },
  { type: 'tabs', name: 'Tabs', icon: Rows, category: 'Components' },
  { type: 'tooltip', name: 'Tooltip', icon: MessageSquare, category: 'Components' },
  { type: 'toast', name: 'Toast', icon: Bell, category: 'Components' },
  { type: 'badge', name: 'Badge', icon: Tag, category: 'Components' },
  { type: 'progress', name: 'Progress Bar', icon: Loader, category: 'Components' },
  { type: 'spinner', name: 'Spinner', icon: Loader, category: 'Components' },
  { type: 'avatar', name: 'Avatar', icon: User, category: 'Components' },
  { type: 'divider', name: 'Divider', icon: Minus, category: 'Components' },
  
  // E-commerce
  { type: 'productcard', name: 'Product Card', icon: ShoppingCart, category: 'E-commerce' },
  { type: 'pricetable', name: 'Pricing Table', icon: Table, category: 'E-commerce' },
  { type: 'testimonial', name: 'Testimonial', icon: Quote, category: 'E-commerce' },
  { type: 'countdown', name: 'Countdown Timer', icon: Calendar, category: 'E-commerce' },
  { type: 'chatwidget', name: 'Chat Widget', icon: MessageSquare, category: 'E-commerce' },
  { type: 'socialmedia', name: 'Social Media', icon: Link2, category: 'E-commerce' },
  { type: 'newsletter', name: 'Newsletter', icon: Bell, category: 'E-commerce' },
  
  // Advanced
  { type: 'chart', name: 'Chart', icon: BarChart, category: 'Advanced' },
  { type: 'map', name: 'Map', icon: MapPin, category: 'Advanced' },
  { type: 'calendar', name: 'Calendar', icon: Calendar, category: 'Advanced' },
  { type: 'datepicker', name: 'Date Picker', icon: Calendar, category: 'Advanced' },
  { type: 'search', name: 'Search', icon: SearchIcon, category: 'Advanced' },
  { type: 'pagination', name: 'Pagination', icon: ChevronRight, category: 'Advanced' },
  { type: 'iframe', name: 'iFrame', icon: Square, category: 'Advanced' },
  { type: 'embed', name: 'Embed', icon: Code2, category: 'Advanced' },
  { type: 'canvas', name: 'Canvas', icon: Paintbrush, category: 'Advanced' },
  { type: 'svg', name: 'SVG', icon: Shapes, category: 'Advanced' },
  { type: 'faq', name: 'FAQ Section', icon: MessageSquare, category: 'Advanced' },
  { type: 'stats', name: 'Stats Counter', icon: BarChart, category: 'Advanced' },
  { type: 'timeline', name: 'Timeline', icon: List, category: 'Advanced' },
  { type: 'pricing', name: 'Pricing Plans', icon: CreditCard, category: 'Advanced' },
  { type: 'team', name: 'Team Section', icon: User, category: 'Advanced' },
  { type: 'blogpost', name: 'Blog Post', icon: FileText, category: 'Advanced' },
  { type: 'portfolio', name: 'Portfolio Item', icon: Images, category: 'Advanced' },
];

export const ComponentLibrary = ({ onDragStart }: ComponentLibraryProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', ...Array.from(new Set(components.map(c => c.category)))];

  const filteredComponents = components.filter(c => {
    const matchesCategory = selectedCategory === 'All' || c.category === selectedCategory;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         c.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-64 glass-panel border-r h-full flex flex-col">
      <div className="p-4 border-b space-y-3">
        <h2 className="text-sm font-semibold text-gradient">Components</h2>
        <p className="text-xs text-muted-foreground">
          {components.length}+ components available
        </p>
        
        <Input
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-xs"
        />

        <ScrollArea className="h-20">
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className="h-6 text-xs px-2"
              >
                {cat}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 grid grid-cols-2 gap-2">
          {filteredComponents.map((component) => {
            const Icon = component.icon;
            return (
              <Card
                key={component.type}
                draggable
                onDragStart={() => onDragStart(component.type, component.name)}
                className="p-3 cursor-grab active:cursor-grabbing hover:border-primary hover:glow-primary transition-all flex flex-col items-center gap-2 text-center glass-panel"
              >
                <Icon className="w-6 h-6 text-primary" />
                <span className="text-xs font-medium leading-tight">{component.name}</span>
              </Card>
            );
          })}
        </div>
        {filteredComponents.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-muted-foreground">No components found</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
