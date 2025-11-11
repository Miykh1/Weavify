import { WeavifyElement } from "@/types/weavify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Sparkles, Sliders, Smartphone, Wand2 } from "lucide-react";
import { AdvancedProperties } from "./AdvancedProperties";
import { InteractivityPanel } from "./InteractivityPanel";
import { ResponsiveEditor } from "./ResponsiveEditor";
import { PresetStyles } from "./PresetStyles";
import { PresetAnimations } from "./PresetAnimations";

interface PropertiesPanelProps {
  selectedElement: WeavifyElement | null;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const PropertiesPanel = ({ selectedElement, onUpdate }: PropertiesPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="w-80 glass-panel border-l h-full flex items-center justify-center">
        <div className="text-center text-muted-foreground px-6">
          <Settings className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  const updateStyle = (property: string, value: any) => {
    onUpdate({
      styles: {
        ...selectedElement.styles,
        [property]: value,
      },
    });
  };

  return (
    <div className="w-80 glass-panel border-l h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold text-gradient">{selectedElement.name}</h2>
        <p className="text-xs text-muted-foreground mt-1 capitalize">
          {selectedElement.type} element
        </p>
      </div>

      <Tabs defaultValue="style" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-6 m-4 gap-1">
          <TabsTrigger value="style" className="text-xs px-1">
            <Palette className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-xs px-1">
            <Sliders className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="responsive" className="text-xs px-1">
            <Smartphone className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="animation" className="text-xs px-1">
            <Sparkles className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="interactions" className="text-xs px-1">
            <Settings className="w-3 h-3" />
          </TabsTrigger>
          <TabsTrigger value="presets" className="text-xs px-1">
            Presets
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="style" className="p-4 space-y-4 m-0">
            {/* Position & Size */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Position & Size
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input
                    type="number"
                    value={selectedElement.x}
                    onChange={(e) => onUpdate({ x: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input
                    type="number"
                    value={selectedElement.y}
                    onChange={(e) => onUpdate({ y: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Width</Label>
                  <Input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) => onUpdate({ width: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Height</Label>
                  <Input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) => onUpdate({ height: Number(e.target.value) })}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Colors
              </h3>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Background</Label>
                  <Input
                    type="color"
                    value={selectedElement.styles.backgroundColor || '#ffffff'}
                    onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                    className="h-8 w-full"
                  />
                </div>
                <div>
                  <Label className="text-xs">Text Color</Label>
                  <Input
                    type="color"
                    value={selectedElement.styles.color || '#000000'}
                    onChange={(e) => updateStyle('color', e.target.value)}
                    className="h-8 w-full"
                  />
                </div>
              </div>
            </div>

            {/* Typography */}
            {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
              <div className="space-y-3">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                  Typography
                </h3>
                <div>
                  <Label className="text-xs">Font Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[selectedElement.styles.fontSize || 16]}
                      onValueChange={([value]) => updateStyle('fontSize', value)}
                      min={8}
                      max={72}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-xs w-8">{selectedElement.styles.fontSize || 16}px</span>
                  </div>
                </div>
              </div>
            )}

            {/* Spacing */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Spacing
              </h3>
              <div>
                <Label className="text-xs">Padding</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.styles.padding || 0]}
                    onValueChange={([value]) => updateStyle('padding', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{selectedElement.styles.padding || 0}px</span>
                </div>
              </div>
              <div>
                <Label className="text-xs">Border Radius</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.styles.borderRadius || 0]}
                    onValueChange={([value]) => updateStyle('borderRadius', value)}
                    min={0}
                    max={50}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{selectedElement.styles.borderRadius || 0}px</span>
                </div>
              </div>
            </div>

            {/* Effects */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase">
                Effects
              </h3>
              <div>
                <Label className="text-xs">Opacity</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[(selectedElement.styles.opacity || 1) * 100]}
                    onValueChange={([value]) => updateStyle('opacity', value / 100)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-8">{Math.round((selectedElement.styles.opacity || 1) * 100)}%</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="p-4 m-0">
            <AdvancedProperties selectedElement={selectedElement} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="responsive" className="p-4 m-0">
            <ResponsiveEditor selectedElement={selectedElement} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="animation" className="p-4 m-0">
            <div className="text-center text-muted-foreground py-8">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Advanced CSS animations coming soon</p>
              <p className="text-xs mt-2">Use the Interact tab for now</p>
            </div>
          </TabsContent>

          <TabsContent value="interactions" className="p-4 m-0">
            <InteractivityPanel selectedElement={selectedElement} onUpdate={onUpdate} />
          </TabsContent>

          <TabsContent value="presets" className="p-4 m-0 space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Preset Styles
              </h4>
              <PresetStyles
                onApply={(styles) => {
                  onUpdate({ styles: { ...selectedElement.styles, ...styles } });
                }}
              />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase mb-2">
                Preset Animations
              </h4>
              <PresetAnimations
                onApply={(animation) => {
                  const newAnimations = [...(selectedElement.animations || []), {
                    id: `anim-${Date.now()}`,
                    ...animation
                  }];
                  onUpdate({ animations: newAnimations });
                }}
              />
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
