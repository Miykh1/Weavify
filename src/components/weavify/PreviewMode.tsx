import { useState } from "react";
import { WeavifyElement, ViewMode } from "@/types/weavify";
import { Button } from "@/components/ui/button";
import { X, Monitor, Tablet, Smartphone, Lock, Unlock, ZoomIn, ZoomOut, RotateCcw, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PreviewModeProps {
  elements: WeavifyElement[];
  onClose: () => void;
}

export const PreviewMode = ({ elements, onClose }: PreviewModeProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [isLocked, setIsLocked] = useState(true);
  const [zoom, setZoom] = useState(100);
  const [showGrid, setShowGrid] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const viewportLabels = {
    desktop: "Desktop (1920px+)",
    tablet: "Tablet (768px)",
    mobile: "Mobile (375px)",
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));
  const handleResetZoom = () => setZoom(100);

  const renderPreviewElement = (element: WeavifyElement): JSX.Element => {
    const style = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      ...element.styles,
    } as unknown as React.CSSProperties;

    const handleClick = () => {
      // Handle navigation interactions
      const navInteraction = element.interactions?.find(i => i.action === 'navigate');
      if (navInteraction && navInteraction.value) {
        window.open(navInteraction.value, '_blank');
      }
    };

    const commonProps = {
      style,
      onClick: handleClick,
      className: cn(
        "transition-all duration-300",
        element.interactions?.some(i => i.trigger === 'hover') && "hover:scale-105 hover:shadow-lg",
        !isLocked && "hover:outline hover:outline-2 hover:outline-primary cursor-pointer"
      ),
      contentEditable: !isLocked,
      suppressContentEditableWarning: true,
    };

    switch (element.type) {
      case 'button':
        return (
          <button {...commonProps} className={cn(commonProps.className, "cursor-pointer")}>
            {element.content || 'Button'}
          </button>
        );
      
      case 'text':
      case 'paragraph':
        return <p {...commonProps}>{element.content || 'Text'}</p>;
      
      case 'heading':
        return <h1 {...commonProps}>{element.content || 'Heading'}</h1>;
      
      case 'image':
        return (
          <img
            {...commonProps}
            src={element.props?.src || 'https://placehold.co/600x400'}
            alt={element.props?.alt || 'Image'}
          />
        );
      
      case 'link':
        return (
          <a
            {...commonProps}
            href={element.props?.href || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(commonProps.className, "cursor-pointer underline")}
          >
            {element.content || 'Link'}
          </a>
        );
      
      case 'input':
        return (
          <input
            {...commonProps}
            type="text"
            placeholder={element.props?.placeholder || 'Enter text'}
            className={cn(commonProps.className, "px-3 py-2")}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            placeholder={element.props?.placeholder || 'Enter text'}
            className={cn(commonProps.className, "px-3 py-2")}
          />
        );
      
      case 'checkbox':
        return (
          <label {...commonProps} className={cn(commonProps.className, "flex items-center gap-2 cursor-pointer")}>
            <input type="checkbox" className="w-4 h-4" />
            <span>{element.content || 'Checkbox'}</span>
          </label>
        );
      
      case 'form':
        return (
          <form {...commonProps} onSubmit={(e) => e.preventDefault()}>
            {element.children?.map(child => (
              <div key={child.id}>{renderPreviewElement(child)}</div>
            ))}
          </form>
        );
      
      case 'section':
      case 'container':
      case 'card':
        return (
          <div {...commonProps}>
            {element.children?.map(child => (
              <div key={child.id}>{renderPreviewElement(child)}</div>
            ))}
          </div>
        );
      
      default:
        return (
          <div {...commonProps}>
            {element.content || element.children?.map(child => (
              <div key={child.id}>{renderPreviewElement(child)}</div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 z-50 bg-background",
      fullscreen && "bg-black"
    )}>
      {/* Enhanced Header */}
      <div className="h-14 border-b flex items-center justify-between px-4 bg-background/95 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="font-medium text-sm">Preview Mode</span>
            <span className="text-xs text-muted-foreground">
              {viewportLabels[viewMode]}
            </span>
          </div>
          <Separator orientation="vertical" className="h-6" />
          <Badge variant={isLocked ? "secondary" : "default"} className="text-xs">
            {isLocked ? (
              <><Lock className="w-3 h-3 mr-1" /> View Only</>
            ) : (
              <><Unlock className="w-3 h-3 mr-1" /> Interactive</>
            )}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Zoom Controls */}
          <div className="flex items-center gap-1 px-2 border rounded-md bg-muted/30">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-3 h-3" />
            </Button>
            <span className="text-xs font-medium min-w-[3rem] text-center">
              {zoom}%
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-3 h-3" />
            </Button>
            <Separator orientation="vertical" className="h-4 mx-1" />
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-2"
              onClick={handleResetZoom}
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Lock Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? (
              <><Lock className="w-4 h-4 mr-2" /> Locked</>
            ) : (
              <><Unlock className="w-4 h-4 mr-2" /> Interactive</>
            )}
          </Button>

          <Separator orientation="vertical" className="h-6" />
          
          {/* Device Viewport Toggle */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={viewMode === "desktop" ? "default" : "outline"}
              onClick={() => setViewMode("desktop")}
              title="Desktop View (1920px+)"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant={viewMode === "tablet" ? "default" : "outline"}
              onClick={() => setViewMode("tablet")}
              title="Tablet View (768px)"
            >
              <Tablet className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant={viewMode === "mobile" ? "default" : "outline"}
              onClick={() => setViewMode("mobile")}
              title="Mobile View (375px)"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-6" />

          {/* Fullscreen & Grid Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowGrid(!showGrid)}
            title="Toggle Grid"
          >
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="w-1.5 h-1.5 bg-current rounded-sm" />
              <div className="w-1.5 h-1.5 bg-current rounded-sm" />
              <div className="w-1.5 h-1.5 bg-current rounded-sm" />
              <div className="w-1.5 h-1.5 bg-current rounded-sm" />
            </div>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => setFullscreen(!fullscreen)}
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="ghost" onClick={onClose} title="Close Preview">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Enhanced Preview Content */}
      <div className={cn(
        "h-[calc(100vh-3.5rem)] overflow-auto p-8 transition-all",
        fullscreen ? "bg-black p-0" : "bg-muted/20",
        showGrid && "bg-grid-pattern"
      )}>
        <div 
          className="mx-auto bg-background shadow-2xl transition-all duration-300 border"
          style={{ 
            width: viewportWidths[viewMode],
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center'
          }}
        >
          {elements.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground gap-4">
              <Monitor className="w-16 h-16 opacity-20" />
              <div className="text-center">
                <p className="font-medium">No elements to preview</p>
                <p className="text-sm mt-1">Start building by dragging components to the canvas</p>
              </div>
            </div>
          ) : (
            <div className="relative min-h-screen">
              {elements.map(element => (
                <div key={element.id}>{renderPreviewElement(element)}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
