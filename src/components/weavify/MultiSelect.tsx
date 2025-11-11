import { Button } from "@/components/ui/button";
import { WeavifyElement } from "@/types/weavify";
import { Trash2, Copy, Lock, Unlock } from "lucide-react";

interface MultiSelectProps {
  selectedIds: string[];
  elements: WeavifyElement[];
  onDelete: () => void;
  onDuplicate: () => void;
  onLock: () => void;
  onUnlock: () => void;
  onClearSelection: () => void;
}

export const MultiSelect = ({
  selectedIds,
  elements,
  onDelete,
  onDuplicate,
  onLock,
  onUnlock,
  onClearSelection,
}: MultiSelectProps) => {
  if (selectedIds.length === 0) return null;

  const selectedElements = elements.filter(el => selectedIds.includes(el.id));
  const allLocked = selectedElements.every(el => el.locked);
  const anyLocked = selectedElements.some(el => el.locked);

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-2xl flex items-center gap-4 z-50">
      <span className="font-semibold">
        {selectedIds.length} element{selectedIds.length > 1 ? 's' : ''} selected
      </span>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={onDuplicate}
          className="h-8"
        >
          <Copy className="w-4 h-4 mr-1" />
          Duplicate
        </Button>

        {allLocked ? (
          <Button
            size="sm"
            variant="secondary"
            onClick={onUnlock}
            className="h-8"
          >
            <Unlock className="w-4 h-4 mr-1" />
            Unlock
          </Button>
        ) : (
          <Button
            size="sm"
            variant="secondary"
            onClick={onLock}
            className="h-8"
          >
            <Lock className="w-4 h-4 mr-1" />
            Lock
          </Button>
        )}

        <Button
          size="sm"
          variant="destructive"
          onClick={onDelete}
          className="h-8"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </Button>

        <Button
          size="sm"
          variant="ghost"
          onClick={onClearSelection}
          className="h-8 hover:bg-primary-foreground/20"
        >
          Clear
        </Button>
      </div>
    </div>
  );
};
