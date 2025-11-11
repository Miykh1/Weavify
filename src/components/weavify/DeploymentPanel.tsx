import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Rocket, Globe, Server, Cloud, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export const DeploymentPanel = () => {
  const [platform, setPlatform] = useState<'vercel' | 'netlify' | 'github' | 'aws' | 'firebase'>('vercel');
  const [domain, setDomain] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');

  const platforms = [
    { value: 'vercel', label: 'Vercel', icon: Rocket, description: 'Optimal for Next.js & React' },
    { value: 'netlify', label: 'Netlify', icon: Cloud, description: 'Great for static sites' },
    { value: 'github', label: 'GitHub Pages', icon: Server, description: 'Free static hosting' },
    { value: 'aws', label: 'AWS S3', icon: Cloud, description: 'Scalable cloud hosting' },
    { value: 'firebase', label: 'Firebase', icon: Server, description: 'Google cloud platform' },
  ];

  const handleDeploy = async () => {
    setDeploymentStatus('deploying');
    toast.info(`Deploying to ${platform}...`);
    
    // Simulate deployment
    setTimeout(() => {
      setDeploymentStatus('success');
      toast.success(`Successfully deployed to ${platform}!`);
    }, 3000);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-sm font-semibold text-gradient mb-3">Deploy Project</h3>
        
        <div className="space-y-3">
          <div>
            <Label className="text-xs mb-1">Platform</Label>
            <Select value={platform} onValueChange={(v: any) => setPlatform(v)}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platforms.map(p => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs mb-1">Custom Domain (Optional)</Label>
            <Input
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="www.mysite.com"
              className="h-8 text-xs"
            />
          </div>

          <Button
            size="sm"
            onClick={handleDeploy}
            disabled={deploymentStatus === 'deploying'}
            className="w-full"
          >
            {deploymentStatus === 'deploying' ? (
              <>Deploying...</>
            ) : (
              <>
                <Rocket className="w-3 h-3 mr-1" />
                Deploy Now
              </>
            )}
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          {platforms.map(p => (
            <Card key={p.value} className={`p-3 ${platform === p.value ? 'ring-2 ring-primary' : ''}`}>
              <div className="flex items-start gap-2">
                <p.icon className="w-4 h-4 mt-0.5 text-primary" />
                <div className="flex-1">
                  <p className="text-xs font-semibold">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.description}</p>
                </div>
              </div>
            </Card>
          ))}

          {deploymentStatus === 'success' && (
            <Card className="p-3 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <div>
                  <p className="text-xs font-semibold">Deployment Successful</p>
                  <p className="text-xs text-muted-foreground">Your site is now live!</p>
                  {domain && (
                    <a
                      href={`https://${domain}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary underline mt-1 inline-block"
                    >
                      Visit Site
                    </a>
                  )}
                </div>
              </div>
            </Card>
          )}

          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">SEO Configuration</h4>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Meta Title</Label>
                <Input placeholder="My Awesome Site" className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Meta Description</Label>
                <Input placeholder="Description for search engines" className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Keywords</Label>
                <Input placeholder="website, builder, design" className="h-7 text-xs" />
              </div>
            </div>
          </Card>

          <Card className="p-3">
            <h4 className="text-xs font-semibold mb-2">Analytics</h4>
            <div className="space-y-2">
              <div>
                <Label className="text-xs">Google Analytics ID</Label>
                <Input placeholder="G-XXXXXXXXXX" className="h-7 text-xs" />
              </div>
              <div>
                <Label className="text-xs">Facebook Pixel ID</Label>
                <Input placeholder="123456789" className="h-7 text-xs" />
              </div>
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
