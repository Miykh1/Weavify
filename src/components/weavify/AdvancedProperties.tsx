import { WeavifyElement } from "@/types/weavify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AdvancedPropertiesProps {
  selectedElement: WeavifyElement;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const AdvancedProperties = ({ selectedElement, onUpdate }: AdvancedPropertiesProps) => {
  const updateStyle = (property: string, value: any) => {
    onUpdate({
      styles: {
        ...selectedElement.styles,
        [property]: value,
      },
    });
  };

  return (
    <Tabs defaultValue="layout" className="w-full">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="layout" className="text-xs">Layout</TabsTrigger>
        <TabsTrigger value="visual" className="text-xs">Visual</TabsTrigger>
        <TabsTrigger value="typography" className="text-xs">Type</TabsTrigger>
        <TabsTrigger value="effects" className="text-xs">FX</TabsTrigger>
      </TabsList>

      <ScrollArea className="h-[calc(100vh-300px)]">
        <TabsContent value="layout" className="space-y-4 p-1 mt-2">
          {/* Display & Position */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Display</h4>
            <Select value={selectedElement.styles.display || 'block'} onValueChange={(v) => updateStyle('display', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="block">Block</SelectItem>
                <SelectItem value="flex">Flex</SelectItem>
                <SelectItem value="grid">Grid</SelectItem>
                <SelectItem value="inline-block">Inline Block</SelectItem>
                <SelectItem value="inline-flex">Inline Flex</SelectItem>
                <SelectItem value="inline">Inline</SelectItem>
                <SelectItem value="none">None</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Position</h4>
            <Select value={selectedElement.styles.position || 'relative'} onValueChange={(v) => updateStyle('position', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static</SelectItem>
                <SelectItem value="relative">Relative</SelectItem>
                <SelectItem value="absolute">Absolute</SelectItem>
                <SelectItem value="fixed">Fixed</SelectItem>
                <SelectItem value="sticky">Sticky</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Flexbox */}
          {selectedElement.styles.display === 'flex' && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Flexbox</h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">Direction</Label>
                  <Select value={selectedElement.styles.flexDirection || 'row'} onValueChange={(v) => updateStyle('flexDirection', v)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="row">Row</SelectItem>
                      <SelectItem value="column">Column</SelectItem>
                      <SelectItem value="row-reverse">Row Rev</SelectItem>
                      <SelectItem value="column-reverse">Col Rev</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs">Wrap</Label>
                  <Select value={selectedElement.styles.flexWrap || 'nowrap'} onValueChange={(v) => updateStyle('flexWrap', v)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nowrap">No Wrap</SelectItem>
                      <SelectItem value="wrap">Wrap</SelectItem>
                      <SelectItem value="wrap-reverse">Wrap Rev</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="text-xs">Justify Content</Label>
                <Select value={selectedElement.styles.justifyContent || 'flex-start'} onValueChange={(v) => updateStyle('justifyContent', v)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="space-between">Space Between</SelectItem>
                    <SelectItem value="space-around">Space Around</SelectItem>
                    <SelectItem value="space-evenly">Space Evenly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Align Items</Label>
                <Select value={selectedElement.styles.alignItems || 'stretch'} onValueChange={(v) => updateStyle('alignItems', v)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="stretch">Stretch</SelectItem>
                    <SelectItem value="flex-start">Start</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="flex-end">End</SelectItem>
                    <SelectItem value="baseline">Baseline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Gap</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.styles.gap || 0]}
                    onValueChange={([value]) => updateStyle('gap', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-10">{selectedElement.styles.gap || 0}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Grid */}
          {selectedElement.styles.display === 'grid' && (
            <div className="space-y-2">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase">Grid</h4>
              <div>
                <Label className="text-xs">Template Columns</Label>
                <Input
                  value={selectedElement.styles.gridTemplateColumns || ''}
                  onChange={(e) => updateStyle('gridTemplateColumns', e.target.value)}
                  placeholder="repeat(3, 1fr)"
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Template Rows</Label>
                <Input
                  value={selectedElement.styles.gridTemplateRows || ''}
                  onChange={(e) => updateStyle('gridTemplateRows', e.target.value)}
                  placeholder="auto"
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Gap</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[selectedElement.styles.gap || 0]}
                    onValueChange={([value]) => updateStyle('gap', value)}
                    min={0}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-xs w-10">{selectedElement.styles.gap || 0}px</span>
                </div>
              </div>
            </div>
          )}

          {/* Overflow & Z-Index */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Overflow</h4>
            <Select value={selectedElement.styles.overflow || 'visible'} onValueChange={(v) => updateStyle('overflow', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visible">Visible</SelectItem>
                <SelectItem value="hidden">Hidden</SelectItem>
                <SelectItem value="scroll">Scroll</SelectItem>
                <SelectItem value="auto">Auto</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Z-Index</Label>
            <Input
              type="number"
              value={selectedElement.styles.zIndex || 0}
              onChange={(e) => updateStyle('zIndex', Number(e.target.value))}
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Cursor</Label>
            <Select value={selectedElement.styles.cursor || 'default'} onValueChange={(v) => updateStyle('cursor', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="pointer">Pointer</SelectItem>
                <SelectItem value="move">Move</SelectItem>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="wait">Wait</SelectItem>
                <SelectItem value="not-allowed">Not Allowed</SelectItem>
                <SelectItem value="grab">Grab</SelectItem>
                <SelectItem value="grabbing">Grabbing</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="visual" className="space-y-4 p-1 mt-2">
          {/* Transform */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Transform</h4>
            <div>
              <Label className="text-xs">Rotate</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.styles.rotate || 0]}
                  onValueChange={([value]) => updateStyle('rotate', value)}
                  min={0}
                  max={360}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-10">{selectedElement.styles.rotate || 0}°</span>
              </div>
            </div>
            <div>
              <Label className="text-xs">Scale</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[(selectedElement.styles.scale || 1) * 100]}
                  onValueChange={([value]) => updateStyle('scale', value / 100)}
                  min={0}
                  max={200}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-10">{((selectedElement.styles.scale || 1) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Translate X</Label>
                <Input
                  type="number"
                  value={selectedElement.styles.translateX || 0}
                  onChange={(e) => updateStyle('translateX', Number(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Translate Y</Label>
                <Input
                  type="number"
                  value={selectedElement.styles.translateY || 0}
                  onChange={(e) => updateStyle('translateY', Number(e.target.value))}
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Background</h4>
            <div>
              <Label className="text-xs">Image URL</Label>
              <Input
                value={selectedElement.styles.backgroundImage?.replace(/url\(['"]?|['"]?\)/g, '') || ''}
                onChange={(e) => updateStyle('backgroundImage', e.target.value ? `url('${e.target.value}')` : '')}
                placeholder="https://..."
                className="h-7 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Size</Label>
                <Select value={selectedElement.styles.backgroundSize || 'cover'} onValueChange={(v) => updateStyle('backgroundSize', v)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cover">Cover</SelectItem>
                    <SelectItem value="contain">Contain</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Position</Label>
                <Select value={selectedElement.styles.backgroundPosition || 'center'} onValueChange={(v) => updateStyle('backgroundPosition', v)}>
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
            <div>
              <Label className="text-xs">Repeat</Label>
              <Select value={selectedElement.styles.backgroundRepeat || 'no-repeat'} onValueChange={(v) => updateStyle('backgroundRepeat', v)}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-repeat">No Repeat</SelectItem>
                  <SelectItem value="repeat">Repeat</SelectItem>
                  <SelectItem value="repeat-x">Repeat X</SelectItem>
                  <SelectItem value="repeat-y">Repeat Y</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Border */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Border</h4>
            <div>
              <Label className="text-xs">Width</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.styles.borderWidth || 0]}
                  onValueChange={([value]) => updateStyle('borderWidth', value)}
                  min={0}
                  max={20}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs w-10">{selectedElement.styles.borderWidth || 0}px</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Style</Label>
                <Select value={selectedElement.styles.borderStyle || 'solid'} onValueChange={(v) => updateStyle('borderStyle', v)}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                    <SelectItem value="double">Double</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Color</Label>
                <Input
                  type="color"
                  value={selectedElement.styles.borderColor || '#000000'}
                  onChange={(e) => updateStyle('borderColor', e.target.value)}
                  className="h-7 w-full"
                />
              </div>
            </div>
          </div>

          {/* Blend Mode */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Blend Mode</h4>
            <Input
              value={selectedElement.styles.mixBlendMode || ''}
              onChange={(e) => updateStyle('mixBlendMode', e.target.value)}
              placeholder="multiply, screen, overlay..."
              className="h-7 text-xs"
            />
          </div>
        </TabsContent>

        <TabsContent value="typography" className="space-y-4 p-1 mt-2">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Font</h4>
            <div>
              <Label className="text-xs">Family</Label>
              <Input
                value={selectedElement.styles.fontFamily || ''}
                onChange={(e) => updateStyle('fontFamily', e.target.value)}
                placeholder="Inter, sans-serif"
                className="h-7 text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Weight</Label>
              <Select value={String(selectedElement.styles.fontWeight || 'normal')} onValueChange={(v) => updateStyle('fontWeight', v)}>
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">Thin (100)</SelectItem>
                  <SelectItem value="300">Light (300)</SelectItem>
                  <SelectItem value="400">Regular (400)</SelectItem>
                  <SelectItem value="500">Medium (500)</SelectItem>
                  <SelectItem value="600">Semibold (600)</SelectItem>
                  <SelectItem value="700">Bold (700)</SelectItem>
                  <SelectItem value="900">Black (900)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Spacing</h4>
            <div>
              <Label className="text-xs">Line Height</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.styles.lineHeight || 1.5]}
                  onValueChange={([value]) => updateStyle('lineHeight', value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs w-10">{(selectedElement.styles.lineHeight || 1.5).toFixed(1)}</span>
              </div>
            </div>
            <div>
              <Label className="text-xs">Letter Spacing</Label>
              <div className="flex items-center gap-2">
                <Slider
                  value={[selectedElement.styles.letterSpacing || 0]}
                  onValueChange={([value]) => updateStyle('letterSpacing', value)}
                  min={-2}
                  max={10}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-xs w-10">{(selectedElement.styles.letterSpacing || 0).toFixed(1)}px</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Alignment</h4>
            <Select value={selectedElement.styles.textAlign || 'left'} onValueChange={(v) => updateStyle('textAlign', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
                <SelectItem value="justify">Justify</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Decoration</h4>
            <Select value={selectedElement.styles.textDecoration || 'none'} onValueChange={(v) => updateStyle('textDecoration', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="underline">Underline</SelectItem>
                <SelectItem value="overline">Overline</SelectItem>
                <SelectItem value="line-through">Line Through</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Transform</h4>
            <Select value={selectedElement.styles.textTransform || 'none'} onValueChange={(v) => updateStyle('textTransform', v)}>
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="uppercase">Uppercase</SelectItem>
                <SelectItem value="lowercase">Lowercase</SelectItem>
                <SelectItem value="capitalize">Capitalize</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <TabsContent value="effects" className="space-y-4 p-1 mt-2">
          {/* Shadows */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Box Shadow</h4>
            <Input
              value={selectedElement.styles.boxShadow || ''}
              onChange={(e) => updateStyle('boxShadow', e.target.value)}
              placeholder="0 4px 6px rgba(0,0,0,0.1)"
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Text Shadow</h4>
            <Input
              value={selectedElement.styles.textShadow || ''}
              onChange={(e) => updateStyle('textShadow', e.target.value)}
              placeholder="2px 2px 4px rgba(0,0,0,0.5)"
              className="h-7 text-xs"
            />
          </div>

          {/* Filters */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Filter</h4>
            <Input
              value={selectedElement.styles.filter || ''}
              onChange={(e) => updateStyle('filter', e.target.value)}
              placeholder="blur(5px) brightness(1.2)"
              className="h-7 text-xs"
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Backdrop Filter</h4>
            <Input
              value={selectedElement.styles.backdropFilter || ''}
              onChange={(e) => updateStyle('backdropFilter', e.target.value)}
              placeholder="blur(10px)"
              className="h-7 text-xs"
            />
          </div>

          {/* Clip Path */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-muted-foreground uppercase">Clip Path</h4>
            <Input
              value={selectedElement.styles.clipPath || ''}
              onChange={(e) => updateStyle('clipPath', e.target.value)}
              placeholder="circle(50%)"
              className="h-7 text-xs"
            />
          </div>
        </TabsContent>
      </ScrollArea>
    </Tabs>
  );
};
