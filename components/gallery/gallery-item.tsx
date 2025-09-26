'use client';

import { useState } from 'react';

import Link from 'next/link';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Eye, Heart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItemProps {
  item: {
    id: string;
    title: string;
    beforeImage: string;
    afterImage: string;
    style: string;
    industry: string;
    useCase: string;
    prompt: string;
    dateCreated: string;
    likes: number;
    views: number;
  };
}

export default function GalleryItem({ item }: GalleryItemProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  
  const copyPromptToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      toast.success('Prompt copied to clipboard!');
    } catch {
      toast.error('Failed to copy prompt');
    }
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    // In a real app, this would update the backend
  };
  
  return (
    <Card className="overflow-hidden group">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{item.title}</CardTitle>
        <div className="flex gap-2 mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
            {item.style}
          </span>
          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
            {item.industry}
          </span>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Before/After Slider */}
        <div className="relative aspect-video w-full overflow-hidden">
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={item.beforeImage}
                alt={`${item.title} - Original`}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={item.afterImage}
                alt={`${item.title} - ${item.style} style`}
              />
            }
            position={50}
            className="w-full h-full"
          />
        </div>
        
        {/* Prompt Section */}
        <div className="p-4">
          {showPrompt ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">Prompt</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={copyPromptToClipboard}
                  aria-label="Copy prompt to clipboard"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground bg-secondary/50 p-3 rounded-md">
                {item.prompt}
              </p>
              <button
                onClick={() => setShowPrompt(false)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Hide prompt
              </button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowPrompt(true)}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Reveal the Magic
            </Button>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col gap-3 pt-0">
        {/* Stats */}
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 transition-colors ${
                isLiked ? 'text-red-500' : 'hover:text-foreground'
              }`}
              aria-label={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{isLiked ? item.likes + 1 : item.likes}</span>
            </button>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {item.views}
            </span>
          </div>
          <time className="text-xs">
            {new Date(item.dateCreated).toLocaleDateString()}
          </time>
        </div>
        
        {/* Try This Style CTA */}
        <Link 
          href={{
            pathname: '/',
            query: { style: item.style.toLowerCase().replace(/\s+/g, '-') }
          }}
          className="w-full"
        >
          <Button className="w-full" size="sm">
            Try {item.style} Style
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}