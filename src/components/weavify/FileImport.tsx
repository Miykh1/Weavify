import { useCallback } from "react";
import { Upload, FileText, Image as ImageIcon, Table } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FileImportProps {
  onImageImport: (dataUrl: string) => void;
  onTextImport: (text: string) => void;
  onCsvImport: (data: string[][]) => void;
}

export const FileImport = ({ onImageImport, onTextImport, onCsvImport }: FileImportProps) => {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    files.forEach(file => {
      const fileType = file.type;
      
      // Handle images
      if (fileType.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          onImageImport(dataUrl);
          toast.success(`Image imported: ${file.name}`);
        };
        reader.readAsDataURL(file);
      }
      // Handle text files
      else if (fileType.startsWith('text/') || fileType === 'application/json') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          onTextImport(text);
          toast.success(`Text file imported: ${file.name}`);
        };
        reader.readAsText(file);
      }
      // Handle CSV
      else if (file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const text = event.target?.result as string;
          const rows = text.split('\n').map(row => row.split(','));
          onCsvImport(rows);
          toast.success(`CSV imported: ${file.name}`);
        };
        reader.readAsText(file);
      }
      else {
        toast.error(`Unsupported file type: ${file.name}`);
      }
    });
  }, [onImageImport, onTextImport, onCsvImport]);

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleFileDrop}
      className={cn(
        "fixed inset-0 pointer-events-none z-50",
        "peer-[:has(.dragging)]:pointer-events-auto"
      )}
    >
      <div className="absolute inset-4 border-4 border-dashed border-primary/20 rounded-lg bg-background/80 backdrop-blur-sm hidden peer-[:has(.dragging)]:flex items-center justify-center">
        <div className="text-center space-y-4">
          <Upload className="w-16 h-16 mx-auto text-primary/60" />
          <div>
            <p className="text-lg font-medium">Drop files to import</p>
            <div className="flex gap-4 mt-4 justify-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                <span>Images</span>
              </div>
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                <span>Text</span>
              </div>
              <div className="flex items-center gap-1">
                <Table className="w-4 h-4" />
                <span>CSV</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};