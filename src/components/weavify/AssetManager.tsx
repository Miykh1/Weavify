import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Image, FileText, Film, Music, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Asset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio' | 'document';
  url: string;
  size: number;
  uploadedAt: Date;
}

export const AssetManager = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAsset: Asset = {
          id: `asset-${Date.now()}-${Math.random()}`,
          name: file.name,
          type: file.type.startsWith('image/') ? 'image' : 
                file.type.startsWith('video/') ? 'video' :
                file.type.startsWith('audio/') ? 'audio' : 'document',
          url: e.target?.result as string,
          size: file.size,
          uploadedAt: new Date(),
        };
        setAssets(prev => [...prev, newAsset]);
        toast.success(`Uploaded ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
    toast.success("Asset deleted");
  };

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderAssetsByType = (type: Asset['type']) => {
    const typeAssets = filteredAssets.filter(a => a.type === type);

    return (
      <div className="grid grid-cols-3 gap-4 p-4">
        {typeAssets.map(asset => (
          <div
            key={asset.id}
            className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors cursor-pointer"
          >
            {asset.type === 'image' && (
              <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
            )}
            {asset.type === 'video' && (
              <video src={asset.url} className="w-full h-full object-cover" />
            )}
            {asset.type === 'audio' && (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <Music className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            {asset.type === 'document' && (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <FileText className="w-12 h-12 text-muted-foreground" />
              </div>
            )}

            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                variant="destructive"
                size="sm"
                onClick={() => deleteAsset(asset.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 text-xs text-white truncate">
              {asset.name}
            </div>
          </div>
        ))}

        {typeAssets.length === 0 && (
          <div className="col-span-3 text-center py-12 text-muted-foreground">
            No {type}s uploaded yet
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border space-y-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold flex-1">Asset Manager</h3>
          <label>
            <input
              type="file"
              multiple
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button size="sm" asChild>
              <span className="cursor-pointer">
                <Upload className="w-4 h-4 mr-2" />
                Upload
              </span>
            </Button>
          </label>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs defaultValue="images" className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4">
          <TabsTrigger value="images" className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center gap-2">
            <Film className="w-4 h-4" />
            Videos
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Music className="w-4 h-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <TabsContent value="images" className="mt-0">
            {renderAssetsByType('image')}
          </TabsContent>
          <TabsContent value="videos" className="mt-0">
            {renderAssetsByType('video')}
          </TabsContent>
          <TabsContent value="audio" className="mt-0">
            {renderAssetsByType('audio')}
          </TabsContent>
          <TabsContent value="documents" className="mt-0">
            {renderAssetsByType('document')}
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
