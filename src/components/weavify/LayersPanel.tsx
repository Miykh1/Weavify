import { useState } from "react";
import { WeavifyElement } from "@/types/weavify";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Trash2, Lock, Unlock, Edit2 } from "lucide-react";
import { toast } from "sonner";

interface LayersPanelProps {
  elements: WeavifyElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onUpdate: (id: string, updates: Partial<WeavifyElement>) => void;
  onDelete: (id: string) => void;
}

export const LayersPanel = ({
  elements,
  selectedId,
  onSelectElement,
  onUpdate,
  onDelete,
}: LayersPanelProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEdit = (element: WeavifyElement) => {
    setEditingId(element.id);
    setEditName(element.name);
  };

  const finishEdit = (id: string) => {
    if (editName.trim()) {
      onUpdate(id, { name: editName.trim() });
      toast.success("Layer renamed");
    }
    setEditingId(null);
  };

  return (
    <div className="w-64 glass-panel border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-sm font-semibold text-gradient">Layers</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {elements.length} element{elements.length !== 1 ? 's' : ''}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {elements.map((element) => (
            <div
              key={element.id}
              className={`
                group flex items-center gap-2 p-2 rounded-lg cursor-pointer
                transition-all duration-200 hover:bg-accent/50
                ${selectedId === element.id ? 'bg-primary/20 ring-2 ring-primary' : ''}
                ${element.locked ? 'opacity-60' : ''}
              `}
              onClick={() => !element.locked && onSelectElement(element.id)}
            >
              <div className="flex-1 min-w-0">
                {editingId === element.id ? (
                  <Input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => finishEdit(element.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') finishEdit(element.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    className="h-6 text-xs"
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <>
                    <p className="text-xs font-medium truncate">{element.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{element.type}</p>
                  </>
                )}
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {editingId !== element.id && (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        startEdit(element);
                      }}
                      title="Rename"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpdate(element.id, { locked: !element.locked });
                        toast.success(element.locked ? "Layer unlocked" : "Layer locked");
                      }}
                      title={element.locked ? "Unlock" : "Lock"}
                    >
                      {element.locked ? (
                        <Lock className="w-3 h-3" />
                      ) : (
                        <Unlock className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!element.locked) {
                          onDelete(element.id);
                        } else {
                          toast.error("Unlock layer first");
                        }
                      }}
                      title="Delete"
                      disabled={element.locked}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {elements.length === 0 && (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No elements yet. Drag components from the library to get started!
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
