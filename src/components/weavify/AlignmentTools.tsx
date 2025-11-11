import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalSpaceBetween,
  AlignVerticalSpaceBetween,
  Maximize2,
} from "lucide-react";
import { WeavifyElement } from "@/types/weavify";
import { toast } from "sonner";

interface AlignmentToolsProps {
  selectedIds: string[];
  elements: WeavifyElement[];
  onUpdateElements: (updates: { id: string; updates: Partial<WeavifyElement> }[]) => void;
}

export const AlignmentTools = ({ selectedIds, elements, onUpdateElements }: AlignmentToolsProps) => {
  if (selectedIds.length < 2) return null;

  const selectedElements = elements.filter(el => selectedIds.includes(el.id));

  const alignLeft = () => {
    const minX = Math.min(...selectedElements.map(el => el.x));
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { x: minX } })));
    toast.success("Aligned left");
  };

  const alignCenter = () => {
    const avgX = selectedElements.reduce((sum, el) => sum + el.x + el.width / 2, 0) / selectedElements.length;
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { x: avgX - el.width / 2 } })));
    toast.success("Aligned center");
  };

  const alignRight = () => {
    const maxX = Math.max(...selectedElements.map(el => el.x + el.width));
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { x: maxX - el.width } })));
    toast.success("Aligned right");
  };

  const alignTop = () => {
    const minY = Math.min(...selectedElements.map(el => el.y));
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { y: minY } })));
    toast.success("Aligned top");
  };

  const alignMiddle = () => {
    const avgY = selectedElements.reduce((sum, el) => sum + el.y + el.height / 2, 0) / selectedElements.length;
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { y: avgY - el.height / 2 } })));
    toast.success("Aligned middle");
  };

  const alignBottom = () => {
    const maxY = Math.max(...selectedElements.map(el => el.y + el.height));
    onUpdateElements(selectedElements.map(el => ({ id: el.id, updates: { y: maxY - el.height } })));
    toast.success("Aligned bottom");
  };

  const distributeHorizontally = () => {
    const sorted = [...selectedElements].sort((a, b) => a.x - b.x);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalWidth = last.x + last.width - first.x;
    const spacing = (totalWidth - sorted.reduce((sum, el) => sum + el.width, 0)) / (sorted.length - 1);
    
    let currentX = first.x;
    onUpdateElements(sorted.map(el => {
      const update = { id: el.id, updates: { x: currentX } };
      currentX += el.width + spacing;
      return update;
    }));
    toast.success("Distributed horizontally");
  };

  const distributeVertically = () => {
    const sorted = [...selectedElements].sort((a, b) => a.y - b.y);
    const first = sorted[0];
    const last = sorted[sorted.length - 1];
    const totalHeight = last.y + last.height - first.y;
    const spacing = (totalHeight - sorted.reduce((sum, el) => sum + el.height, 0)) / (sorted.length - 1);
    
    let currentY = first.y;
    onUpdateElements(sorted.map(el => {
      const update = { id: el.id, updates: { y: currentY } };
      currentY += el.height + spacing;
      return update;
    }));
    toast.success("Distributed vertically");
  };

  const matchWidth = () => {
    const width = selectedElements[0].width;
    onUpdateElements(selectedElements.slice(1).map(el => ({ id: el.id, updates: { width } })));
    toast.success("Matched width");
  };

  const matchHeight = () => {
    const height = selectedElements[0].height;
    onUpdateElements(selectedElements.slice(1).map(el => ({ id: el.id, updates: { height } })));
    toast.success("Matched height");
  };

  return (
    <div className="glass-panel p-2 flex items-center gap-1 rounded-lg">
      <div className="text-xs text-muted-foreground px-2">{selectedIds.length} selected</div>
      <Separator orientation="vertical" className="h-6" />
      
      <Button variant="ghost" size="sm" onClick={alignLeft} title="Align Left">
        <AlignLeft className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={alignCenter} title="Align Center">
        <AlignCenter className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={alignRight} title="Align Right">
        <AlignRight className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" onClick={alignTop} title="Align Top">
        <AlignVerticalJustifyCenter className="w-4 h-4 rotate-180" />
      </Button>
      <Button variant="ghost" size="sm" onClick={alignMiddle} title="Align Middle">
        <AlignHorizontalJustifyCenter className="w-4 h-4 rotate-90" />
      </Button>
      <Button variant="ghost" size="sm" onClick={alignBottom} title="Align Bottom">
        <AlignVerticalJustifyCenter className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" onClick={distributeHorizontally} title="Distribute Horizontally">
        <AlignHorizontalSpaceBetween className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={distributeVertically} title="Distribute Vertically">
        <AlignVerticalSpaceBetween className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button variant="ghost" size="sm" onClick={matchWidth} title="Match Width">
        <Maximize2 className="w-4 h-4 rotate-90" />
      </Button>
      <Button variant="ghost" size="sm" onClick={matchHeight} title="Match Height">
        <Maximize2 className="w-4 h-4" />
      </Button>
    </div>
  );
};
