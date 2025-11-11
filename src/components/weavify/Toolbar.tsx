import { 
  MousePointer2, Move, Type, Square, Circle, Image, 
  Layout, Code, Play, Download, Undo, Redo, 
  Monitor, Tablet, Smartphone, Settings, Layers,
  PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen,
  PanelBottomClose, PanelBottomOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tool, ViewMode } from "@/types/weavify";
import { cn } from "@/lib/utils";

interface ToolbarProps {
  activeTool: Tool;
  onToolChange: (tool: Tool) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onUndo: () => void;
  onRedo: () => void;
  onPreview: () => void;
  onExport: () => void;
  canUndo: boolean;
  canRedo: boolean;
  showLayers: boolean;
  showCode: boolean;
  showProperties: boolean;
  showComponents: boolean;
  onToggleLayers: () => void;
  onToggleCode: () => void;
  onToggleProperties: () => void;
  onToggleComponents: () => void;
  onOpenMarketplace: () => void;
}

export const Toolbar = ({
  activeTool,
  onToolChange,
  viewMode,
  onViewModeChange,
  onUndo,
  onRedo,
  onPreview,
  onExport,
  canUndo,
  canRedo,
  showLayers,
  showCode,
  showProperties,
  showComponents,
  onToggleLayers,
  onToggleCode,
  onToggleProperties,
  onToggleComponents,
  onOpenMarketplace,
}: ToolbarProps) => {
  const tools: { icon: any; value: Tool; label: string }[] = [
    { icon: MousePointer2, value: 'select', label: 'Select' },
    { icon: Move, value: 'drag', label: 'Drag' },
    { icon: Type, value: 'text', label: 'Text' },
    { icon: Square, value: 'section', label: 'Section' },
    { icon: Circle, value: 'button', label: 'Button' },
  ];

  const viewModes: { icon: any; value: ViewMode; label: string }[] = [
    { icon: Monitor, value: 'desktop', label: 'Desktop' },
    { icon: Tablet, value: 'tablet', label: 'Tablet' },
    { icon: Smartphone, value: 'mobile', label: 'Mobile' },
  ];

  return (
    <div className="h-16 glass-panel border-b flex items-center justify-between px-4 shadow-lg">
      {/* Left: Logo and Tools */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gradient">Weavify</span>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-1">
          {tools.map((tool) => (
            <Button
              key={tool.value}
              variant={activeTool === tool.value ? "default" : "ghost"}
              size="sm"
              onClick={() => onToolChange(tool.value)}
              className={cn(
                "h-9 w-9 p-0",
                activeTool === tool.value && "glow-primary"
              )}
              title={tool.label}
            >
              <tool.icon className="w-4 h-4" />
            </Button>
          ))}
        </div>

        <Separator orientation="vertical" className="h-8" />

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onUndo}
            disabled={!canUndo}
            className="h-9 w-9 p-0"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRedo}
            disabled={!canRedo}
            className="h-9 w-9 p-0"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center: View Modes */}
      <div className="flex items-center gap-1 glass-panel px-2 py-1">
        {viewModes.map((mode) => (
          <Button
            key={mode.value}
            variant={viewMode === mode.value ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(mode.value)}
            className={cn(
              "h-8 w-8 p-0",
              viewMode === mode.value && "glow-primary"
            )}
            title={mode.label}
          >
            <mode.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 mr-2">
          <Button
            variant={showComponents ? "default" : "ghost"}
            size="sm"
            onClick={onToggleComponents}
            className="h-9 w-9 p-0"
            title="Toggle Components Panel"
          >
            {showComponents ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
          </Button>
          <Button
            variant={showLayers ? "default" : "ghost"}
            size="sm"
            onClick={onToggleLayers}
            className="h-9 w-9 p-0"
            title="Toggle Layers Panel"
          >
            <Layers className="w-4 h-4" />
          </Button>
          <Button
            variant={showCode ? "default" : "ghost"}
            size="sm"
            onClick={onToggleCode}
            className="h-9 w-9 p-0"
            title="Toggle Code Panel"
          >
            {showCode ? <PanelBottomClose className="w-4 h-4" /> : <PanelBottomOpen className="w-4 h-4" />}
          </Button>
          <Button
            variant={showProperties ? "default" : "ghost"}
            size="sm"
            onClick={onToggleProperties}
            className="h-9 w-9 p-0"
            title="Toggle Properties Panel"
          >
            {showProperties ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
          </Button>
        </div>

        <Separator orientation="vertical" className="h-8" />

        <Button
          variant="outline"
          size="sm"
          onClick={onPreview}
          className="gap-2"
        >
          <Play className="w-4 h-4" />
          Preview
        </Button>
        <Button
          variant="gradient"
          size="sm"
          onClick={onExport}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>
    </div>
  );
};
