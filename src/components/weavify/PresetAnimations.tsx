import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, MoveVertical, RotateCw, ZoomIn, Wind, Waves, Zap } from "lucide-react";
import { toast } from "sonner";

interface PresetAnimationsProps {
  onApply: (animation: any) => void;
}

export const PresetAnimations = ({ onApply }: PresetAnimationsProps) => {
  const presets = [
    {
      name: "Fade In",
      icon: Sparkles,
      animation: {
        property: "opacity",
        from: 0,
        to: 1,
        duration: 0.5,
        easing: "ease-in",
        trigger: "load" as const,
      }
    },
    {
      name: "Slide Up",
      icon: MoveVertical,
      animation: {
        property: "translateY",
        from: 50,
        to: 0,
        duration: 0.6,
        easing: "ease-out",
        trigger: "load" as const,
      }
    },
    {
      name: "Scale In",
      icon: ZoomIn,
      animation: {
        property: "scale",
        from: 0.8,
        to: 1,
        duration: 0.4,
        easing: "ease-out",
        trigger: "load" as const,
      }
    },
    {
      name: "Rotate In",
      icon: RotateCw,
      animation: {
        property: "rotate",
        from: -180,
        to: 0,
        duration: 0.8,
        easing: "ease-out",
        trigger: "load" as const,
      }
    },
    {
      name: "Bounce Hover",
      icon: Wind,
      animation: {
        property: "translateY",
        from: 0,
        to: -10,
        duration: 0.3,
        easing: "ease-in-out",
        trigger: "hover" as const,
      }
    },
    {
      name: "Glow Pulse",
      icon: Zap,
      animation: {
        property: "boxShadow",
        from: "0 0 10px rgba(139,92,246,0.5)",
        to: "0 0 30px rgba(139,92,246,1)",
        duration: 1,
        easing: "ease-in-out",
        trigger: "hover" as const,
      }
    },
    {
      name: "Wave Effect",
      icon: Waves,
      animation: {
        property: "translateX",
        from: -20,
        to: 20,
        duration: 2,
        easing: "ease-in-out",
        trigger: "scroll" as const,
      }
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-semibold text-gradient mb-3">Preset Animations</h4>
        {presets.map((preset) => (
          <Card
            key={preset.name}
            className="p-3 cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => {
              onApply(preset.animation);
              toast.success(`Applied ${preset.name} animation`);
            }}
          >
            <div className="flex items-center gap-2">
              <preset.icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-xs font-medium">{preset.name}</p>
                <p className="text-xs text-muted-foreground">
                  {preset.animation.trigger} • {preset.animation.duration}s
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
