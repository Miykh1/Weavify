import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, Check } from "lucide-react";
import { toast } from "sonner";

interface ThemePanelProps {
  onApplyTheme: (theme: ThemeConfig) => void;
}

export interface ThemeConfig {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: number;
}

export const ThemePanel = ({ onApplyTheme }: ThemePanelProps) => {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const themes: ThemeConfig[] = [
    {
      name: 'Modern Blue',
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        background: '#ffffff',
        text: '#1f2937',
        accent: '#06b6d4',
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
      },
      borderRadius: 8,
    },
    {
      name: 'Dark Purple',
      colors: {
        primary: '#a855f7',
        secondary: '#ec4899',
        background: '#0f172a',
        text: '#f1f5f9',
        accent: '#f59e0b',
      },
      fonts: {
        heading: 'Poppins',
        body: 'Inter',
      },
      borderRadius: 12,
    },
    {
      name: 'Minimal Gray',
      colors: {
        primary: '#6b7280',
        secondary: '#9ca3af',
        background: '#f9fafb',
        text: '#111827',
        accent: '#374151',
      },
      fonts: {
        heading: 'SF Pro Display',
        body: 'SF Pro Text',
      },
      borderRadius: 4,
    },
    {
      name: 'Vibrant Gradient',
      colors: {
        primary: '#f43f5e',
        secondary: '#f97316',
        background: '#fef3c7',
        text: '#78350f',
        accent: '#eab308',
      },
      fonts: {
        heading: 'Montserrat',
        body: 'Open Sans',
      },
      borderRadius: 16,
    },
    {
      name: 'Ocean Blue',
      colors: {
        primary: '#0ea5e9',
        secondary: '#06b6d4',
        background: '#ecfeff',
        text: '#164e63',
        accent: '#14b8a6',
      },
      fonts: {
        heading: 'Raleway',
        body: 'Lato',
      },
      borderRadius: 10,
    },
    {
      name: 'Forest Green',
      colors: {
        primary: '#22c55e',
        secondary: '#84cc16',
        background: '#f0fdf4',
        text: '#14532d',
        accent: '#10b981',
      },
      fonts: {
        heading: 'Roboto',
        body: 'Roboto',
      },
      borderRadius: 6,
    },
    {
      name: 'Sunset Orange',
      colors: {
        primary: '#f97316',
        secondary: '#fb923c',
        background: '#fff7ed',
        text: '#7c2d12',
        accent: '#ea580c',
      },
      fonts: {
        heading: 'Playfair Display',
        body: 'Source Sans Pro',
      },
      borderRadius: 14,
    },
    {
      name: 'Royal Purple',
      colors: {
        primary: '#9333ea',
        secondary: '#a855f7',
        background: '#faf5ff',
        text: '#581c87',
        accent: '#c026d3',
      },
      fonts: {
        heading: 'Merriweather',
        body: 'PT Sans',
      },
      borderRadius: 12,
    },
  ];

  const handleApplyTheme = (theme: ThemeConfig) => {
    setSelectedTheme(theme.name);
    onApplyTheme(theme);
    toast.success(`Applied "${theme.name}" theme`);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="font-semibold">Theme Presets</h3>
      </div>

      <ScrollArea className="flex-1">
        <div className="grid grid-cols-2 gap-3">
          {themes.map((theme) => (
            <Card
              key={theme.name}
              className="p-3 cursor-pointer hover:shadow-lg transition-all relative"
              onClick={() => handleApplyTheme(theme)}
            >
              {selectedTheme === theme.name && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="w-3 h-3" />
                </div>
              )}
              
              <div className="space-y-2">
                <p className="text-sm font-semibold">{theme.name}</p>
                
                {/* Color palette preview */}
                <div className="flex gap-1">
                  {Object.values(theme.colors).map((color, idx) => (
                    <div
                      key={idx}
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Typography preview */}
                <div className="text-xs space-y-1">
                  <p style={{ fontFamily: theme.fonts.heading }} className="font-bold">
                    Heading Font
                  </p>
                  <p style={{ fontFamily: theme.fonts.body }}>Body Font</p>
                </div>

                {/* Border radius preview */}
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className="w-6 h-6 bg-gray-300"
                    style={{ borderRadius: theme.borderRadius }}
                  />
                  <span className="text-muted-foreground">
                    {theme.borderRadius}px radius
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <Button
        variant="outline"
        className="mt-4 w-full"
        onClick={() => {
          setSelectedTheme(null);
          toast.info("Theme cleared");
        }}
      >
        Clear Theme
      </Button>
    </div>
  );
};
