import { useEffect } from 'react';
import type { Embed } from '@/lib/api/types';

interface UniversalEmbedProps {
  embed: Embed;
}

export const UniversalEmbed = ({ embed }: UniversalEmbedProps) => {
  useEffect(() => {
    // Load Instagram embed script
    if (embed.type === 'instagram' && !embed.embedCode) {
      const loadInstagram = () => {
        if (window.instgrm) {
          setTimeout(() => {
            window.instgrm.Embeds.process();
          }, 100);
        } else {
          const script = document.createElement('script');
          script.src = '//www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.instgrm) {
                window.instgrm.Embeds.process();
              }
            }, 100);
          };
          document.body.appendChild(script);
        }
      };
      loadInstagram();
      
      // Retry after a delay
      const timer = setTimeout(loadInstagram, 1000);
      return () => clearTimeout(timer);
    }

    // Load Twitter widget script for blockquote embeds
    if ((embed.type === 'twitter' || embed.type === 'x') && !embed.embedCode) {
      const loadTwitter = () => {
        if (window.twttr?.widgets) {
          setTimeout(() => {
            window.twttr.widgets.load();
          }, 100);
        } else {
          // Check if script already exists
          const existingScript = document.querySelector('script[src*="platform.twitter.com/widgets.js"]');
          if (!existingScript) {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            script.charset = 'utf-8';
            script.onload = () => {
              setTimeout(() => {
                if (window.twttr?.widgets) {
                  window.twttr.widgets.load();
                }
              }, 100);
            };
            document.body.appendChild(script);
          }
        }
      };
      loadTwitter();
      
      // Retry after delays to ensure rendering
      const timer1 = setTimeout(loadTwitter, 500);
      const timer2 = setTimeout(loadTwitter, 1500);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    }

    // Load Facebook SDK
    if (embed.type === 'facebook' && !embed.embedCode) {
      const loadFacebook = () => {
        if (window.FB) {
          setTimeout(() => {
            window.FB.XFBML.parse();
          }, 100);
        } else {
          // Load Facebook SDK
          const fbRoot = document.getElementById('fb-root');
          if (!fbRoot) {
            const div = document.createElement('div');
            div.id = 'fb-root';
            document.body.appendChild(div);
          }
          
          const script = document.createElement('script');
          script.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0';
          script.async = true;
          script.defer = true;
          script.crossOrigin = 'anonymous';
          script.onload = () => {
            setTimeout(() => {
              if (window.FB) {
                window.FB.XFBML.parse();
              }
            }, 100);
          };
          document.body.appendChild(script);
        }
      };
      loadFacebook();
      
      // Retry after a delay
      const timer = setTimeout(loadFacebook, 1000);
      return () => clearTimeout(timer);
    }

    // Load TikTok embed script
    if (embed.type === 'tiktok' && !embed.embedCode) {
      if (!window.TikTokEmbed) {
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [embed.type, embed.embedCode, embed.url]);

  // If custom embed code is provided, use it
  if (embed.embedCode) {
    return (
      <div className="embed-container my-6">
        <div 
          className="embed-content"
          dangerouslySetInnerHTML={{ __html: embed.embedCode }}
          style={{
            width: embed.width || '100%',
            height: embed.height || 'auto',
          }}
        />
        {embed.caption && (
          <p className="text-sm text-muted-foreground text-center mt-2 italic">
            {embed.caption}
          </p>
        )}
      </div>
    );
  }

  // Handle specific embed types by URL
  const renderEmbed = () => {
    switch (embed.type.toLowerCase()) {
      case 'instagram':
        return (
          <blockquote
            className="instagram-media"
            data-instgrm-captioned
            data-instgrm-permalink={embed.url}
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
            <a href={embed.url} target="_blank" rel="noopener noreferrer">
              View this post on Instagram
            </a>
          </blockquote>
        );

      case 'twitter':
      case 'x':
        // Use blockquote method with Twitter widget script
        const tweetUrl = embed.url || '';
        const tweetId = tweetUrl.split('/status/')[1]?.split('?')[0];
        
        if (!tweetId) {
          return (
            <div className="p-4 border rounded-lg bg-muted">
              <p className="text-sm text-muted-foreground">
                Invalid Twitter URL. Please use format: https://twitter.com/username/status/123456789
              </p>
            </div>
          );
        }

        // Use blockquote method (same as Twitter's official embed code)
        return (
          <div className="twitter-embed-wrapper" style={{ maxWidth: '550px', margin: '0 auto' }}>
            <blockquote 
              className="twitter-tweet" 
              data-theme="light"
              data-dnt="true"
              data-lang="en"
            >
              <a href={embed.url} target="_blank" rel="noopener noreferrer">
                View this post on Twitter
              </a>
            </blockquote>
          </div>
        );

      case 'youtube':
        const youtubeId = embed.url?.includes('watch?v=')
          ? embed.url.split('watch?v=')[1]?.split('&')[0]
          : embed.url?.split('/').pop();
        return (
          <iframe
            width={embed.width || '100%'}
            height={embed.height || '400'}
            src={`https://www.youtube.com/embed/${youtubeId}`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        );

      case 'vimeo':
        const vimeoId = embed.url?.split('/').pop();
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            width={embed.width || '100%'}
            height={embed.height || '400'}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="rounded-lg"
          />
        );

      case 'tiktok':
        return (
          <blockquote
            className="tiktok-embed"
            cite={embed.url}
            data-video-id={embed.url?.split('/').pop()}
            style={{ maxWidth: '605px', minWidth: '325px', margin: '0 auto' }}
          >
            <a href={embed.url}>Loading TikTok...</a>
          </blockquote>
        );

      case 'spotify':
        const spotifyId = embed.url?.split('/').pop()?.split('?')[0];
        const spotifyType = embed.url?.includes('/track/') ? 'track' : 'playlist';
        return (
          <iframe
            src={`https://open.spotify.com/embed/${spotifyType}/${spotifyId}`}
            width={embed.width || '100%'}
            height={embed.height || '380'}
            frameBorder="0"
            allow="encrypted-media"
            className="rounded-lg"
          />
        );

      case 'soundcloud':
        return (
          <iframe
            width={embed.width || '100%'}
            height={embed.height || '166'}
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(embed.url || '')}&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`}
            className="rounded-lg"
          />
        );

      case 'facebook':
        // Facebook embed using oEmbed API
        const fbUrl = encodeURIComponent(embed.url || '');
        return (
          <div className="fb-post" data-href={embed.url} data-width="500" data-show-text="true">
            <blockquote cite={embed.url} className="fb-xfbml-parse-ignore">
              <a href={embed.url} target="_blank" rel="noopener noreferrer">
                View this post on Facebook
              </a>
            </blockquote>
          </div>
        );

      case 'codepen':
        const codepenUser = embed.url?.split('/pen/')[0]?.split('/').pop();
        const codepenId = embed.url?.split('/pen/')[1]?.split('/')[0];
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

      case 'google-maps':
      case 'maps':
        return (
          <iframe
            src={embed.url}
            width={embed.width || '100%'}
            height={embed.height || '450'}
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="rounded-lg"
          />
        );

      default:
        // Generic iframe for any other URL
        return (
          <iframe
            src={embed.url}
            width={embed.width || '100%'}
            height={embed.height || '400'}
            frameBorder="0"
            allowFullScreen
            className="rounded-lg"
          />
        );
    }
  };

  return (
    <div className="embed-container my-6 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        {renderEmbed()}
      </div>
      {embed.caption && (
        <p className="text-sm text-muted-foreground text-center mt-2 italic max-w-3xl">
          {embed.caption}
        </p>
      )}
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
