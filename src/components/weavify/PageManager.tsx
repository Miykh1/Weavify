import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Link2, FileText } from "lucide-react";
import { toast } from "sonner";

export interface Page {
  id: string;
  name: string;
  path: string;
  elementIds: string[];
}

interface PageManagerProps {
  pages: Page[];
  currentPageId: string;
  onAddPage: (name: string, path: string) => void;
  onDeletePage: (id: string) => void;
  onSelectPage: (id: string) => void;
  onLinkElements: (fromId: string, toPageId: string) => void;
}

export const PageManager = ({
  pages,
  currentPageId,
  onAddPage,
  onDeletePage,
  onSelectPage,
}: PageManagerProps) => {
  const [newPageName, setNewPageName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddPage = () => {
    if (!newPageName.trim()) {
      toast.error("Please enter a page name");
      return;
    }

    const path = `/${newPageName.toLowerCase().replace(/\s+/g, '-')}`;
    onAddPage(newPageName, path);
    setNewPageName("");
    setIsAdding(false);
    toast.success(`Created page "${newPageName}"`);
  };

  return (
    <div className="h-full flex flex-col p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h3 className="font-semibold">Pages</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          New Page
        </Button>
      </div>

      {isAdding && (
        <Card className="p-3 mb-4 space-y-2">
          <Input
            placeholder="Page name (e.g., About Us)"
            value={newPageName}
            onChange={(e) => setNewPageName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddPage()}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleAddPage}>
              Create
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setIsAdding(false);
                setNewPageName("");
              }}
            >
              Cancel
            </Button>
          </div>
        </Card>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {pages.map((page) => (
            <Card
              key={page.id}
              className={`p-3 cursor-pointer transition-all ${
                currentPageId === page.id
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted'
              }`}
              onClick={() => onSelectPage(page.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium">{page.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Link2 className="w-3 h-3" />
                    {page.path}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {page.elementIds.length} elements
                  </p>
                </div>
                {page.id !== 'home' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePage(page.id);
                      toast.success(`Deleted page "${page.name}"`);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      <div className="mt-4 p-3 bg-muted rounded-lg text-xs text-muted-foreground">
        <p className="font-medium mb-1">💡 Tip: Link Pages</p>
        <p>
          Select a button or link element, then use the Properties panel to
          link it to another page for navigation.
        </p>
      </div>
    </div>
  );
};
