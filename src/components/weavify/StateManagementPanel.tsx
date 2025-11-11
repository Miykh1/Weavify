import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Code2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StateVariable {
  id: string;
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  defaultValue: string;
}

export const StateManagementPanel = () => {
  const [variables, setVariables] = useState<StateVariable[]>([]);

  const addVariable = () => {
    setVariables([
      ...variables,
      {
        id: `var-${Date.now()}`,
        name: 'newVariable',
        type: 'string',
        defaultValue: '',
      },
    ]);
  };

  const updateVariable = (id: string, updates: Partial<StateVariable>) => {
    setVariables(variables.map(v => (v.id === id ? { ...v, ...updates } : v)));
  };

  const removeVariable = (id: string) => {
    setVariables(variables.filter(v => v.id !== id));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gradient">State Management</h3>
        <Button size="sm" onClick={addVariable} className="h-7">
          <Plus className="w-3 h-3 mr-1" />
          Add Variable
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {variables.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Code2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No state variables yet</p>
              <p className="text-xs mt-1">Add variables to manage app state</p>
            </div>
          ) : (
            variables.map((variable) => (
              <Card key={variable.id} className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold">Variable</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariable(variable.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={variable.name}
                      onChange={(e) => updateVariable(variable.id, { name: e.target.value })}
                      className="h-7 text-xs"
                      placeholder="variableName"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={variable.type}
                      onValueChange={(v: any) => updateVariable(variable.id, { type: v })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="string">String</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="boolean">Boolean</SelectItem>
                        <SelectItem value="object">Object</SelectItem>
                        <SelectItem value="array">Array</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Default Value</Label>
                    <Input
                      value={variable.defaultValue}
                      onChange={(e) => updateVariable(variable.id, { defaultValue: e.target.value })}
                      className="h-7 text-xs"
                      placeholder={variable.type === 'string' ? '"Hello"' : '0'}
                    />
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
