import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, ExternalLink, AlertCircle } from 'lucide-react';
import type { Embed } from '@/lib/api/types';

interface UniversalEmbedProps {
  embed: Embed;
}

export const UniversalEmbed = ({ embed }: UniversalEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  // Aggressive embed loading with multiple retries
  useEffect(() => {
    if (!embed.url && !embed.embedCode) return;

    const loadEmbed = () => {
      try {
        switch (embed.type.toLowerCase()) {
          case 'instagram':
            loadInstagram();
            break;
          case 'twitter':
          case 'x':
            loadTwitter();
            break;
          case 'facebook':
            loadFacebook();
            break;
          case 'tiktok':
            loadTikTok();
            break;
          default:
            setIsLoading(false);
        }
      } catch (error) {
        console.error('Embed loading error:', error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    // Initial load
    loadEmbed();

    // Aggressive retry strategy - try multiple times
    const retryTimers = [
      setTimeout(loadEmbed, 500),
      setTimeout(loadEmbed, 1000),
      setTimeout(loadEmbed, 2000),
      setTimeout(loadEmbed, 3000),
      setTimeout(loadEmbed, 5000),
    ];

    // Mark as loaded after 6 seconds
    const loadingTimer = setTimeout(() => setIsLoading(false), 6000);

    return () => {
      retryTimers.forEach(timer => clearTimeout(timer));
      clearTimeout(loadingTimer);
    };
  }, [embed.type, embed.url, embed.embedCode, retryCount]);

  const loadInstagram = () => {
    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).instgrm?.Embeds) {
            (window as any).instgrm.Embeds.process();
            setIsLoading(false);
          }
        }, 100);
      };
      script.onerror = () => setHasError(true);
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        if ((window as any).instgrm?.Embeds) {
          (window as any).instgrm.Embeds.process();
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const loadTwitter = () => {
    if (!(window as any).twttr) {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      script.charset = 'utf-8';
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).twttr?.widgets) {
            (window as any).twttr.widgets.load(containerRef.current);
            setIsLoading(false);
          }
        }, 100);
      };
      script.onerror = () => setHasError(true);
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        if ((window as any).twttr?.widgets) {
          (window as any).twttr.widgets.load(containerRef.current);
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const loadFacebook = () => {
    // Create fb-root if it doesn't exist
    if (!document.getElementById('fb-root')) {
      const fbRoot = document.createElement('div');
      fbRoot.id = 'fb-root';
      document.body.insertBefore(fbRoot, document.body.firstChild);
    }

    if (!(window as any).FB) {
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
      script.async = true;
      script.defer = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).FB?.XFBML) {
            (window as any).FB.XFBML.parse(containerRef.current);
            setIsLoading(false);
          }
        }, 100);
      };
      script.onerror = () => setHasError(true);
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        if ((window as any).FB?.XFBML) {
          (window as any).FB.XFBML.parse(containerRef.current);
          setIsLoading(false);
        }
      }, 100);
    }
  };

  const loadTikTok = () => {
    if (!(window as any).TikTokEmbed) {
      const script = document.createElement('script');
      script.src = 'https://www.tiktok.com/embed.js';
      script.async = true;
      script.onload = () => setIsLoading(false);
      script.onerror = () => setHasError(true);
      document.body.appendChild(script);
    } else {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setIsLoading(true);
    setHasError(false);
    setRetryCount(prev => prev + 1);
  };

  // If custom embed code is provided, use it directly
  if (embed.embedCode) {
    return (
      <div ref={containerRef} className="embed-container my-8">
        <div className="max-w-3xl mx-auto">
          {isLoading && (
            <div className="flex items-center justify-center p-8 bg-muted rounded-lg animate-pulse">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading embed...</p>
              </div>
            </div>
          )}
          <div 
            className="embed-content"
            dangerouslySetInnerHTML={{ __html: embed.embedCode }}
            style={{
              width: embed.width || '100%',
              minHeight: isLoading ? '400px' : 'auto',
            }}
          />
          {embed.caption && (
            <p className="text-sm text-muted-foreground text-center mt-3 italic">
              {embed.caption}
            </p>
          )}
          {hasError && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Embed failed to load</span>
              </div>
              <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle specific embed types by URL
  const renderEmbed = () => {
    const url = embed.url || '';

    switch (embed.type.toLowerCase()) {
      case 'instagram': {
        return (
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            style={{ 
              background: '#FFF',
              border: '0',
              borderRadius: '3px',
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
              margin: '1px auto',
              maxWidth: '540px',
              minWidth: '326px',
              padding: '0',
              width: 'calc(100% - 2px)',
              minHeight: isLoading ? '400px' : 'auto',
            }}
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
        );
      }

      case 'twitter':
      case 'x': {
        const tweetId = url.split('/status/')[1]?.split('?')[0];
        
        if (!tweetId) {
          return (
            <div className="p-6 border-2 border-dashed rounded-lg bg-muted text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-2">Invalid Twitter URL</p>
              <p className="text-xs text-muted-foreground">
                Format: https://twitter.com/username/status/123456789
              </p>
              <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline mt-2 inline-flex items-center gap-1">
                Open link <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          );
        }

        return (
          <div className="twitter-embed-wrapper" style={{ maxWidth: '550px', margin: '0 auto' }}>
            <blockquote 
              className="twitter-tweet" 
              data-theme="light"
              data-dnt="true"
              data-lang="en"
              style={{ minHeight: isLoading ? '400px' : 'auto' }}
            >
              <a href={url} target="_blank" rel="noopener noreferrer">
                View this post on Twitter
              </a>
            </blockquote>
          </div>
        );
      }

      case 'youtube': {
        const youtubeId = url.includes('watch?v=')
          ? url.split('watch?v=')[1]?.split('&')[0]
          : url.split('/').pop()?.split('?')[0];
        
        if (!youtubeId) {
          return (
            <div className="p-6 border-2 border-dashed rounded-lg bg-muted text-center">
              <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Invalid YouTube URL</p>
            </div>
          );
        }

        return (
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        );
      }

      case 'vimeo': {
        const vimeoId = url.split('/').pop()?.split('?')[0];
        return (
          <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://player.vimeo.com/video/${vimeoId}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            />
          </div>
        );
      }

      case 'tiktok': {
        const videoId = url.split('/video/')[1]?.split('?')[0];
        return (
          <blockquote
            className="tiktok-embed"
            cite={url}
            data-video-id={videoId}
            style={{ 
              maxWidth: '605px', 
              minWidth: '325px', 
              margin: '0 auto',
              minHeight: isLoading ? '600px' : 'auto',
            }}
          >
            <section>
              <a href={url} target="_blank" rel="noopener noreferrer">
                View on TikTok
              </a>
            </section>
          </blockquote>
        );
      }

      case 'spotify': {
        const spotifyId = url.split('/').pop()?.split('?')[0];
        const spotifyType = url.includes('/track/') ? 'track' : 
                           url.includes('/playlist/') ? 'playlist' : 
                           url.includes('/album/') ? 'album' : 'track';
        return (
          <iframe
            src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}`}
            width="100%"
            height="380"
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-lg"
          />
        );
      }

      case 'soundcloud': {
        return (
          <iframe
            width="100%"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            className="rounded-lg"
          />
        );
      }

      case 'facebook': {
        return (
          <div className="fb-post" data-href={url} data-width="500" data-show-text="true">
            <blockquote cite={url} className="fb-xfbml-parse-ignore">
              <a href={url} target="_blank" rel="noopener noreferrer">
                View this post on Facebook
              </a>
            </blockquote>
          </div>
        );
      }

      case 'codepen': {
        const codepenUser = url.split('/pen/')[0]?.split('/').pop();
        const codepenId = url.split('/pen/')[1]?.split('/')[0];
        return (
          <iframe
            height={embed.height || '400'}
            style={{ width: '100%' }}
            scrolling="no"
            title="CodePen Embed"
            src={`https://codepen.io/${codepenUser}/embed/${codepenId}?default-tab=result`}
            frameBorder="no"
            loading="lazy"
            allowFullScreen
            className="rounded-lg"
          />
        );
      }

      case 'google-maps':
      case 'maps': {
        return (
          <iframe
            src={url}
            width="100%"
            height={embed.height || '450'}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        );
      }

      default: {
        // Generic iframe for any other URL
        return (
          <iframe
            src={url}
            width="100%"
            height={embed.height || '400'}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          />
        );
      }
    }
  };

  return (
    <div ref={containerRef} className="embed-container my-8">
      <div className="max-w-3xl mx-auto">
        {isLoading && (
          <div className="flex items-center justify-center p-8 bg-muted rounded-lg animate-pulse mb-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading {embed.type} embed...</p>
            </div>
          </div>
        )}
        <div className={isLoading ? 'opacity-50' : ''}>
          {renderEmbed()}
        </div>
        {embed.caption && (
          <p className="text-sm text-muted-foreground text-center mt-3 italic">
            {embed.caption}
          </p>
        )}
        {hasError && (
          <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <div className="flex items-center gap-2 text-destructive mb-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Embed failed to load</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRetry} size="sm" variant="outline" className="gap-2">
                <RefreshCw className="h-3 w-3" />
                Retry
              </Button>
              <a href={embed.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" variant="outline" className="gap-2">
                  <ExternalLink className="h-3 w-3" />
                  Open Original
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Extend Window interface for embed scripts
declare global {
  interface Window {
    instgrm?: any;
    twttr?: any;
    TikTokEmbed?: any;
    FB?: any;
  }
}
