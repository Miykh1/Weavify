import { useState } from "react";
import { WeavifyElement } from "@/types/weavify";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface CodePanelProps {
  elements: WeavifyElement[];
}

export const CodePanel = ({ elements }: CodePanelProps) => {
  const [copied, setCopied] = useState(false);

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
    let code = 'import React from "react";\n\n';
    code += 'const WeavifyExport = () => {\n';
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

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-80 glass-panel border-t flex flex-col">
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <TabsList>
            <TabsTrigger value="html" className="text-xs">HTML</TabsTrigger>
            <TabsTrigger value="css" className="text-xs">CSS</TabsTrigger>
            <TabsTrigger value="react" className="text-xs">React</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="html" className="flex-1 m-0 relative">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10"
            onClick={() => copyCode(generateHTML())}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono">
              <code>{generateHTML()}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="css" className="flex-1 m-0 relative">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10"
            onClick={() => copyCode(generateCSS())}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono">
              <code>{generateCSS()}</code>
            </pre>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="react" className="flex-1 m-0 relative">
          <Button
            size="sm"
            variant="ghost"
            className="absolute top-2 right-2 z-10"
            onClick={() => copyCode(generateReact())}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
          <ScrollArea className="h-full">
            <pre className="p-4 text-xs font-mono">
              <code>{generateReact()}</code>
            </pre>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};
