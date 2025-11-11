import { WeavifyElement, Animation, Interaction } from "@/types/weavify";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InteractivityPanelProps {
  selectedElement: WeavifyElement;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const InteractivityPanel = ({ selectedElement, onUpdate }: InteractivityPanelProps) => {
  const addAnimation = () => {
    const newAnimation: Animation = {
      id: `anim-${Date.now()}`,
      property: 'opacity',
      from: 0,
      to: 1,
      duration: 300,
      easing: 'ease-in-out',
      trigger: 'load',
    };

    onUpdate({
      animations: [...(selectedElement.animations || []), newAnimation],
    });
  };

  const updateAnimation = (index: number, updates: Partial<Animation>) => {
    const animations = [...(selectedElement.animations || [])];
    animations[index] = { ...animations[index], ...updates };
    onUpdate({ animations });
  };

  const removeAnimation = (index: number) => {
    const animations = selectedElement.animations?.filter((_, i) => i !== index) || [];
    onUpdate({ animations });
  };

  const addInteraction = () => {
    const newInteraction: Interaction = {
      id: `int-${Date.now()}`,
      trigger: 'click',
      action: 'navigate',
      target: '',
    };

    onUpdate({
      interactions: [...(selectedElement.interactions || []), newInteraction],
    });
  };

  const updateInteraction = (index: number, updates: Partial<Interaction>) => {
    const interactions = [...(selectedElement.interactions || [])];
    interactions[index] = { ...interactions[index], ...updates };
    onUpdate({ interactions });
  };

  const removeInteraction = (index: number) => {
    const interactions = selectedElement.interactions?.filter((_, i) => i !== index) || [];
    onUpdate({ interactions });
  };

  const updateTransition = (value: string) => {
    onUpdate({
      styles: {
        ...selectedElement.styles,
        transition: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Transitions */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase">Transitions</h3>
        <div>
          <Label className="text-xs">CSS Transition</Label>
          <Input
            type="text"
            value={selectedElement.styles.transition || ''}
            onChange={(e) => updateTransition(e.target.value)}
            placeholder="all 0.3s ease-in-out"
            className="h-8 text-xs"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTransition('all 0.3s ease-in-out')}
            className="text-xs"
          >
            Smooth
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateTransition('all 0.5s cubic-bezier(0.4, 0, 0.2, 1)')}
            className="text-xs"
          >
            Bounce
          </Button>
        </div>
      </div>

      {/* Animations */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">Animations</h3>
          <Button size="sm" onClick={addAnimation} className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        
        {selectedElement.animations?.map((anim, index) => (
          <Card key={anim.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Animation {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAnimation(index)}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-xs">Trigger</Label>
                <Select value={anim.trigger} onValueChange={(v: any) => updateAnimation(index, { trigger: v })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="load">On Load</SelectItem>
                    <SelectItem value="hover">On Hover</SelectItem>
                    <SelectItem value="click">On Click</SelectItem>
                    <SelectItem value="scroll">On Scroll</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Property</Label>
                <Select value={anim.property} onValueChange={(v) => updateAnimation(index, { property: v })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="opacity">Opacity</SelectItem>
                    <SelectItem value="transform">Transform</SelectItem>
                    <SelectItem value="backgroundColor">Background</SelectItem>
                    <SelectItem value="scale">Scale</SelectItem>
                    <SelectItem value="rotate">Rotate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">From</Label>
                  <Input
                    type="text"
                    value={anim.from}
                    onChange={(e) => updateAnimation(index, { from: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">To</Label>
                  <Input
                    type="text"
                    value={anim.to}
                    onChange={(e) => updateAnimation(index, { to: e.target.value })}
                    className="h-7 text-xs"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Duration (ms)</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[anim.duration]}
                    onValueChange={([value]) => updateAnimation(index, { duration: value })}
                    min={100}
                    max={3000}
                    step={100}
                    className="flex-1"
                  />
                  <span className="text-xs w-12">{anim.duration}ms</span>
                </div>
              </div>

              <div>
                <Label className="text-xs">Easing</Label>
                <Select value={anim.easing} onValueChange={(v) => updateAnimation(index, { easing: v })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ease">Ease</SelectItem>
                    <SelectItem value="ease-in">Ease In</SelectItem>
                    <SelectItem value="ease-out">Ease Out</SelectItem>
                    <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                    <SelectItem value="linear">Linear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Interactions */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase">Interactions</h3>
          <Button size="sm" onClick={addInteraction} className="h-7 text-xs">
            <Plus className="w-3 h-3 mr-1" />
            Add
          </Button>
        </div>
        
        {selectedElement.interactions?.map((interaction, index) => (
          <Card key={interaction.id} className="p-3 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold">Interaction {index + 1}</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeInteraction(index)}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-xs">Trigger</Label>
                <Select value={interaction.trigger} onValueChange={(v: any) => updateInteraction(index, { trigger: v })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="click">Click</SelectItem>
                    <SelectItem value="hover">Hover</SelectItem>
                    <SelectItem value="scroll">Scroll</SelectItem>
                    <SelectItem value="input">Input</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Action</Label>
                <Select value={interaction.action} onValueChange={(v: any) => updateInteraction(index, { action: v })}>
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="navigate">Navigate</SelectItem>
                    <SelectItem value="toggle">Toggle</SelectItem>
                    <SelectItem value="animate">Animate</SelectItem>
                    <SelectItem value="api">API Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Target/Value</Label>
                <Input
                  type="text"
                  value={interaction.target || ''}
                  onChange={(e) => updateInteraction(index, { target: e.target.value })}
                  placeholder="/page or #element-id"
                  className="h-7 text-xs"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
