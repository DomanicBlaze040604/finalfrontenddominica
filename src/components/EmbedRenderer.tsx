import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface EmbedRendererProps {
  content: string;
}

export const EmbedRenderer = ({ content }: EmbedRendererProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [showReloadButton, setShowReloadButton] = useState(false);
  const [isReloading, setIsReloading] = useState(false);

  const processEmbeds = () => {
    if (!contentRef.current) return;

    // Process Twitter
    if ((window as any).twttr?.widgets) {
      (window as any).twttr.widgets.load(contentRef.current);
    }

    // Process Instagram
    if ((window as any).instgrm?.Embeds) {
      (window as any).instgrm.Embeds.process();
    }
  };

  useEffect(() => {
    if (!contentRef.current) return;

    const hasEmbeds = content.includes('twitter-tweet') || 
                      content.includes('instagram-media') || 
                      content.includes('twitter.com') || 
                      content.includes('instagram.com');

    if (hasEmbeds) {
      // Show reload button after 5 seconds if embeds might not have loaded
      const buttonTimer = setTimeout(() => {
        setShowReloadButton(true);
      }, 5000);

      return () => clearTimeout(buttonTimer);
    }
  }, [content]);

  useEffect(() => {
    if (!contentRef.current) return;
    
    // Load and process Twitter embeds
    const loadTwitter = () => {
      const hasTwitter = content.includes('twitter-tweet') || content.includes('twitter.com');
      if (!hasTwitter) return;

      if (!(window as any).twttr) {
        const script = document.createElement('script');
        script.src = 'https://platform.twitter.com/widgets.js';
        script.async = true;
        script.onload = () => {
          setTimeout(() => processEmbeds(), 300);
        };
        document.body.appendChild(script);
      } else {
        setTimeout(() => processEmbeds(), 300);
      }
    };

    // Load and process Instagram embeds
    const loadInstagram = () => {
      const hasInstagram = content.includes('instagram-media') || content.includes('instagram.com');
      if (!hasInstagram) return;

      if (!(window as any).instgrm) {
        const script = document.createElement('script');
        script.src = 'https://www.instagram.com/embed.js';
        script.async = true;
        script.onload = () => {
          setTimeout(() => processEmbeds(), 300);
        };
        document.body.appendChild(script);
      } else {
        setTimeout(() => processEmbeds(), 300);
      }
    };

    // Load and process TikTok embeds
    const loadTikTok = () => {
      const hasTikTok = content.includes('tiktok-embed') || content.includes('tiktok.com');
      if (!hasTikTok) return;

      if (!(window as any).TikTokEmbed) {
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      }
    };

    // Load all embed scripts
    loadTwitter();
    loadInstagram();
    loadTikTok();

    // Aggressive retry processing - try every second for 10 seconds
    const retryTimers: NodeJS.Timeout[] = [];
    
    [500, 1000, 1500, 2000, 3000, 4000, 5000, 7000, 10000].forEach((delay) => {
      const timer = setTimeout(() => processEmbeds(), delay);
      retryTimers.push(timer);
    });

    return () => {
      retryTimers.forEach(timer => clearTimeout(timer));
    };
  }, [content]);

  const handleReload = () => {
    setIsReloading(true);
    processEmbeds();
    setTimeout(() => {
      setIsReloading(false);
      setShowReloadButton(false);
    }, 2000);
  };

  // Clean content by removing script tags
  const cleanContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  const hasEmbeds = content.includes('instagram-media') || content.includes('twitter-tweet');

  return (
    <>
      <div
        ref={contentRef}
        className="prose prose-lg max-w-none article-content-embeds"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
      
      {showReloadButton && hasEmbeds && (
        <div className="flex justify-center my-6">
          <Button
            onClick={handleReload}
            variant="outline"
            size="sm"
            disabled={isReloading}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isReloading ? 'animate-spin' : ''}`} />
            {isReloading ? 'Reloading embeds...' : 'Embeds not loading? Click to reload'}
          </Button>
        </div>
      )}

      {hasEmbeds && (
        <style>{`
          .instagram-media, .twitter-tweet {
            min-height: 400px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .instagram-media:not(.instagram-media-rendered),
          .twitter-tweet:not(.twitter-tweet-rendered) {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      )}
    </>
  );
};
