import { useRef, useState, useEffect } from "react";
import { WeavifyElement, ViewMode } from "@/types/weavify";
import { cn } from "@/lib/utils";
import { CanvasElement } from "./CanvasElement";

interface CanvasProps {
  elements: WeavifyElement[];
  selectedId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<WeavifyElement>) => void;
  onDeleteElement: (id: string) => void;
  viewMode: ViewMode;
  onDrop: (x: number, y: number) => void;
}

export const Canvas = ({
  elements,
  selectedId,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
  viewMode,
  onDrop,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const viewportWidths = {
    desktop: 1440,
    tablet: 768,
    mobile: 375,
  };

  const canvasWidth = viewportWidths[viewMode];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    onDrop(x, y);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(0.1, Math.min(2, prev + delta)));
    }
  };

  return (
    <div 
      className="flex-1 overflow-auto bg-[hsl(var(--canvas-bg))] p-8 relative"
      onWheel={handleWheel}
    >
      {/* Grid background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--canvas-grid)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--canvas-grid)) 1px, transparent 1px)
          `,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
        }}
      />

      {/* Canvas */}
      <div className="relative flex justify-center">
        <div
          ref={canvasRef}
          className={cn(
            "relative bg-white shadow-2xl transition-all duration-300",
            "min-h-[600px]"
          )}
          style={{
            width: canvasWidth,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onSelectElement(null);
            }
          }}
        >
          {elements.map((element) => (
            <CanvasElement
              key={element.id}
              element={element}
              isSelected={selectedId === element.id}
              onSelect={() => onSelectElement(element.id)}
              onUpdate={(updates) => onUpdateElement(element.id, updates)}
              onDelete={() => onDeleteElement(element.id)}
            />
          ))}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p className="text-lg font-medium mb-2">Start Building</p>
                <p className="text-sm">Drag components from the library to begin</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="fixed bottom-4 right-4 glass-panel px-3 py-1.5 text-xs font-medium">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
};
