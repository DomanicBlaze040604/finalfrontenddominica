import { useEffect, useState } from 'react';

interface InstagramEmbedProps {
  url: string;
  caption?: string;
}

export const InstagramEmbed = ({ url, caption }: InstagramEmbedProps) => {
  const [embedHtml, setEmbedHtml] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Extract post ID from URL
    const getPostId = (instagramUrl: string) => {
      const match = instagramUrl.match(/\/p\/([^\/\?]+)/);
      return match ? match[1] : null;
    };

    const postId = getPostId(url);
    
    if (!postId) {
      setError(true);
      setLoading(false);
      return;
    }

    // Try to load Instagram embed
    const loadEmbed = async () => {
      try {
        // Use Instagram's oEmbed API
        const response = await fetch(
          `https://graph.facebook.com/v12.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=YOUR_ACCESS_TOKEN`
        );
        
        if (response.ok) {
          const data = await response.json();
          setEmbedHtml(data.html);
          setLoading(false);
          
          // Process the embed
          setTimeout(() => {
            if ((window as any).instgrm?.Embeds) {
              (window as any).instgrm.Embeds.process();
            }
          }, 100);
        } else {
          // Fallback to direct embed
          setError(false);
          setLoading(false);
        }
      } catch (err) {
        // Use fallback method
        setError(false);
        setLoading(false);
      }
    };

    // Load Instagram script
    if (!(window as any).instgrm) {
      const script = document.createElement('script');
      script.src = '//www.instagram.com/embed.js';
      script.async = true;
      script.onload = () => {
        setTimeout(() => {
          if ((window as any).instgrm?.Embeds) {
            (window as any).instgrm.Embeds.process();
          }
        }, 100);
      };
      document.body.appendChild(script);
    } else {
      setTimeout(() => {
        if ((window as any).instgrm?.Embeds) {
          (window as any).instgrm.Embeds.process();
        }
      }, 100);
    }

    loadEmbed();
  }, [url]);

  if (error) {
    return (
      <div className="my-6 p-6 border rounded-lg bg-muted/30 text-center">
        <p className="text-muted-foreground mb-3">Unable to load Instagram post</p>
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          View on Instagram →
        </a>
      </div>
    );
  }

  if (loading && !embedHtml) {
    return (
      <div className="my-6 flex justify-center">
        <div className="animate-pulse bg-muted rounded-lg w-full max-w-[540px] h-[600px]" />
      </div>
    );
  }

  return (
    <div className="my-6 flex flex-col items-center">
      {embedHtml ? (
        <div dangerouslySetInnerHTML={{ __html: embedHtml }} />
      ) : (
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
            width: 'calc(100% - 2px)'
          }}
        >
          <a href={url} target="_blank" rel="noopener noreferrer">
            View this post on Instagram
          </a>
        </blockquote>
      )}
      {caption && (
        <p className="text-sm text-muted-foreground text-center mt-3 italic max-w-[540px]">
          {caption}
        </p>
      )}
    </div>
  );
};

declare global {
  interface Window {
    instgrm?: any;
  }
}
