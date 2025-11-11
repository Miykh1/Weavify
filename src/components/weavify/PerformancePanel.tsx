import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Zap, Image, Code, Database, TrendingUp } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";

interface PerformancePanelProps {
  elements: WeavifyElement[];
}

export const PerformancePanel = ({ elements }: PerformancePanelProps) => {
  const calculatePerformanceScore = () => {
    let score = 100;
    
    // Deduct for too many elements
    if (elements.length > 50) score -= 10;
    if (elements.length > 100) score -= 20;
    
    // Deduct for complex styles
    const complexStyles = elements.filter(el => 
      Object.keys(el.styles).length > 10
    ).length;
    score -= complexStyles * 2;
    
    // Deduct for animations
    const animatedElements = elements.filter(el => 
      el.animations && el.animations.length > 0
    ).length;
    score -= animatedElements;
    
    return Math.max(0, Math.min(100, score));
  };

  const score = calculatePerformanceScore();
  const imageCount = elements.filter(el => el.type === 'image').length;
  const totalElements = elements.length;
  const animatedElements = elements.filter(el => el.animations && el.animations.length > 0).length;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Performance</h3>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold">Overall Score</h4>
              <span className={`text-lg font-bold ${
                score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'
              }`}>
                {score}
              </span>
            </div>
            <Progress value={score} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              {score >= 80 ? 'Excellent performance!' : 
               score >= 50 ? 'Good, but can be improved' : 
               'Needs optimization'}
            </p>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Code className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold">DOM Complexity</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Elements</span>
                <span className="font-semibold">{totalElements}</span>
              </div>
              <Progress value={Math.min(100, (totalElements / 100) * 100)} className="h-1" />
              <p className="text-muted-foreground">
                {totalElements < 50 ? 'Optimal' : 
                 totalElements < 100 ? 'Moderate' : 
                 'Consider reducing elements'}
              </p>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Image className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold">Media Optimization</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Images</span>
                <span className="font-semibold">{imageCount}</span>
              </div>
              <p className="text-muted-foreground">
                {imageCount === 0 ? 'No images' : 
                 imageCount < 10 ? 'Good usage' : 
                 'Consider lazy loading'}
              </p>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold">Animations</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Animated Elements</span>
                <span className="font-semibold">{animatedElements}</span>
              </div>
              <p className="text-muted-foreground">
                {animatedElements === 0 ? 'No animations' : 
                 animatedElements < 5 ? 'Well balanced' : 
                 'May impact performance'}
              </p>
            </div>
          </Card>

          <Card className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h4 className="text-xs font-semibold">Optimization Tips</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
              <li>Lazy load images and videos</li>
              <li>Minimize CSS and JavaScript</li>
              <li>Use CSS transforms for animations</li>
              <li>Reduce DOM depth and complexity</li>
              <li>Optimize asset sizes</li>
              <li>Enable compression (gzip/brotli)</li>
            </ul>
          </Card>

          <Card className="p-3 bg-primary/5">
            <h4 className="text-xs font-semibold mb-2">Best Practices</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>✓ Use semantic HTML elements</p>
              <p>✓ Implement proper caching strategies</p>
              <p>✓ Optimize critical rendering path</p>
              <p>✓ Code split large bundles</p>
              <p>✓ Use CDN for static assets</p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
