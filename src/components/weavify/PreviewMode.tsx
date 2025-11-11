import { useState } from "react";
import { WeavifyElement, ViewMode } from "@/types/weavify";
import { Button } from "@/components/ui/button";
import { X, Monitor, Tablet, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewModeProps {
  elements: WeavifyElement[];
  onClose: () => void;
}

export const PreviewMode = ({ elements, onClose }: PreviewModeProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');

  const viewportWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

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
        element.interactions?.some(i => i.trigger === 'hover') && "hover:scale-105 hover:shadow-lg"
      ),
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
    <div className="fixed inset-0 z-50 bg-background">
      {/* Header */}
      <div className="h-14 border-b border-border flex items-center justify-between px-4 glass-panel">
        <div className="flex items-center gap-2">
          <span className="font-semibold">Preview Mode</span>
          <span className="text-xs text-muted-foreground">Fully Interactive</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Device toggle */}
          <div className="flex gap-1 p-1 rounded-lg bg-muted/50">
            <Button
              variant={viewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('desktop')}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('tablet')}
            >
              <Tablet className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('mobile')}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="h-[calc(100vh-3.5rem)] overflow-auto bg-[hsl(var(--canvas-bg))] flex justify-center items-start p-8">
        <div
          className="bg-white shadow-2xl transition-all duration-300 relative min-h-[600px]"
          style={{ width: viewportWidths[viewMode] }}
        >
          {elements.map(element => (
            <div key={element.id}>{renderPreviewElement(element)}</div>
          ))}

          {elements.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <p>No elements to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
