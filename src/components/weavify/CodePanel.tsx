import { useState } from "react";
import { WeavifyElement } from "@/types/weavify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check, Download, Code2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface CodePanelProps {
  elements: WeavifyElement[];
}

export const CodePanel = ({ elements }: CodePanelProps) => {
  const [copied, setCopied] = useState(false);
  const [useTypeScript, setUseTypeScript] = useState(true);
  const [showLineNumbers, setShowLineNumbers] = useState(true);

  const generateHTML = () => {
    let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
    html += '  <meta charset="UTF-8">\n';
    html += '  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
    html += '  <title>Weavify Export</title>\n';
    html += '  <style>\n    ' + generateCSS() + '\n  </style>\n';
    html += '</head>\n<body>\n';
    
    elements.forEach(element => {
      html += generateElementHTML(element, 1);
    });
    
    html += '</body>\n</html>';
    return html;
  };

  const generateCSS = () => {
    let css = '* { margin: 0; padding: 0; box-sizing: border-box; }\n';
    css += 'body { font-family: system-ui, -apple-system, sans-serif; }\n';
    
    elements.forEach(element => {
      css += generateElementCSS(element);
    });
    
    return css;
  };

  const generateElementHTML = (element: WeavifyElement, indent: number = 0): string => {
    const spaces = '  '.repeat(indent);
    const tag = element.type === 'button' ? 'button' : 'div';
    let html = `${spaces}<${tag} class="el-${element.id}">\n`;
    
    if (element.content) {
      html += `${spaces}  ${element.content}\n`;
    }
    
    if (element.children) {
      element.children.forEach(child => {
        html += generateElementHTML(child, indent + 1);
      });
    }
    
    html += `${spaces}</${tag}>\n`;
    return html;
  };

  const generateElementCSS = (element: WeavifyElement): string => {
    let css = `.el-${element.id} {\n`;
    css += `  position: absolute;\n`;
    css += `  left: ${element.x}px;\n`;
    css += `  top: ${element.y}px;\n`;
    css += `  width: ${element.width}px;\n`;
    css += `  height: ${element.height}px;\n`;
    
    Object.entries(element.styles).forEach(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      css += `  ${cssKey}: ${value}${typeof value === 'number' && !['opacity', 'zIndex'].includes(key) ? 'px' : ''};\n`;
    });
    
    css += '}\n\n';
    return css;
  };

  const generateReact = () => {
    let code = useTypeScript 
      ? 'import React from "react";\nimport { CSSProperties } from "react";\n\n'
      : 'import React from "react";\n\n';
    
    code += useTypeScript 
      ? 'const WeavifyExport: React.FC = () => {\n'
      : 'const WeavifyExport = () => {\n';
    
    code += '  return (\n';
    code += '    <div className="weavify-root">\n';
    
    elements.forEach(element => {
      code += generateReactElement(element, 3);
    });
    
    code += '    </div>\n';
    code += '  );\n';
    code += '};\n\n';
    code += 'export default WeavifyExport;';
    return code;
  };

  const generateReactElement = (element: WeavifyElement, indent: number): string => {
    const spaces = '  '.repeat(indent);
    const Component = element.type === 'button' ? 'button' : 'div';
    
    let code = `${spaces}<${Component}\n`;
    code += `${spaces}  className="el-${element.id}"\n`;
    code += `${spaces}  style={{\n`;
    
    Object.entries(element.styles).forEach(([key, value]) => {
      code += `${spaces}    ${key}: "${value}",\n`;
    });
    
    code += `${spaces}  }}\n`;
    code += `${spaces}>\n`;
    
    if (element.content) {
      code += `${spaces}  ${element.content}\n`;
    }
    
    code += `${spaces}</${Component}>\n`;
    return code;
  };

  const copyCode = (code: string, language: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success(`${language} code copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = (code: string, filename: string) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  const addLineNumbers = (code: string) => {
    if (!showLineNumbers) return code;
    return code.split('\n').map((line, i) => 
      `${String(i + 1).padStart(3, ' ')} | ${line}`
    ).join('\n');
  };

  return (
    <div className="h-full glass-panel flex flex-col overflow-hidden">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-4">
            <TabsList>
              <TabsTrigger value="html" className="text-xs">
                <Code2 className="w-3 h-3 mr-1" />
                HTML
              </TabsTrigger>
              <TabsTrigger value="css" className="text-xs">
                <Code2 className="w-3 h-3 mr-1" />
                CSS
              </TabsTrigger>
              <TabsTrigger value="react" className="text-xs">
                <Code2 className="w-3 h-3 mr-1" />
                React
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                id="line-numbers"
                checked={showLineNumbers}
                onCheckedChange={setShowLineNumbers}
              />
              <Label htmlFor="line-numbers" className="text-xs cursor-pointer">
                Line #
              </Label>
            </div>
          </div>
        </div>

        <TabsContent value="html" className="flex-1 m-0 relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Badge variant="secondary" className="text-xs">
              HTML5
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadCode(generateHTML(), 'weavify-export.html')}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyCode(generateHTML(), 'HTML')}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono bg-muted/10">
              <code className="text-foreground">{addLineNumbers(generateHTML())}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0 relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <Badge variant="secondary" className="text-xs">
              CSS3
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadCode(generateCSS(), 'weavify-styles.css')}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyCode(generateCSS(), 'CSS')}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono bg-muted/10">
              <code className="text-foreground">{addLineNumbers(generateCSS())}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="react" className="flex-1 m-0 relative">
          <div className="absolute top-2 right-2 z-10 flex gap-2">
            <div className="flex items-center gap-2 mr-2">
              <Switch
                id="typescript"
                checked={useTypeScript}
                onCheckedChange={setUseTypeScript}
              />
              <Label htmlFor="typescript" className="text-xs cursor-pointer">
                TypeScript
              </Label>
            </div>
            <Badge variant="secondary" className="text-xs">
              {useTypeScript ? 'TypeScript' : 'JavaScript'}
            </Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => downloadCode(
                generateReact(), 
                `WeavifyExport.${useTypeScript ? 'tsx' : 'jsx'}`
              )}
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => copyCode(generateReact(), useTypeScript ? 'TypeScript' : 'JavaScript')}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono bg-muted/10">
              <code className="text-foreground">{addLineNumbers(generateReact())}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
