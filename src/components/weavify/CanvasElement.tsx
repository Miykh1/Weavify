import { useRef, useState, useEffect } from "react";
import { WeavifyElement } from "@/types/weavify";
import { cn } from "@/lib/utils";
import { Trash2, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasElementProps {
  element: WeavifyElement;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
  onDelete: () => void;
}

export const CanvasElement = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: CanvasElementProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.stopPropagation();
    
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.x,
      y: e.clientY - element.y,
    });
    onSelect();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    onUpdate({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Convert element styles to CSS properties safely
  const getElementStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
    };

    const styles = element.styles;
    const cssStyle: any = { ...baseStyle };

    // Simple direct mappings
    if (styles.backgroundColor) cssStyle.backgroundColor = styles.backgroundColor;
    if (styles.color) cssStyle.color = styles.color;
    if (styles.fontSize) cssStyle.fontSize = `${styles.fontSize}px`;
    if (styles.fontWeight) cssStyle.fontWeight = styles.fontWeight;
    if (styles.fontFamily) cssStyle.fontFamily = styles.fontFamily;
    if (styles.lineHeight) cssStyle.lineHeight = styles.lineHeight;
    if (styles.letterSpacing) cssStyle.letterSpacing = `${styles.letterSpacing}px`;
    if (styles.textAlign) cssStyle.textAlign = styles.textAlign;
    if (styles.textDecoration) cssStyle.textDecoration = styles.textDecoration;
    if (styles.textTransform) cssStyle.textTransform = styles.textTransform;
    if (styles.padding) cssStyle.padding = `${styles.padding}px`;
    if (styles.paddingTop) cssStyle.paddingTop = `${styles.paddingTop}px`;
    if (styles.paddingRight) cssStyle.paddingRight = `${styles.paddingRight}px`;
    if (styles.paddingBottom) cssStyle.paddingBottom = `${styles.paddingBottom}px`;
    if (styles.paddingLeft) cssStyle.paddingLeft = `${styles.paddingLeft}px`;
    if (styles.margin) cssStyle.margin = `${styles.margin}px`;
    if (styles.marginTop) cssStyle.marginTop = `${styles.marginTop}px`;
    if (styles.marginRight) cssStyle.marginRight = `${styles.marginRight}px`;
    if (styles.marginBottom) cssStyle.marginBottom = `${styles.marginBottom}px`;
    if (styles.marginLeft) cssStyle.marginLeft = `${styles.marginLeft}px`;
    if (styles.borderRadius) cssStyle.borderRadius = `${styles.borderRadius}px`;
    if (styles.border) cssStyle.border = styles.border;
    if (styles.borderWidth) cssStyle.borderWidth = `${styles.borderWidth}px`;
    if (styles.borderStyle) cssStyle.borderStyle = styles.borderStyle;
    if (styles.borderColor) cssStyle.borderColor = styles.borderColor;
    if (styles.display) cssStyle.display = styles.display;
    if (styles.flexDirection) cssStyle.flexDirection = styles.flexDirection;
    if (styles.justifyContent) cssStyle.justifyContent = styles.justifyContent;
    if (styles.alignItems) cssStyle.alignItems = styles.alignItems;
    if (styles.gap) cssStyle.gap = `${styles.gap}px`;
    if (styles.opacity !== undefined) cssStyle.opacity = styles.opacity;
    if (styles.boxShadow) cssStyle.boxShadow = styles.boxShadow;
    if (styles.textShadow) cssStyle.textShadow = styles.textShadow;
    if (styles.backgroundImage) cssStyle.backgroundImage = styles.backgroundImage;
    if (styles.backgroundSize) cssStyle.backgroundSize = styles.backgroundSize;
    if (styles.backgroundPosition) cssStyle.backgroundPosition = styles.backgroundPosition;
    if (styles.backgroundRepeat) cssStyle.backgroundRepeat = styles.backgroundRepeat;
    if (styles.zIndex) cssStyle.zIndex = styles.zIndex;
    if (styles.position) cssStyle.position = styles.position;
    if (styles.filter) cssStyle.filter = styles.filter;
    if (styles.backdropFilter) cssStyle.backdropFilter = styles.backdropFilter;
    if (styles.transition) cssStyle.transition = styles.transition;
    if (styles.overflow) cssStyle.overflow = styles.overflow;
    if (styles.cursor) cssStyle.cursor = styles.cursor;

    // Handle transform properties
    const transforms: string[] = [];
    if (styles.rotate) transforms.push(`rotate(${styles.rotate}deg)`);
    if (styles.scale) transforms.push(`scale(${styles.scale})`);
    if (styles.translateX) transforms.push(`translateX(${styles.translateX}px)`);
    if (styles.translateY) transforms.push(`translateY(${styles.translateY}px)`);
    if (transforms.length > 0) cssStyle.transform = transforms.join(' ');

    return cssStyle;
  };

  const renderContent = () => {
    // Text elements - fully editable
    if (element.type === 'heading') {
      return (
        <h1 
          contentEditable
          suppressContentEditableWarning
          className="w-full h-full outline-none font-bold text-4xl"
          onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
        >
          {element.content || 'Click to edit heading'}
        </h1>
      );
    }

    if (element.type === 'paragraph') {
      return (
        <p 
          contentEditable
          suppressContentEditableWarning
          className="w-full h-full outline-none text-base leading-relaxed"
          onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
        >
          {element.content || 'Click to edit paragraph text. Add your content here.'}
        </p>
      );
    }

    if (element.type === 'text') {
      return (
        <span 
          contentEditable
          suppressContentEditableWarning
          className="w-full h-full outline-none block"
          onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
        >
          {element.content || 'Click to edit text'}
        </span>
      );
    }

    // Button - styled and editable
    if (element.type === 'button') {
      return (
        <button 
          className="w-full h-full rounded-lg font-semibold transition-all hover:scale-105"
          style={{ pointerEvents: 'none' }}
        >
          <span
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
          >
            {element.content || 'Click Me'}
          </span>
        </button>
      );
    }

    // Link - editable with underline
    if (element.type === 'link') {
      return (
        <a 
          contentEditable
          suppressContentEditableWarning
          className="w-full h-full outline-none underline decoration-2 underline-offset-4"
          onBlur={(e) => onUpdate({ content: e.currentTarget.textContent || '' })}
        >
          {element.content || 'Click to edit link'}
        </a>
      );
    }

    // Image with placeholder
    if (element.type === 'image') {
      return element.content ? (
        <img src={element.content} alt="" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 gap-2">
          <Image className="w-16 h-16 text-gray-400" />
          <span className="text-sm text-gray-500">Click to upload image</span>
        </div>
      );
    }

    // Form elements with realistic previews
    if (element.type === 'input') {
      return (
        <input
          type="text"
          placeholder={element.content || 'Enter text...'}
          className="w-full h-full px-4 py-2 border-2 rounded-lg pointer-events-none"
        />
      );
    }

    if (element.type === 'textarea') {
      return (
        <textarea
          placeholder={element.content || 'Enter text...'}
          className="w-full h-full px-4 py-2 border-2 rounded-lg resize-none pointer-events-none"
        />
      );
    }

    if (element.type === 'select') {
      return (
        <select className="w-full h-full px-4 py-2 border-2 rounded-lg pointer-events-none">
          <option>{element.content || 'Select option...'}</option>
        </select>
      );
    }

    if (element.type === 'checkbox') {
      return (
        <div className="flex items-center gap-2 p-2">
          <div className="w-5 h-5 border-2 rounded" />
          <span>{element.content || 'Checkbox label'}</span>
        </div>
      );
    }

    // Card with content preview
    if (element.type === 'card') {
      return (
        <div className="w-full h-full flex flex-col p-6">
          <h3 className="text-xl font-bold mb-2">Card Title</h3>
          <p className="text-gray-600 flex-1">Card content goes here. This is a preview of how your card will look.</p>
        </div>
      );
    }

    // Navbar with realistic structure
    if (element.type === 'navbar') {
      return (
        <div className="w-full h-full flex items-center justify-between px-8">
          <div className="font-bold text-xl">Logo</div>
          <div className="flex gap-6">
            {['Home', 'About', 'Services', 'Contact'].map(item => (
              <span key={item} className="hover:opacity-70 cursor-pointer">{item}</span>
            ))}
          </div>
        </div>
      );
    }

    // Hero section
    if (element.type === 'hero') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-12">
          <h1 className="text-5xl font-bold mb-4">Welcome to Your Website</h1>
          <p className="text-xl mb-8 max-w-2xl">Create amazing experiences with our platform</p>
          <button className="px-8 py-3 rounded-lg font-semibold">Get Started</button>
        </div>
      );
    }

    // Footer with sections
    if (element.type === 'footer') {
      return (
        <div className="w-full h-full grid grid-cols-3 gap-8 p-12">
          <div>
            <h4 className="font-bold mb-3">Company</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>About Us</li>
              <li>Careers</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Blog</li>
              <li>Documentation</li>
              <li>Support</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Legal</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>Privacy</li>
              <li>Terms</li>
              <li>Cookies</li>
            </ul>
          </div>
        </div>
      );
    }

    // Product card for e-commerce
    if (element.type === 'productcard') {
      return (
        <div className="w-full h-full flex flex-col">
          <div className="flex-1 bg-gray-100 flex items-center justify-center">
            <Image className="w-20 h-20 text-gray-400" />
          </div>
          <div className="p-4">
            <h3 className="font-bold mb-1">Product Name</h3>
            <p className="text-sm text-gray-600 mb-2">Product description goes here</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">$99.99</span>
              <button className="px-4 py-1 rounded text-sm">Buy Now</button>
            </div>
          </div>
        </div>
      );
    }

    // Form with fields
    if (element.type === 'form' || element.type === 'contactform') {
      return (
        <div className="w-full h-full p-6 space-y-4">
          <h2 className="text-2xl font-bold mb-6">Contact Form</h2>
          <input type="text" placeholder="Name" className="w-full px-4 py-2 border rounded" />
          <input type="email" placeholder="Email" className="w-full px-4 py-2 border rounded" />
          <textarea placeholder="Message" className="w-full px-4 py-2 border rounded h-24 resize-none" />
          <button className="w-full py-3 rounded font-semibold">Submit</button>
        </div>
      );
    }

    // Testimonial
    if (element.type === 'testimonial') {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
          <p className="text-lg italic mb-4">"This product changed my life! Highly recommended."</p>
          <p className="font-bold">John Doe</p>
          <p className="text-sm text-gray-600">CEO, Company</p>
        </div>
      );
    }

    // Container/Layout elements
    if (['section', 'container', 'flex', 'grid', 'columns'].includes(element.type)) {
      return (
        <div className="w-full h-full relative border-2 border-dashed border-gray-300">
          <div className="absolute top-2 left-2 text-xs bg-white px-2 py-1 rounded shadow-sm font-medium">
            {element.name}
          </div>
        </div>
      );
    }

    // Default fallback with icon
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300">
        <div className="text-3xl mb-2">📦</div>
        <span className="text-sm font-medium">{element.name}</span>
      </div>
    );
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "absolute transition-all group",
        element.locked ? "cursor-not-allowed opacity-60" : "cursor-move",
        isSelected && "ring-2 ring-primary shadow-lg shadow-primary/30",
        !isSelected && "hover:ring-1 hover:ring-primary/50"
      )}
      style={getElementStyle()}
      onMouseDown={element.locked ? undefined : handleMouseDown}
      onClick={(e) => {
        if (element.locked) return;
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Hover overlay with quick actions */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <div className="absolute top-1 right-1 flex gap-1 pointer-events-auto">
          {!isSelected && (
            <Button
              variant="secondary"
              size="sm"
              className="h-6 w-6 p-0 bg-black/80 hover:bg-black text-white"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {renderContent()}

      {/* Selection controls */}
      {isSelected && !element.locked && (
        <div className="absolute -top-10 left-0 flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1.5 rounded-md shadow-lg">
          <span className="text-xs font-semibold">{element.name}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 w-5 p-0 hover:bg-primary-foreground/20"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}

      {/* Locked indicator */}
      {element.locked && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          🔒 Locked
        </div>
      )}

      {/* Resize handles */}
      {isSelected && !element.locked && (
        <>
          {['nw', 'ne', 'sw', 'se'].map((pos) => (
            <div
              key={pos}
              className={cn(
                "absolute w-3 h-3 bg-white border-2 border-primary rounded-full cursor-pointer hover:scale-125 transition-transform",
                pos === 'nw' && "-top-1.5 -left-1.5 cursor-nwse-resize",
                pos === 'ne' && "-top-1.5 -right-1.5 cursor-nesw-resize",
                pos === 'sw' && "-bottom-1.5 -left-1.5 cursor-nesw-resize",
                pos === 'se' && "-bottom-1.5 -right-1.5 cursor-nwse-resize"
              )}
            />
          ))}
        </>
      )}

      {/* Drag handle icon */}
      {isSelected && !element.locked && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
          <div className="grid grid-cols-2 gap-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 rounded-full bg-current" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
