import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Database } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface APIEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  url: string;
  headers: Record<string, string>;
  body: string;
}

export const APIPanel = () => {
  const [endpoints, setEndpoints] = useState<APIEndpoint[]>([]);

  const addEndpoint = () => {
    setEndpoints([
      ...endpoints,
      {
        id: `api-${Date.now()}`,
        name: 'New API',
        method: 'GET',
        url: 'https://api.example.com',
        headers: {},
        body: '',
      },
    ]);
  };

  const updateEndpoint = (id: string, updates: Partial<APIEndpoint>) => {
    setEndpoints(endpoints.map(e => (e.id === id ? { ...e, ...updates } : e)));
  };

  const removeEndpoint = (id: string) => {
    setEndpoints(endpoints.filter(e => e.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gradient">API Integration</h3>
        <Button size="sm" onClick={addEndpoint} className="h-7">
          <Plus className="w-3 h-3 mr-1" />
          Add API
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {endpoints.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No API endpoints yet</p>
              <p className="text-xs mt-1">Connect to REST or GraphQL APIs</p>
            </div>
          ) : (
            endpoints.map((endpoint) => (
              <Card key={endpoint.id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">API Endpoint</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEndpoint(endpoint.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={endpoint.name}
                      onChange={(e) => updateEndpoint(endpoint.id, { name: e.target.value })}
                      className="h-7 text-xs"
                      placeholder="API Name"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label className="text-xs">Method</Label>
                      <Select
                        value={endpoint.method}
                        onValueChange={(v: any) => updateEndpoint(endpoint.id, { method: v })}
                      >
                        <SelectTrigger className="h-7 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GET">GET</SelectItem>
                          <SelectItem value="POST">POST</SelectItem>
                          <SelectItem value="PUT">PUT</SelectItem>
                          <SelectItem value="DELETE">DELETE</SelectItem>
                          <SelectItem value="PATCH">PATCH</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">URL</Label>
                      <Input
                        value={endpoint.url}
                        onChange={(e) => updateEndpoint(endpoint.id, { url: e.target.value })}
                        className="h-7 text-xs"
                        placeholder="https://api.example.com/endpoint"
                      />
                    </div>
                  </div>

                  {(endpoint.method === 'POST' || endpoint.method === 'PUT' || endpoint.method === 'PATCH') && (
                    <div>
                      <Label className="text-xs">Body (JSON)</Label>
                      <Textarea
                        value={endpoint.body}
                        onChange={(e) => updateEndpoint(endpoint.id, { body: e.target.value })}
                        className="text-xs font-mono h-20"
                        placeholder='{"key": "value"}'
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
