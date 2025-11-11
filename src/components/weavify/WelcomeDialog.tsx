import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Code, Layers, Zap } from "lucide-react";

export const WelcomeDialog = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('weavify-welcome-seen');
    if (!hasSeenWelcome) {
      setOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('weavify-welcome-seen', 'true');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl glass-panel border-primary/20">
        <DialogHeader>
          <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4 glow-primary-lg animate-float">
            <Layers className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-3xl text-center text-gradient">
            Welcome to Weavify
          </DialogTitle>
          <DialogDescription className="text-center text-base mt-2">
            Build production-grade websites visually, like a game
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          <div className="glass-panel p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Visual Building</h3>
            <p className="text-sm text-muted-foreground">
              Drag, drop, and customize elements with a game-like interface
            </p>
          </div>

          <div className="glass-panel p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center mb-3">
              <Code className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Code Sync</h3>
            <p className="text-sm text-muted-foreground">
              Every visual change generates clean, production-ready code
            </p>
          </div>

          <div className="glass-panel p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all">
            <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center mb-3">
              <Zap className="w-5 h-5 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">Export Ready</h3>
            <p className="text-sm text-muted-foreground">
              Export to React, Vue, HTML, or any framework instantly
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Quick Start:</h4>
          <ol className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">1.</span>
              Drag components from the left panel onto the canvas
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">2.</span>
              Click elements to select and customize in the properties panel
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">3.</span>
              View generated code in real-time at the bottom panel
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">4.</span>
              Export your creation when ready!
            </li>
          </ol>
        </div>

        <div className="flex gap-2 mt-6">
          <Button
            variant="gradient"
            className="flex-1"
            onClick={handleClose}
          >
            Start Building
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
