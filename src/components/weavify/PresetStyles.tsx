import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette } from "lucide-react";
import { toast } from "sonner";

interface PresetStylesProps {
  onApply: (styles: any) => void;
}

export const PresetStyles = ({ onApply }: PresetStylesProps) => {
  const presets = [
    {
      name: "Modern Card",
      styles: {
        backgroundColor: "hsl(var(--card))",
        borderRadius: 12,
        padding: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        border: "1px solid hsl(var(--border))",
      }
    },
    {
      name: "Glass Panel",
      styles: {
        backgroundColor: "rgba(255,255,255,0.1)",
        backdropFilter: "blur(10px)",
        borderRadius: 16,
        padding: 20,
        border: "1px solid rgba(255,255,255,0.2)",
      }
    },
    {
      name: "Primary Button",
      styles: {
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
        borderRadius: 8,
        padding: 12,
        fontWeight: "600",
        fontSize: 14,
        cursor: "pointer",
        transition: "all 0.3s ease",
      }
    },
    {
      name: "Gradient Hero",
      styles: {
        background: "linear-gradient(135deg, hsl(250 95% 65%), hsl(280 90% 60%))",
        color: "#ffffff",
        borderRadius: 0,
        padding: 60,
        fontSize: 48,
        fontWeight: "700",
        textAlign: "center",
      }
    },
    {
      name: "Minimalist Text",
      styles: {
        fontSize: 16,
        lineHeight: 1.6,
        color: "hsl(var(--foreground))",
        fontFamily: "Inter, sans-serif",
        padding: 0,
      }
    },
    {
      name: "Neumorphic",
      styles: {
        backgroundColor: "#e0e5ec",
        borderRadius: 20,
        padding: 20,
        boxShadow: "8px 8px 16px #bebebe, -8px -8px 16px #ffffff",
      }
    },
    {
      name: "Neon Glow",
      styles: {
        backgroundColor: "#000000",
        color: "#00ffff",
        borderRadius: 8,
        padding: 16,
        border: "2px solid #00ffff",
        boxShadow: "0 0 20px #00ffff, inset 0 0 20px #00ffff",
      }
    },
    {
      name: "Soft Shadow",
      styles: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
        border: "none",
      }
    },
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-2">
        <h4 className="text-xs font-semibold text-gradient mb-3">Preset Styles</h4>
        {presets.map((preset) => (
          <Card
            key={preset.name}
            className="p-3 cursor-pointer hover:bg-accent/10 transition-colors"
            onClick={() => {
              onApply(preset.styles);
              toast.success(`Applied ${preset.name} style`);
            }}
          >
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" />
              <p className="text-xs font-medium">{preset.name}</p>
            </div>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};
