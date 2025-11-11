import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Code2, FileCode, Package } from "lucide-react";
import { WeavifyElement } from "@/types/weavify";
import { toast } from "sonner";

interface ExportPanelProps {
  elements: WeavifyElement[];
}

export const ExportPanel = ({ elements }: ExportPanelProps) => {
  const [framework, setFramework] = useState<'react' | 'nextjs' | 'vue' | 'svelte' | 'html'>('react');
  const [styling, setStyling] = useState<'tailwind' | 'css' | 'styled' | 'chakra' | 'mui'>('tailwind');

  const generateReactCode = () => {
    let code = `import React from 'react';\n\n`;
    
    code += `const App = () => {\n`;
    code += `  return (\n`;
    code += `    <div className="min-h-screen">\n`;
    
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => `${key}: '${value}'`)
        .join(', ');
      
      code += `      <div style={{ ${styles} }}>\n`;
      code += `        ${el.content || el.name}\n`;
      code += `      </div>\n`;
    });
    
    code += `    </div>\n`;
    code += `  );\n`;
    code += `};\n\n`;
    code += `export default App;\n`;
    
    return code;
  };

  const generateNextJSCode = () => {
    let code = `'use client';\n\n`;
    code += `import React from 'react';\n\n`;
    
    code += `export default function Page() {\n`;
    code += `  return (\n`;
    code += `    <main className="min-h-screen">\n`;
    
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => `${key}: '${value}'`)
        .join(', ');
      
      code += `      <div style={{ ${styles} }}>\n`;
      code += `        ${el.content || el.name}\n`;
      code += `      </div>\n`;
    });
    
    code += `    </main>\n`;
    code += `  );\n`;
    code += `}\n`;
    
    return code;
  };

  const generateVueCode = () => {
    let code = `<template>\n`;
    code += `  <div class="min-h-screen">\n`;
    
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => `${key}: '${value}'`)
        .join('; ');
      
      code += `    <div :style="{ ${styles} }">\n`;
      code += `      ${el.content || el.name}\n`;
      code += `    </div>\n`;
    });
    
    code += `  </div>\n`;
    code += `</template>\n\n`;
    code += `<script setup>\n`;
    code += `// Your Vue 3 logic here\n`;
    code += `</script>\n`;
    
    return code;
  };

  const generateSvelteCode = () => {
    let code = `<script>\n`;
    code += `  // Your Svelte logic here\n`;
    code += `</script>\n\n`;
    
    code += `<div class="min-h-screen">\n`;
    
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      
      code += `  <div style="${styles}">\n`;
      code += `    ${el.content || el.name}\n`;
      code += `  </div>\n`;
    });
    
    code += `</div>\n`;
    
    return code;
  };

  const generateHTMLCode = () => {
    let code = `<!DOCTYPE html>\n`;
    code += `<html lang="en">\n`;
    code += `<head>\n`;
    code += `  <meta charset="UTF-8">\n`;
    code += `  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n`;
    code += `  <title>Weavify Export</title>\n`;
    
    if (styling === 'tailwind') {
      code += `  <script src="https://cdn.tailwindcss.com"></script>\n`;
    }
    
    code += `</head>\n`;
    code += `<body>\n`;
    
    elements.forEach(el => {
      const styles = Object.entries(el.styles)
        .map(([key, value]) => `${key}: ${value}`)
        .join('; ');
      
      code += `  <div style="${styles}">\n`;
      code += `    ${el.content || el.name}\n`;
      code += `  </div>\n`;
    });
    
    code += `</body>\n`;
    code += `</html>\n`;
    
    return code;
  };

  const getCode = () => {
    switch (framework) {
      case 'react':
        return generateReactCode();
      case 'nextjs':
        return generateNextJSCode();
      case 'vue':
        return generateVueCode();
      case 'svelte':
        return generateSvelteCode();
      case 'html':
        return generateHTMLCode();
      default:
        return '';
    }
  };

  const handleExport = () => {
    const code = getCode();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weavify-export.${framework === 'html' ? 'html' : framework === 'vue' ? 'vue' : framework === 'svelte' ? 'svelte' : 'jsx'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported as ${framework.toUpperCase()}`);
  };

  const copyCode = () => {
    const code = getCode();
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Export Project</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs mb-1">Framework</Label>
            <Select value={framework} onValueChange={(v: any) => setFramework(v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
                <SelectItem value="nextjs">Next.js</SelectItem>
                <SelectItem value="vue">Vue 3</SelectItem>
                <SelectItem value="svelte">Svelte</SelectItem>
                <SelectItem value="html">HTML/CSS/JS</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1">Styling</Label>
            <Select value={styling} onValueChange={(v: any) => setStyling(v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                <SelectItem value="css">Plain CSS</SelectItem>
                <SelectItem value="styled">Styled Components</SelectItem>
                <SelectItem value="chakra">Chakra UI</SelectItem>
                <SelectItem value="mui">Material UI</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button size="sm" onClick={handleExport} className="flex-1">
            <Download className="w-3 h-3 mr-1" />
            Download
          </Button>
          <Button size="sm" variant="outline" onClick={copyCode} className="flex-1">
            <Code2 className="w-3 h-3 mr-1" />
            Copy Code
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b">
          <TabsTrigger value="preview" className="text-xs">
            <FileCode className="w-3 h-3 mr-1" />
            Code Preview
          </TabsTrigger>
          <TabsTrigger value="package" className="text-xs">
            <Package className="w-3 h-3 mr-1" />
            Package Info
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="flex-1 m-0">
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono bg-muted/20">
              <code>{getCode()}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="package" className="flex-1 m-0 p-4">
          <ScrollArea className="h-full">
            <div className="space-y-3">
              <Card className="p-3">
                <h4 className="text-xs font-semibold mb-2">Dependencies</h4>
                <div className="space-y-1 text-xs text-muted-foreground font-mono">
                  {framework === 'react' && (
                    <>
                      <p>"react": "^18.3.1"</p>
                      <p>"react-dom": "^18.3.1"</p>
                    </>
                  )}
                  {framework === 'nextjs' && (
                    <>
                      <p>"next": "^15.0.0"</p>
                      <p>"react": "^18.3.1"</p>
                      <p>"react-dom": "^18.3.1"</p>
                    </>
                  )}
                  {framework === 'vue' && (
                    <p>"vue": "^3.4.0"</p>
                  )}
                  {framework === 'svelte' && (
                    <p>"svelte": "^4.2.0"</p>
                  )}
                  {styling === 'tailwind' && framework !== 'html' && (
                    <>
                      <p>"tailwindcss": "^3.4.0"</p>
                      <p>"autoprefixer": "^10.4.0"</p>
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-3">
                <h4 className="text-xs font-semibold mb-2">Setup Instructions</h4>
                <ol className="space-y-2 text-xs text-muted-foreground list-decimal list-inside">
                  <li>Create a new {framework} project</li>
                  <li>Install required dependencies</li>
                  <li>Copy the exported code to your project</li>
                  <li>Configure {styling} if needed</li>
                  <li>Run the development server</li>
                </ol>
              </Card>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
