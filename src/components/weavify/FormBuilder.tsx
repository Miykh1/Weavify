import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

export const FormBuilder = () => {
  const [fields, setFields] = useState<any[]>([]);

  const fieldTypes = [
    { value: 'text', label: 'Text Input' },
    { value: 'email', label: 'Email' },
    { value: 'password', label: 'Password' },
    { value: 'number', label: 'Number' },
    { value: 'textarea', label: 'Text Area' },
    { value: 'select', label: 'Dropdown' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'radio', label: 'Radio Button' },
    { value: 'date', label: 'Date Picker' },
    { value: 'file', label: 'File Upload' },
  ];

  const addField = () => {
    setFields([...fields, {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      required: false,
      placeholder: '',
    }]);
    toast.success("Field added");
  };

  const removeField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
    toast.success("Field removed");
  };

  const updateField = (id: string, updates: any) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gradient">Form Builder</h3>
          <Button size="sm" onClick={addField}>
            <Plus className="w-3 h-3 mr-1" />
            Add Field
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {fields.length === 0 ? (
            <Card className="p-6 text-center">
              <p className="text-sm text-muted-foreground mb-2">No fields yet</p>
              <Button size="sm" onClick={addField}>
                <Plus className="w-3 h-3 mr-1" />
                Add Your First Field
              </Button>
            </Card>
          ) : (
            fields.map((field) => (
              <Card key={field.id} className="p-3">
                <div className="flex items-start gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground mt-1 cursor-move" />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { label: e.target.value })}
                        className="h-7 text-xs font-medium"
                        placeholder="Field Label"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeField(field.id)}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                    <Select
                      value={field.type}
                      onValueChange={(v) => updateField(field.id, { type: v })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldTypes.map(ft => (
                          <SelectItem key={ft.value} value={ft.value}>
                            {ft.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={field.placeholder}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      className="h-7 text-xs"
                      placeholder="Placeholder text"
                    />
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={field.required}
                        onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                        id={`required-${field.id}`}
                      />
                      <Label htmlFor={`required-${field.id}`} className="text-xs">
                        Required field
                      </Label>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <Button className="w-full" size="sm">
          Generate Form Code
        </Button>
      </div>
    </div>
  );
};
