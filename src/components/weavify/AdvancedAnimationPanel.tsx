import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { WeavifyElement, Animation } from "@/types/weavify";
import { Plus, Trash2, Play } from "lucide-react";
import { toast } from "sonner";

interface AdvancedAnimationPanelProps {
  selectedElement: WeavifyElement | null;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const AdvancedAnimationPanel = ({ selectedElement, onUpdate }: AdvancedAnimationPanelProps) => {
  const [newAnimation, setNewAnimation] = useState<Partial<Animation>>({
    property: 'opacity',
    from: '0',
    to: '1',
    duration: 1000,
    easing: 'ease-in-out',
    trigger: 'load',
  });

  if (!selectedElement) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Select an element to add animations
      </div>
    );
  }

  const animations = selectedElement.animations || [];

  const addAnimation = () => {
    const animation: Animation = {
      id: `anim-${Date.now()}`,
      property: newAnimation.property as string,
      from: newAnimation.from,
      to: newAnimation.to,
      duration: newAnimation.duration as number,
      easing: newAnimation.easing as string,
      trigger: newAnimation.trigger as Animation['trigger'],
    };

    onUpdate({
      animations: [...animations, animation],
    });

    toast.success("Animation added");
  };

  const removeAnimation = (id: string) => {
    onUpdate({
      animations: animations.filter(a => a.id !== id),
    });
    toast.success("Animation removed");
  };

  const properties = [
    'opacity', 'transform', 'backgroundColor', 'color', 'width', 'height',
    'scale', 'rotate', 'translateX', 'translateY', 'borderRadius'
  ];

  const easings = [
    'linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out',
    'cubic-bezier(0.68, -0.55, 0.265, 1.55)', // bounce
    'cubic-bezier(0.175, 0.885, 0.32, 1.275)', // elastic
  ];

  const triggers: Animation['trigger'][] = ['load', 'hover', 'click', 'scroll'];

  return (
    <div className="space-y-6 p-4">
      <div>
        <h3 className="font-semibold mb-4">Active Animations</h3>
        {animations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No animations yet</p>
        ) : (
          <div className="space-y-2">
            {animations.map(anim => (
              <div key={anim.id} className="glass-panel p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{anim.property}</span>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => removeAnimation(anim.id)}>
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <div>From: {anim.from} → To: {anim.to}</div>
                  <div>Duration: {anim.duration}ms | Easing: {anim.easing}</div>
                  <div>Trigger: {anim.trigger}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4">
        <h3 className="font-semibold mb-4">Add New Animation</h3>
        <div className="space-y-4">
          <div>
            <Label>Property</Label>
            <Select
              value={newAnimation.property}
              onValueChange={(value) => setNewAnimation({ ...newAnimation, property: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {properties.map(prop => (
                  <SelectItem key={prop} value={prop}>{prop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label>From</Label>
              <Input
                value={newAnimation.from}
                onChange={(e) => setNewAnimation({ ...newAnimation, from: e.target.value })}
                placeholder="0"
              />
            </div>
            <div>
              <Label>To</Label>
              <Input
                value={newAnimation.to}
                onChange={(e) => setNewAnimation({ ...newAnimation, to: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div>
            <Label>Duration (ms)</Label>
            <Slider
              value={[newAnimation.duration as number]}
              onValueChange={([value]) => setNewAnimation({ ...newAnimation, duration: value })}
              min={100}
              max={5000}
              step={100}
            />
            <span className="text-xs text-muted-foreground">{newAnimation.duration}ms</span>
          </div>

          <div>
            <Label>Easing</Label>
            <Select
              value={newAnimation.easing}
              onValueChange={(value) => setNewAnimation({ ...newAnimation, easing: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {easings.map(easing => (
                  <SelectItem key={easing} value={easing}>
                    {easing.includes('cubic-bezier') ? easing.split('(')[0] : easing}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Trigger</Label>
            <Select
              value={newAnimation.trigger}
              onValueChange={(value) => setNewAnimation({ ...newAnimation, trigger: value as Animation['trigger'] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {triggers.map(trigger => (
                  <SelectItem key={trigger} value={trigger}>{trigger}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={addAnimation} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Animation
          </Button>
        </div>
      </div>
    </div>
  );
};
