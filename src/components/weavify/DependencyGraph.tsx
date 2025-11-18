import { useEffect, useRef } from "react";
import { WeavifyElement } from "@/types/weavify";
import { Card } from "@/components/ui/card";
import { Network, CircleDot } from "lucide-react";

interface DependencyGraphProps {
  elements: WeavifyElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
}

export const DependencyGraph = ({ elements, selectedId, onSelectElement }: DependencyGraphProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const rotationRef = useRef({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create 3D node positions
    const nodes = elements.map((el, i) => ({
      id: el.id,
      name: el.name,
      type: el.type,
      x: Math.cos(i * 2 * Math.PI / elements.length) * 100,
      y: Math.sin(i * 2 * Math.PI / elements.length) * 100,
      z: Math.sin(i * 0.5) * 50,
      connections: el.children?.map(c => c.id) || []
    }));

    const project3D = (x: number, y: number, z: number) => {
      const perspective = 400;
      const scale = perspective / (perspective + z);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Apply rotation
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);
      
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;
      const x1 = x * cosY - z1 * sinY;
      const z2 = x * sinY + z1 * cosY;
      
      return {
        x: centerX + x1 * scale,
        y: centerY + y1 * scale,
        scale
      };
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Auto-rotate if not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.005;
      }

      // Draw connections
      ctx.strokeStyle = 'rgba(139, 92, 246, 0.3)';
      ctx.lineWidth = 2;
      nodes.forEach(node => {
        const pos = project3D(node.x, node.y, node.z);
        node.connections.forEach(connId => {
          const connNode = nodes.find(n => n.id === connId);
          if (connNode) {
            const connPos = project3D(connNode.x, connNode.y, connNode.z);
            ctx.beginPath();
            ctx.moveTo(pos.x, pos.y);
            ctx.lineTo(connPos.x, connPos.y);
            ctx.stroke();
          }
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const pos = project3D(node.x, node.y, node.z);
        const isSelected = node.id === selectedId;
        const radius = 8 * pos.scale;
        
        // Node circle
        ctx.fillStyle = isSelected ? 'rgba(139, 92, 246, 1)' : 'rgba(139, 92, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Node glow
        if (isSelected) {
          ctx.fillStyle = 'rgba(139, 92, 246, 0.2)';
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, radius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        // Label
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.font = `${10 * pos.scale}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.name, pos.x, pos.y - radius - 5);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Enhanced mouse interaction
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if clicking on a node
      for (const node of nodes) {
        const pos = project3D(node.x, node.y, node.z);
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
        const radius = 8 * pos.scale;
        
        if (distance < radius) {
          onSelectElement(node.id);
          return;
        }
      }
      
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
      canvas.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) {
        // Highlight nodes on hover
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        let hovering = false;
        for (const node of nodes) {
          const pos = project3D(node.x, node.y, node.z);
          const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2));
          const radius = 8 * pos.scale;
          
          if (distance < radius) {
            hovering = true;
            break;
          }
        }
        
        canvas.style.cursor = hovering ? 'pointer' : 'grab';
        return;
      }
      
      const deltaX = e.clientX - lastMouseRef.current.x;
      const deltaY = e.clientY - lastMouseRef.current.y;
      rotationRef.current.y += deltaX * 0.01;
      rotationRef.current.x += deltaY * 0.01;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
      canvas.style.cursor = 'grab';
    };

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Check if clicked on a node
      nodes.forEach(node => {
        const pos = project3D(node.x, node.y, node.z);
        const dist = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        if (dist < 15) {
          onSelectElement(node.id);
        }
      });
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [elements, selectedId, onSelectElement]);

  if (elements.length === 0) {
    return (
      <Card className="p-8 text-center">
        <CircleDot className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
        <p className="text-sm text-muted-foreground">Add elements to see the dependency graph</p>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-full">
      <div className="absolute top-2 left-2 z-10 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        <Network className="w-3 h-3 inline mr-1" />
        Drag to rotate • Click nodes to select
      </div>
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
