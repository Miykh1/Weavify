import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Trash2, Workflow, GitBranch, Database, MousePointer, Timer } from "lucide-react";
import { toast } from "sonner";

interface ScriptNode {
  id: string;
  type: 'trigger' | 'action' | 'condition' | 'variable' | 'loop' | 'api' | 'dom';
  name: string;
  config: Record<string, any>;
  connections: string[];
  x: number;
  y: number;
}

export const VisualScriptingGraph = () => {
  const [nodes, setNodes] = useState<ScriptNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const nodeTypes = [
    { value: 'trigger', label: 'Trigger', icon: MousePointer, description: 'Event triggers (click, hover, scroll)' },
    { value: 'action', label: 'Action', icon: Workflow, description: 'Execute actions (navigate, toggle, animate)' },
    { value: 'condition', label: 'Condition', icon: GitBranch, description: 'If/else logic branching' },
    { value: 'variable', label: 'Variable', icon: Database, description: 'Store and manipulate data' },
    { value: 'loop', label: 'Loop', icon: Timer, description: 'Repeat actions (for, while)' },
    { value: 'api', label: 'API Call', icon: Database, description: 'Fetch data from APIs' },
    { value: 'dom', label: 'DOM', icon: Workflow, description: 'Manipulate DOM elements' },
  ];

  const addNode = (type: string) => {
    const newNode: ScriptNode = {
      id: `node-${Date.now()}`,
      type: type as any,
      name: `${type}-${nodes.length + 1}`,
      config: {},
      connections: [],
      x: Math.random() * 400,
      y: Math.random() * 300,
    };
    setNodes([...nodes, newNode]);
    toast.success(`Added ${type} node`);
  };

  const deleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    if (selectedNode === id) setSelectedNode(null);
    toast.success("Node deleted");
  };

  const updateNode = (id: string, updates: Partial<ScriptNode>) => {
    setNodes(nodes.map(n => (n.id === id ? { ...n, ...updates } : n)));
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="h-full flex">
      {/* Node Library */}
      <div className="w-64 border-r p-4">
        <h3 className="text-sm font-semibold mb-3 text-gradient">Node Library</h3>
        <ScrollArea className="h-[calc(100%-2rem)]">
          <div className="space-y-2">
            {nodeTypes.map((nodeType) => (
              <Card
                key={nodeType.value}
                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => addNode(nodeType.value)}
              >
                <div className="flex items-start gap-2">
                  <nodeType.icon className="w-4 h-4 mt-0.5 text-primary" />
                  <div>
                    <p className="text-xs font-semibold">{nodeType.label}</p>
                    <p className="text-xs text-muted-foreground">{nodeType.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Graph Canvas */}
      <div className="flex-1 relative bg-muted/20 overflow-auto">
        <div className="absolute inset-0 p-4">
          {nodes.map((node) => (
            <Card
              key={node.id}
              className={`absolute p-3 cursor-move w-48 ${
                selectedNode === node.id ? 'ring-2 ring-primary' : ''
              }`}
              style={{ left: node.x, top: node.y }}
              onClick={() => setSelectedNode(node.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">{node.type}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNode(node.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">{node.name}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Node Properties */}
      <div className="w-80 border-l p-4">
        <h3 className="text-sm font-semibold mb-3 text-gradient">Node Properties</h3>
        {selectedNodeData ? (
          <ScrollArea className="h-[calc(100%-2rem)]">
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Node Name</Label>
                <Input
                  value={selectedNodeData.name}
                  onChange={(e) => updateNode(selectedNodeData.id, { name: e.target.value })}
                  className="h-7 text-xs"
                />
              </div>

              <div>
                <Label className="text-xs">Type</Label>
                <Input value={selectedNodeData.type} disabled className="h-7 text-xs" />
              </div>

              {selectedNodeData.type === 'trigger' && (
                <div>
                  <Label className="text-xs">Event Type</Label>
                  <Select
                    value={selectedNodeData.config.event || 'click'}
                    onValueChange={(v) =>
                      updateNode(selectedNodeData.id, {
                        config: { ...selectedNodeData.config, event: v },
                      })
                    }
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="click">Click</SelectItem>
                      <SelectItem value="hover">Hover</SelectItem>
                      <SelectItem value="scroll">Scroll</SelectItem>
                      <SelectItem value="input">Input</SelectItem>
                      <SelectItem value="load">Page Load</SelectItem>
                      <SelectItem value="resize">Window Resize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {selectedNodeData.type === 'action' && (
                <>
                  <div>
                    <Label className="text-xs">Action Type</Label>
                    <Select
                      value={selectedNodeData.config.action || 'navigate'}
                      onValueChange={(v) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, action: v },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="navigate">Navigate</SelectItem>
                        <SelectItem value="toggle">Toggle</SelectItem>
                        <SelectItem value="animate">Animate</SelectItem>
                        <SelectItem value="show">Show Element</SelectItem>
                        <SelectItem value="hide">Hide Element</SelectItem>
                        <SelectItem value="addClass">Add Class</SelectItem>
                        <SelectItem value="removeClass">Remove Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Target</Label>
                    <Input
                      value={selectedNodeData.config.target || ''}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, target: e.target.value },
                        })
                      }
                      className="h-7 text-xs"
                      placeholder="element-id or selector"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'variable' && (
                <>
                  <div>
                    <Label className="text-xs">Variable Name</Label>
                    <Input
                      value={selectedNodeData.config.varName || ''}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, varName: e.target.value },
                        })
                      }
                      className="h-7 text-xs"
                      placeholder="myVariable"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Initial Value</Label>
                    <Input
                      value={selectedNodeData.config.value || ''}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, value: e.target.value },
                        })
                      }
                      className="h-7 text-xs"
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'api' && (
                <>
                  <div>
                    <Label className="text-xs">Method</Label>
                    <Select
                      value={selectedNodeData.config.method || 'GET'}
                      onValueChange={(v) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, method: v },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="DELETE">DELETE</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">URL</Label>
                    <Input
                      value={selectedNodeData.config.url || ''}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, url: e.target.value },
                        })
                      }
                      className="h-7 text-xs"
                      placeholder="https://api.example.com/data"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'condition' && (
                <>
                  <div>
                    <Label className="text-xs">Condition Type</Label>
                    <Select
                      value={selectedNodeData.config.conditionType || 'if'}
                      onValueChange={(v) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, conditionType: v },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="if">If</SelectItem>
                        <SelectItem value="else">Else</SelectItem>
                        <SelectItem value="switch">Switch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Expression</Label>
                    <Input
                      value={selectedNodeData.config.expression || ''}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, expression: e.target.value },
                        })
                      }
                      className="h-7 text-xs"
                      placeholder="value > 10"
                    />
                  </div>
                </>
              )}

              {selectedNodeData.type === 'loop' && (
                <>
                  <div>
                    <Label className="text-xs">Loop Type</Label>
                    <Select
                      value={selectedNodeData.config.loopType || 'for'}
                      onValueChange={(v) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, loopType: v },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="for">For</SelectItem>
                        <SelectItem value="while">While</SelectItem>
                        <SelectItem value="forEach">For Each</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Iterations</Label>
                    <Input
                      type="number"
                      value={selectedNodeData.config.iterations || 10}
                      onChange={(e) =>
                        updateNode(selectedNodeData.id, {
                          config: { ...selectedNodeData.config, iterations: Number(e.target.value) },
                        })
                      }
                      className="h-7 text-xs"
                    />
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Workflow className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Select a node to edit properties</p>
          </div>
        )}
      </div>
    </div>
  );
};
