import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Play, Pause, SkipBack, SkipForward, Clock } from "lucide-react";

interface Keyframe {
  id: string;
  time: number;
  property: string;
  value: any;
}

export const TimelineEditor = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(5000);
  const [keyframes] = useState<Keyframe[]>([]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Animation Timeline</h3>
        
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
            <SkipBack className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="h-7 w-7 p-0"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
          </Button>
          <Button size="sm" variant="outline" className="h-7 w-7 p-0">
            <SkipForward className="w-3 h-3" />
          </Button>
          <div className="flex-1 mx-3">
            <Slider
              value={[currentTime]}
              onValueChange={([v]) => setCurrentTime(v)}
              max={duration}
              step={10}
              className="flex-1"
            />
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            {Math.round(currentTime)}ms / {duration}ms
          </span>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="flex-1 relative overflow-auto">
        {keyframes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No keyframes yet</p>
              <p className="text-xs mt-1">Add animations to see timeline</p>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <Card className="p-4 bg-muted/20">
              <div className="relative h-16 bg-background/50 rounded">
                {/* Timeline markers */}
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-muted-foreground/20"
                    style={{ left: `${i * 10}%` }}
                  >
                    <span className="text-xs text-muted-foreground ml-1">
                      {Math.round((duration * i) / 10)}ms
                    </span>
                  </div>
                ))}
                {/* Current time indicator */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-primary"
                  style={{ left: `${(currentTime / duration) * 100}%` }}
                />
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
