import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Monitor, Tablet, Smartphone } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";

interface ResponsiveEditorProps {
  selectedElement: WeavifyElement | null;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const ResponsiveEditor = ({ selectedElement, onUpdate }: ResponsiveEditorProps) => {
  const [activeBreakpoint, setActiveBreakpoint] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!selectedElement) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Monitor className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">Select an element to edit responsive styles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeBreakpoint} onValueChange={(v: any) => setActiveBreakpoint(v)}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="desktop" className="text-xs">
            <Monitor className="w-3 h-3 mr-1" />
            Desktop
          </TabsTrigger>
          <TabsTrigger value="tablet" className="text-xs">
            <Tablet className="w-3 h-3 mr-1" />
            Tablet
          </TabsTrigger>
          <TabsTrigger value="mobile" className="text-xs">
            <Smartphone className="w-3 h-3 mr-1" />
            Mobile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="desktop" className="space-y-3 mt-4">
          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Desktop (≥1024px)</h4>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="tablet" className="space-y-3 mt-4">
          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Tablet (768px - 1023px)</h4>
            <p className="text-xs text-muted-foreground">Tablet-specific styles coming soon</p>
          </Card>
        </TabsContent>

        <TabsContent value="mobile" className="space-y-3 mt-4">
          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Mobile (&lt;768px)</h4>
            <p className="text-xs text-muted-foreground">Mobile-specific styles coming soon</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
