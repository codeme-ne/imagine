'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Sparkles, Palette, Globe, Zap } from 'lucide-react';

interface InteractiveDemoProps {
  sampleUrls: string[];
}

const styleOptions = [
  { 
    id: 'ghibli', 
    name: 'GHIBLI', 
    color: 'from-green-400 to-blue-500',
    description: 'Studio Ghibli inspired'
  },
  { 
    id: 'lego', 
    name: 'LEGO', 
    color: 'from-red-500 to-yellow-500',
    description: 'LEGO brick construction'
  },
  { 
    id: 'logo', 
    name: 'LOGO', 
    color: 'from-purple-500 to-pink-500',
    description: 'Clean vector art'
  },
  { 
    id: 'whimsical', 
    name: 'WHIMSICAL', 
    color: 'from-pink-400 to-purple-400',
    description: 'Storybook illustration'
  },
];

export default function InteractiveDemo({ sampleUrls }: InteractiveDemoProps) {
  const [selectedStyle, setSelectedStyle] = useState('ghibli');
  const [selectedUrl, setSelectedUrl] = useState(sampleUrls[0] || '');
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="w-full space-y-6">
      {/* Demo Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 text-primary">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-semibold uppercase tracking-wide">Interactive Demo</span>
        </div>
        <h3 className="text-2xl font-bold">Try It Yourself</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select a website and style to see how PageTopic transforms web content into stunning visuals
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Controls Section */}
        <div className="space-y-4">
          {/* URL Selection */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Globe className="h-4 w-4 text-primary" />
                <span>Sample Websites</span>
              </div>
              <div className="space-y-2">
                {sampleUrls.map((url) => (
                  <button
                    key={url}
                    onClick={() => setSelectedUrl(url)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                      "hover:bg-accent hover:text-accent-foreground",
                      selectedUrl === url 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground"
                    )}
                  >
                    {url}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Style Selection */}
          <Card className="p-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Palette className="h-4 w-4 text-primary" />
                <span>Image Style</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {styleOptions.map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setSelectedStyle(style.id)}
                    className={cn(
                      "relative p-3 rounded-lg transition-all",
                      "hover:scale-105 hover:shadow-md",
                      selectedStyle === style.id 
                        ? "ring-2 ring-primary ring-offset-2" 
                        : "border border-border"
                    )}
                  >
                    <div className={cn(
                      "h-2 w-full rounded-full bg-gradient-to-r mb-2",
                      style.color
                    )} />
                    <div className="text-xs font-medium">{style.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {style.description}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* CTA Button */}
          <Button 
            className="w-full group"
            size="lg"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Zap className={cn(
              "mr-2 h-4 w-4 transition-transform",
              isHovering && "rotate-12"
            )} />
            Generate Your Own
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Preview Section */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
          <div className="absolute inset-0 bg-grid-gray-200/50 dark:bg-grid-gray-700/50 [mask-image:radial-gradient(ellipse_at_center,transparent,black)]" />
          <div className="relative p-6 flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              {/* Animated transformation indicator */}
              <div className="relative mx-auto w-32 h-32">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe className="h-12 w-12 text-primary/30" />
                </div>
                <div className="absolute inset-0 animate-spin-slow">
                  <div className="h-full w-full rounded-full border-2 border-dashed border-primary/20" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary animate-pulse" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center translate-x-16">
                  <Sparkles className="h-12 w-12 text-primary" />
                </div>
              </div>
              
              {/* Dynamic content based on selection */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Selected URL:</p>
                <p className="text-xs text-muted-foreground max-w-xs mx-auto truncate">
                  {selectedUrl}
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Style: {styleOptions.find(s => s.id === selectedStyle)?.name}</p>
                <p className="text-xs text-muted-foreground">
                  {styleOptions.find(s => s.id === selectedStyle)?.description}
                </p>
              </div>

              {/* Sample result placeholder */}
              <div className={cn(
                "mx-auto w-48 h-48 rounded-lg bg-gradient-to-br",
                styleOptions.find(s => s.id === selectedStyle)?.color,
                "opacity-20 animate-pulse"
              )} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}