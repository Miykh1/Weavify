import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";
import { toast } from "sonner";

interface AccessibilityPanelProps {
  elements: WeavifyElement[];
  selectedElement: WeavifyElement | null;
  onUpdate: (updates: Partial<WeavifyElement>) => void;
}

export const AccessibilityPanel = ({ elements, selectedElement, onUpdate }: AccessibilityPanelProps) => {
  const [ariaLabel, setAriaLabel] = useState('');
  const [ariaRole, setAriaRole] = useState('');
  const [tabIndex, setTabIndex] = useState('0');

  const checkAccessibility = () => {
    const issues: string[] = [];
    
    elements.forEach(el => {
      if (el.type === 'button' && !el.content) {
        issues.push(`Button "${el.name}" missing text content`);
      }
      if (el.type === 'image' && !el.props?.alt) {
        issues.push(`Image "${el.name}" missing alt text`);
      }
      if (el.type === 'input' && !el.props?.['aria-label']) {
        issues.push(`Input "${el.name}" missing ARIA label`);
      }
    });

    if (issues.length === 0) {
      toast.success("No accessibility issues found!");
    } else {
      toast.error(`Found ${issues.length} accessibility issue(s)`);
    }
    
    return issues;
  };

  const issues = checkAccessibility();

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Accessibility</h3>
        
        <Button size="sm" onClick={checkAccessibility} className="w-full">
          <Eye className="w-3 h-3 mr-1" />
          Run Accessibility Check
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {issues.length > 0 ? (
            <Card className="p-3 bg-yellow-500/10 border-yellow-500/20">
              <div className="flex items-start gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold">Accessibility Issues</p>
                  <p className="text-xs text-muted-foreground">{issues.length} issue(s) found</p>
                </div>
              </div>
              <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </Card>
          ) : (
            <Card className="p-3 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs font-semibold">All Good!</p>
                  <p className="text-xs text-muted-foreground">No accessibility issues found</p>
                </div>
              </div>
            </Card>
          )}

          {selectedElement && (
            <>
              <Card className="p-3">
                <h4 className="text-xs font-semibold mb-2">ARIA Attributes</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs">ARIA Label</Label>
                    <Input
                      value={selectedElement.props?.['aria-label'] || ''}
                      onChange={(e) => onUpdate({ 
                        props: { ...selectedElement.props, 'aria-label': e.target.value } 
                      })}
                      placeholder="Descriptive label"
                      className="h-7 text-xs"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">ARIA Role</Label>
                    <Select
                      value={selectedElement.props?.role || ''}
                      onValueChange={(v) => onUpdate({ 
                        props: { ...selectedElement.props, role: v } 
                      })}
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="button">Button</SelectItem>
                        <SelectItem value="link">Link</SelectItem>
                        <SelectItem value="navigation">Navigation</SelectItem>
                        <SelectItem value="main">Main</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="complementary">Complementary</SelectItem>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="contentinfo">Content Info</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Tab Index</Label>
                    <Input
                      type="number"
                      value={selectedElement.props?.tabIndex || 0}
                      onChange={(e) => onUpdate({ 
                        props: { ...selectedElement.props, tabIndex: Number(e.target.value) } 
                      })}
                      className="h-7 text-xs"
                    />
                  </div>
                </div>
              </Card>

              {selectedElement.type === 'image' && (
                <Card className="p-3">
                  <h4 className="text-xs font-semibold mb-2">Image Accessibility</h4>
                  <div>
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                      value={selectedElement.props?.alt || ''}
                      onChange={(e) => onUpdate({ 
                        props: { ...selectedElement.props, alt: e.target.value } 
                      })}
                      placeholder="Describe the image"
                      className="h-7 text-xs"
                    />
                  </div>
                </Card>
              )}

              {selectedElement.type === 'link' && (
                <Card className="p-3">
                  <h4 className="text-xs font-semibold mb-2">Link Accessibility</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Opens in new tab</Label>
                      <Switch
                        checked={selectedElement.props?.target === '_blank'}
                        onCheckedChange={(checked) => onUpdate({ 
                          props: { 
                            ...selectedElement.props, 
                            target: checked ? '_blank' : '_self',
                            rel: checked ? 'noopener noreferrer' : undefined
                          } 
                        })}
                      />
                    </div>
                  </div>
                </Card>
              )}
            </>
          )}

          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Keyboard Navigation</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>• Tab: Navigate through interactive elements</p>
              <p>• Enter/Space: Activate buttons and links</p>
              <p>• Arrow keys: Navigate menus and lists</p>
              <p>• Esc: Close modals and dropdowns</p>
            </div>
          </Card>

          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Screen Reader Support</h4>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>✓ Semantic HTML structure</p>
              <p>✓ ARIA labels and roles</p>
              <p>✓ Focus management</p>
              <p>✓ Keyboard navigation</p>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
