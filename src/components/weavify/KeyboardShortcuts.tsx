import { useEffect } from "react";
import { toast } from "sonner";

interface KeyboardShortcutsProps {
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onPaste: () => void;
  onSave: () => void;
  selectedId: string | null;
}

export const KeyboardShortcuts = ({
  onUndo,
  onRedo,
  onDelete,
  onCopy,
  onPaste,
  onSave,
  selectedId,
}: KeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Z for Undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        onUndo();
        toast.info("Undo");
      }
      
      // Cmd/Ctrl + Shift + Z for Redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        onRedo();
        toast.info("Redo");
      }
      
      // Cmd/Ctrl + Y for Redo (alternative)
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        onRedo();
        toast.info("Redo");
      }
      
      // Delete or Backspace to delete selected element
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        onDelete();
        toast.success("Element deleted");
      }
      
      // Cmd/Ctrl + C to copy
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && selectedId) {
        e.preventDefault();
        onCopy();
        toast.success("Copied to clipboard");
      }
      
      // Cmd/Ctrl + V to paste
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        onPaste();
      }
      
      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave();
        toast.success("Project saved");
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUndo, onRedo, onDelete, onCopy, onPaste, onSave, selectedId]);

  return null;
};
