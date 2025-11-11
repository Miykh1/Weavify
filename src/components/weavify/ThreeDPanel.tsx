import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Box, Lightbulb, Sparkles, Palette } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";

interface ThreeDPanelProps {
  selectedElement: WeavifyElement | null;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const ThreeDPanel = ({ selectedElement, onUpdate }: ThreeDPanelProps) => {
  if (!selectedElement) {
    return (
      <div className="h-full flex items-center justify-center p-8 text-center text-muted-foreground">
        <div>
          <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Select an element to add 3D effects</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-3">
        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Box className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold">3D Transform</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-2 block">Rotate X ({selectedElement.styles.rotateX || 0}deg)</Label>
              <Slider
                value={[selectedElement.styles.rotateX || 0]}
                onValueChange={([v]) => onUpdate({ 
                  styles: { ...selectedElement.styles, rotateX: v } 
                })}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <Label className="text-xs mb-2 block">Rotate Y ({selectedElement.styles.rotateY || 0}deg)</Label>
              <Slider
                value={[selectedElement.styles.rotateY || 0]}
                onValueChange={([v]) => onUpdate({ 
                  styles: { ...selectedElement.styles, rotateY: v } 
                })}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <Label className="text-xs mb-2 block">Rotate Z ({selectedElement.styles.rotate || 0}deg)</Label>
              <Slider
                value={[selectedElement.styles.rotate || 0]}
                onValueChange={([v]) => onUpdate({ 
                  styles: { ...selectedElement.styles, rotate: v } 
                })}
                min={-180}
                max={180}
                step={1}
              />
            </div>

            <div>
              <Label className="text-xs mb-2 block">Scale ({selectedElement.styles.scale || 1}x)</Label>
              <Slider
                value={[selectedElement.styles.scale || 1]}
                onValueChange={([v]) => onUpdate({ 
                  styles: { ...selectedElement.styles, scale: v } 
                })}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>

            <div>
              <Label className="text-xs mb-2 block">Perspective</Label>
              <Input
                type="number"
                value={selectedElement.styles.perspective || 1000}
                onChange={(e) => onUpdate({ 
                  styles: { ...selectedElement.styles, perspective: Number(e.target.value) } 
                })}
                className="h-7 text-xs"
              />
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold">3D Effects</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Box Shadow</Label>
              <Input
                value={selectedElement.styles.boxShadow || ''}
                onChange={(e) => onUpdate({ 
                  styles: { ...selectedElement.styles, boxShadow: e.target.value } 
                })}
                placeholder="0px 10px 30px rgba(0,0,0,0.1)"
                className="h-7 text-xs"
              />
            </div>

            <div>
              <Label className="text-xs">Backdrop Filter</Label>
              <Select
                value={selectedElement.styles.backdropFilter?.includes('blur') ? 'blur' : 'none'}
                onValueChange={(v) => {
                  const value = v === 'blur' ? 'blur(10px)' : 'none';
                  onUpdate({ 
                    styles: { ...selectedElement.styles, backdropFilter: value } 
                  });
                }}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="blur">Blur</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-xs">Transform Origin</Label>
              <Select
                value={selectedElement.styles.transformOrigin || 'center'}
                onValueChange={(v) => onUpdate({ 
                  styles: { ...selectedElement.styles, transformOrigin: v } 
                })}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="center">Center</SelectItem>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="left">Left</SelectItem>
                  <SelectItem value="right">Right</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-3">
          <div className="flex items-center gap-2 mb-3">
            <Palette className="w-4 h-4 text-primary" />
            <h4 className="text-xs font-semibold">Material</h4>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label className="text-xs mb-2 block">Opacity ({Math.round((selectedElement.styles.opacity || 1) * 100)}%)</Label>
              <Slider
                value={[(selectedElement.styles.opacity || 1) * 100]}
                onValueChange={([v]) => onUpdate({ 
                  styles: { ...selectedElement.styles, opacity: v / 100 } 
                })}
                min={0}
                max={100}
                step={1}
              />
            </div>

            <div>
              <Label className="text-xs">Mix Blend Mode</Label>
              <Select
                value={selectedElement.styles.mixBlendMode || 'normal'}
                onValueChange={(v) => onUpdate({ 
                  styles: { ...selectedElement.styles, mixBlendMode: v } 
                })}
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="multiply">Multiply</SelectItem>
                  <SelectItem value="screen">Screen</SelectItem>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="darken">Darken</SelectItem>
                  <SelectItem value="lighten">Lighten</SelectItem>
                  <SelectItem value="color-dodge">Color Dodge</SelectItem>
                  <SelectItem value="color-burn">Color Burn</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-3 bg-primary/5">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-primary mt-0.5" />
            <div>
              <p className="text-xs font-semibold">Pro Tip</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Combine multiple 3D transforms to create stunning visual effects. Use perspective for depth perception.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </ScrollArea>
  );
};
