import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Download, Star, TrendingUp, Package } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  rating: number;
  downloads: number;
  elements: WeavifyElement[];
}

interface TemplateMarketplaceProps {
  onImportTemplate: (elements: WeavifyElement[]) => void;
}

export const TemplateMarketplace = ({ onImportTemplate }: TemplateMarketplaceProps) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'landing' | 'ecommerce' | 'portfolio' | 'blog'>('all');

  const templates: Template[] = [
    {
      id: '1',
      name: 'Modern Landing Page',
      category: 'landing',
      description: 'Clean and modern landing page with hero section',
      rating: 4.8,
      downloads: 1250,
      elements: [],
    },
    {
      id: '2',
      name: 'E-commerce Store',
      category: 'ecommerce',
      description: 'Full-featured online store template',
      rating: 4.9,
      downloads: 980,
      elements: [],
    },
    {
      id: '3',
      name: 'Portfolio Showcase',
      category: 'portfolio',
      description: 'Creative portfolio for designers and developers',
      rating: 4.7,
      downloads: 1560,
      elements: [],
    },
    {
      id: '4',
      name: 'Blog & News',
      category: 'blog',
      description: 'Content-focused blog layout',
      rating: 4.6,
      downloads: 890,
      elements: [],
    },
    {
      id: '5',
      name: 'SaaS Platform',
      category: 'landing',
      description: 'Product landing page for SaaS',
      rating: 4.9,
      downloads: 2100,
      elements: [],
    },
    {
      id: '6',
      name: 'Restaurant Menu',
      category: 'ecommerce',
      description: 'Beautiful menu and ordering system',
      rating: 4.5,
      downloads: 670,
      elements: [],
    },
  ];

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                         t.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImport = (template: Template) => {
    onImportTemplate(template.elements);
    toast.success(`Imported "${template.name}" template`);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Template Marketplace</h3>
        
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates..."
            className="h-8 text-xs pl-7"
          />
        </div>
      </div>

      <Tabs value={activeCategory} onValueChange={(v: any) => setActiveCategory(v)} className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
          <TabsTrigger value="landing" className="text-xs">Landing</TabsTrigger>
          <TabsTrigger value="ecommerce" className="text-xs">E-commerce</TabsTrigger>
          <TabsTrigger value="portfolio" className="text-xs">Portfolio</TabsTrigger>
          <TabsTrigger value="blog" className="text-xs">Blog</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory} className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="grid grid-cols-1 gap-3">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="p-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-semibold">{template.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{template.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => handleImport(template)}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                      <span>{template.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{template.downloads.toLocaleString()}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <div className="p-4 border-t">
        <Card className="p-3 bg-primary/5">
          <div className="flex items-start gap-2">
            <Package className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold">Share Your Templates</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Publish your designs and earn from downloads
              </p>
              <Button size="sm" variant="outline" className="h-6 mt-2 text-xs">
                Become a Creator
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
