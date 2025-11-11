import { useState, useCallback, useEffect } from "react";
import { WeavifyElement, Tool, ViewMode } from "@/types/weavify";
import { Button } from "@/components/ui/button";
import { Toolbar } from "@/components/weavify/Toolbar";
import { ComponentLibrary } from "@/components/weavify/ComponentLibrary";
import { Canvas } from "@/components/weavify/Canvas";
import { PropertiesPanel } from "@/components/weavify/PropertiesPanel";
import { LayersPanel } from "@/components/weavify/LayersPanel";
import { CodePanel } from "@/components/weavify/CodePanel";
import { WelcomeDialog } from "@/components/weavify/WelcomeDialog";
import { DependencyGraph } from "@/components/weavify/DependencyGraph";
import { StateManagementPanel } from "@/components/weavify/StateManagementPanel";
import { APIPanel } from "@/components/weavify/APIPanel";
import { TimelineEditor } from "@/components/weavify/TimelineEditor";
import { VisualScriptingGraph } from "@/components/weavify/VisualScriptingGraph";
import { ExportPanel } from "@/components/weavify/ExportPanel";
import { DeploymentPanel } from "@/components/weavify/DeploymentPanel";
import { AccessibilityPanel } from "@/components/weavify/AccessibilityPanel";
import { PerformancePanel } from "@/components/weavify/PerformancePanel";
import { TemplateMarketplace } from "@/components/weavify/TemplateMarketplace";
import { ThreeDPanel } from "@/components/weavify/ThreeDPanel";
import { FormBuilder } from "@/components/weavify/FormBuilder";
import { KeyboardShortcuts } from "@/components/weavify/KeyboardShortcuts";
import { ThemePanel, ThemeConfig } from "@/components/weavify/ThemePanel";
import { PageManager, Page } from "@/components/weavify/PageManager";
import { MultiSelect } from "@/components/weavify/MultiSelect";
import { PreviewMode } from "@/components/weavify/PreviewMode";
import { AlignmentTools } from "@/components/weavify/AlignmentTools";
import { AssetManager } from "@/components/weavify/AssetManager";
import { AdvancedAnimationPanel } from "@/components/weavify/AdvancedAnimationPanel";
import { ResponsiveEditor } from "@/components/weavify/ResponsiveEditor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { componentTemplates } from "@/lib/componentTemplates";
import { Eye, Save } from "lucide-react";

const Index = () => {
  const [elements, setElements] = useState<WeavifyElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [history, setHistory] = useState<WeavifyElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const [draggedName, setDraggedName] = useState<string | null>(null);
  const [showLayers, setShowLayers] = useState(true);
  const [showCode, setShowCode] = useState(true);
  const [showProperties, setShowProperties] = useState(true);
  const [showComponents, setShowComponents] = useState(true);
  const [bottomPanelTab, setBottomPanelTab] = useState<'code' | 'timeline' | 'graph' | 'scripting' | 'export' | 'deploy'>('code');
  const [rightPanelTab, setRightPanelTab] = useState<'properties' | 'state' | 'api' | 'accessibility' | 'performance' | '3d' | 'formbuilder' | 'theme' | 'pages' | 'assets' | 'animations' | 'responsive'>('properties');
  const [showMarketplace, setShowMarketplace] = useState(false);
  const [clipboard, setClipboard] = useState<WeavifyElement | null>(null);
  const [currentTheme, setCurrentTheme] = useState<ThemeConfig | null>(null);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [gridSize] = useState(20);
  const [pages, setPages] = useState<Page[]>([
    { id: 'home', name: 'Home', path: '/', elementIds: [] }
  ]);
  const [currentPageId, setCurrentPageId] = useState('home');
  const [showPreview, setShowPreview] = useState(false);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;
    
    const timer = setTimeout(() => {
      handleSave();
    }, 5000); // Auto-save every 5 seconds

    return () => clearTimeout(timer);
  }, [elements, autoSaveEnabled]);

  const addToHistory = useCallback((newElements: WeavifyElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newElements);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  const handleDragStart = useCallback((type: string, name: string) => {
    setDraggedType(type);
    setDraggedName(name);
  }, []);

  const handleDrop = useCallback((x: number, y: number) => {
    if (!draggedType || !draggedName) return;

    // Snap to grid if enabled
    const snappedX = snapToGrid ? Math.round(x / gridSize) * gridSize : x;
    const snappedY = snapToGrid ? Math.round(y / gridSize) * gridSize : y;

    // Get template from componentTemplates or use fallback
    const template = componentTemplates[draggedType] || {
      type: draggedType,
      width: 200,
      height: 100,
      styles: {},
      content: undefined,
    };

    // Apply theme colors if theme is active
    let templateStyles = { ...template.styles };
    if (currentTheme) {
      templateStyles = {
        ...templateStyles,
        backgroundColor: templateStyles.backgroundColor || currentTheme.colors.background,
        color: templateStyles.color || currentTheme.colors.text,
        borderRadius: currentTheme.borderRadius,
        fontFamily: template.type.includes('heading') || template.type === 'heading' 
          ? currentTheme.fonts.heading 
          : currentTheme.fonts.body,
      };
    }

    const newElement: WeavifyElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: draggedType as any,
      name: draggedName,
      x: snappedX,
      y: snappedY,
      width: template.width,
      height: template.height,
      styles: templateStyles,
      content: template.content,
      animations: [],
      interactions: [],
    };

    const newElements = [...elements, newElement];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(newElement.id);
    setSelectedIds([newElement.id]);
    setDraggedType(null);
    setDraggedName(null);
    
    // Add element to current page
    const updatedPages = pages.map(page =>
      page.id === currentPageId
        ? { ...page, elementIds: [...page.elementIds, newElement.id] }
        : page
    );
    setPages(updatedPages);
    
    toast.success(`Added ${draggedName} to canvas`);
  }, [draggedType, draggedName, elements, addToHistory, snapToGrid, gridSize, currentTheme, pages, currentPageId]);

  const handleUpdateElement = useCallback((id: string, updates: Partial<WeavifyElement>) => {
    const newElements = elements.map(el => 
      el.id === id ? { ...el, ...updates } : el
    );
    setElements(newElements);
    addToHistory(newElements);
  }, [elements, addToHistory]);

  const handleDeleteElement = useCallback((id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    addToHistory(newElements);
    setSelectedId(null);
    toast.success("Element deleted");
  }, [elements, addToHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setElements(history[historyIndex - 1]);
      toast.success("Undo");
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setElements(history[historyIndex + 1]);
      toast.success("Redo");
    }
  }, [history, historyIndex]);

  const handlePreview = useCallback(() => {
    toast.success("Preview mode coming soon!");
  }, []);

  const handleExport = useCallback(() => {
    setBottomPanelTab('export');
    toast.success("Export panel opened");
  }, []);

  const handleImportTemplate = useCallback((templateElements: WeavifyElement[]) => {
    const newElements = [...elements, ...templateElements];
    setElements(newElements);
    addToHistory(newElements);
    setShowMarketplace(false);
  }, [elements, addToHistory]);

  const handleCopy = useCallback(() => {
    if (selectedId) {
      const element = elements.find(el => el.id === selectedId);
      if (element) setClipboard(element);
    }
  }, [selectedId, elements]);

  const handlePaste = useCallback(() => {
    if (clipboard) {
      const newElement = { 
        ...clipboard, 
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: clipboard.x + 20,
        y: clipboard.y + 20,
        name: `${clipboard.name} (Copy)`
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      toast.success("Pasted element");
    }
  }, [clipboard, elements, addToHistory]);

  const handleSave = useCallback(() => {
    localStorage.setItem('weavify-project', JSON.stringify({ elements, pages }));
    toast.success("Project saved locally");
  }, [elements, pages]);

  // Theme application
  const handleApplyTheme = useCallback((theme: ThemeConfig) => {
    setCurrentTheme(theme);
    toast.success(`Applied theme: ${theme.name}`);
  }, []);

  // Page management
  const handleAddPage = useCallback((name: string, path: string) => {
    const newPage: Page = {
      id: `page-${Date.now()}`,
      name,
      path,
      elementIds: [],
    };
    setPages([...pages, newPage]);
  }, [pages]);

  const handleDeletePage = useCallback((id: string) => {
    setPages(pages.filter(p => p.id !== id));
    if (currentPageId === id) {
      setCurrentPageId('home');
    }
  }, [pages, currentPageId]);

  const handleSelectPage = useCallback((id: string) => {
    setCurrentPageId(id);
    setSelectedId(null);
    setSelectedIds([]);
  }, []);

  // Multi-select handlers
  const handleMultiDelete = useCallback(() => {
    const newElements = elements.filter(el => !selectedIds.includes(el.id));
    setElements(newElements);
    addToHistory(newElements);
    setSelectedIds([]);
    toast.success(`Deleted ${selectedIds.length} elements`);
  }, [elements, selectedIds, addToHistory]);

  const handleMultiDuplicate = useCallback(() => {
    const selectedElements = elements.filter(el => selectedIds.includes(el.id));
    const duplicates = selectedElements.map(el => ({
      ...el,
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: el.x + 20,
      y: el.y + 20,
      name: `${el.name} (Copy)`,
    }));
    const newElements = [...elements, ...duplicates];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedIds(duplicates.map(d => d.id));
    toast.success(`Duplicated ${selectedIds.length} elements`);
  }, [elements, selectedIds, addToHistory]);

  const handleMultiLock = useCallback(() => {
    const newElements = elements.map(el =>
      selectedIds.includes(el.id) ? { ...el, locked: true } : el
    );
    setElements(newElements);
    addToHistory(newElements);
    toast.success(`Locked ${selectedIds.length} elements`);
  }, [elements, selectedIds, addToHistory]);

  const handleMultiUnlock = useCallback(() => {
    const newElements = elements.map(el =>
      selectedIds.includes(el.id) ? { ...el, locked: false } : el
    );
    setElements(newElements);
    addToHistory(newElements);
    toast.success(`Unlocked ${selectedIds.length} elements`);
  }, [elements, selectedIds, addToHistory]);

  // Filter elements for current page
  const currentPage = pages.find(p => p.id === currentPageId);
  const pageElements = currentPage 
    ? elements.filter(el => currentPage.elementIds.includes(el.id))
    : elements;

  const selectedElement = elements.find(el => el.id === selectedId) || null;

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden">
      <WelcomeDialog />
      <KeyboardShortcuts
        onUndo={handleUndo}
        onRedo={handleRedo}
        onDelete={() => selectedId && handleDeleteElement(selectedId)}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onSave={handleSave}
        selectedId={selectedId}
      />
      
      {showMarketplace && (
        <div className="absolute inset-0 z-50 bg-background/95 backdrop-blur-sm">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gradient">Template Marketplace</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMarketplace(false)}>
                Close
              </Button>
            </div>
            <TemplateMarketplace onImportTemplate={handleImportTemplate} />
          </div>
        </div>
      )}
      
      <Toolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onPreview={handlePreview}
        onExport={handleExport}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        showLayers={showLayers}
        showCode={showCode}
        showProperties={showProperties}
        showComponents={showComponents}
        onToggleLayers={() => setShowLayers(!showLayers)}
        onToggleCode={() => setShowCode(!showCode)}
        onToggleProperties={() => setShowProperties(!showProperties)}
        onToggleComponents={() => setShowComponents(!showComponents)}
        onOpenMarketplace={() => setShowMarketplace(true)}
      />

      <div className="flex-1 flex overflow-hidden">
        {showComponents && <ComponentLibrary onDragStart={handleDragStart} />}
        {showLayers && (
          <LayersPanel
            elements={elements}
            selectedId={selectedId}
            onSelectElement={setSelectedId}
            onUpdate={handleUpdateElement}
            onDelete={handleDeleteElement}
          />
        )}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden relative">
            {/* Preview Mode */}
            {showPreview && (
              <PreviewMode elements={pageElements} onClose={() => setShowPreview(false)} />
            )}

            {/* Alignment Tools */}
            {selectedIds.length >= 2 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
                <AlignmentTools
                  selectedIds={selectedIds}
                  elements={elements}
                  onUpdateElements={(updates) => {
                    const newElements = elements.map(el => {
                      const update = updates.find(u => u.id === el.id);
                      return update ? { ...el, ...update.updates } : el;
                    });
                    setElements(newElements);
                    addToHistory(newElements);
                  }}
                />
              </div>
            )}

            {/* Preview Button */}
            <div className="absolute top-4 right-4 z-10">
              <Button
                onClick={() => setShowPreview(true)}
                variant="default"
                size="sm"
                className="gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>

            <Canvas
              elements={pageElements}
              selectedId={selectedId}
              onSelectElement={(id) => {
                setSelectedId(id);
                setSelectedIds(id ? [id] : []);
              }}
              onUpdateElement={handleUpdateElement}
              onDeleteElement={handleDeleteElement}
              viewMode={viewMode}
              onDrop={handleDrop}
            />
            
            {/* Multi-select toolbar */}
            <MultiSelect
              selectedIds={selectedIds}
              elements={elements}
              onDelete={handleMultiDelete}
              onDuplicate={handleMultiDuplicate}
              onLock={handleMultiLock}
              onUnlock={handleMultiUnlock}
              onClearSelection={() => setSelectedIds([])}
            />
            {showCode && (
              <div className="h-80 border-t">
                <Tabs value={bottomPanelTab} onValueChange={(v: any) => setBottomPanelTab(v)}>
                  <TabsList className="w-full justify-start rounded-none border-b">
                    <TabsTrigger value="code" className="text-xs">Code</TabsTrigger>
                    <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
                    <TabsTrigger value="graph" className="text-xs">Dependencies</TabsTrigger>
                    <TabsTrigger value="scripting" className="text-xs">Visual Scripting</TabsTrigger>
                    <TabsTrigger value="export" className="text-xs">Export</TabsTrigger>
                    <TabsTrigger value="deploy" className="text-xs">Deploy</TabsTrigger>
                  </TabsList>
                  <TabsContent value="code" className="h-[calc(100%-40px)] m-0">
                    <CodePanel elements={elements} />
                  </TabsContent>
                  <TabsContent value="timeline" className="h-[calc(100%-40px)] m-0">
                    <TimelineEditor />
                  </TabsContent>
                  <TabsContent value="graph" className="h-[calc(100%-40px)] m-0">
                    <DependencyGraph 
                      elements={elements} 
                      selectedId={selectedId}
                      onSelectElement={setSelectedId}
                    />
                  </TabsContent>
                  <TabsContent value="scripting" className="h-[calc(100%-40px)] m-0">
                    <VisualScriptingGraph />
                  </TabsContent>
                  <TabsContent value="export" className="h-[calc(100%-40px)] m-0">
                    <ExportPanel elements={elements} />
                  </TabsContent>
                  <TabsContent value="deploy" className="h-[calc(100%-40px)] m-0">
                    <DeploymentPanel />
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
          {showProperties && (
            <div className="w-80 border-l flex flex-col">
              <Tabs value={rightPanelTab} onValueChange={(v: any) => setRightPanelTab(v)} className="flex-1 flex flex-col">
                 <TabsList className="w-full justify-start rounded-none border-b flex-wrap h-auto">
                  <TabsTrigger value="properties" className="text-xs">Properties</TabsTrigger>
                  <TabsTrigger value="theme" className="text-xs">Theme</TabsTrigger>
                  <TabsTrigger value="pages" className="text-xs">Pages</TabsTrigger>
                  <TabsTrigger value="assets" className="text-xs">Assets</TabsTrigger>
                  <TabsTrigger value="animations" className="text-xs">Animations</TabsTrigger>
                  <TabsTrigger value="responsive" className="text-xs">Responsive</TabsTrigger>
                  <TabsTrigger value="state" className="text-xs">State</TabsTrigger>
                  <TabsTrigger value="api" className="text-xs">API</TabsTrigger>
                  <TabsTrigger value="accessibility" className="text-xs">A11y</TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs">Performance</TabsTrigger>
                  <TabsTrigger value="3d" className="text-xs">3D</TabsTrigger>
                </TabsList>
                <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
                  <PropertiesPanel
                    selectedElement={selectedElement}
                    onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
                  />
                </TabsContent>
                <TabsContent value="theme" className="flex-1 m-0 overflow-hidden">
                  <ThemePanel onApplyTheme={handleApplyTheme} />
                </TabsContent>
                <TabsContent value="pages" className="flex-1 m-0 overflow-hidden">
                  <PageManager
                    pages={pages}
                    currentPageId={currentPageId}
                    onAddPage={handleAddPage}
                    onDeletePage={handleDeletePage}
                    onSelectPage={handleSelectPage}
                    onLinkElements={() => {}}
                  />
                </TabsContent>
                <TabsContent value="assets" className="flex-1 m-0 overflow-hidden">
                  <AssetManager />
                </TabsContent>
                <TabsContent value="animations" className="flex-1 m-0 overflow-hidden">
                  <AdvancedAnimationPanel
                    selectedElement={selectedElement}
                    onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
                  />
                </TabsContent>
                <TabsContent value="responsive" className="flex-1 m-0 overflow-hidden">
                  <ResponsiveEditor
                    selectedElement={selectedElement}
                    onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
                  />
                </TabsContent>
                <TabsContent value="state" className="flex-1 m-0 overflow-hidden">
                  <StateManagementPanel />
                </TabsContent>
                <TabsContent value="api" className="flex-1 m-0 overflow-hidden">
                  <APIPanel />
                </TabsContent>
                <TabsContent value="accessibility" className="flex-1 m-0 overflow-hidden">
                  <AccessibilityPanel
                    elements={elements}
                    selectedElement={selectedElement}
                    onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
                  />
                </TabsContent>
                <TabsContent value="performance" className="flex-1 m-0 overflow-hidden">
                  <PerformancePanel elements={elements} />
                </TabsContent>
                <TabsContent value="3d" className="flex-1 m-0 overflow-hidden">
                  <ThreeDPanel
                    selectedElement={selectedElement}
                    onUpdate={(updates) => selectedId && handleUpdateElement(selectedId, updates)}
                  />
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
