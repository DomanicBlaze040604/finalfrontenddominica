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

    // Load Twitter embed script
    if (embed.type === 'twitter' && !embed.embedCode) {
      const loadTwitter = () => {
        if (window.twttr) {
          setTimeout(() => {
            window.twttr.widgets.load();
          }, 100);
        } else {
          const script = document.createElement('script');
          script.src = 'https://platform.twitter.com/widgets.js';
          script.async = true;
          script.onload = () => {
            setTimeout(() => {
              if (window.twttr) {
                window.twttr.widgets.load();
              }
            }, 100);
          };
          document.body.appendChild(script);
        }
      };
      loadTwitter();
      
      // Retry after a delay
      const timer = setTimeout(loadTwitter, 1000);
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
        return (
          <blockquote 
            className="twitter-tweet" 
            data-theme="light"
            data-dnt="true"
          >
            <a href={embed.url} target="_blank" rel="noopener noreferrer">
              View this post on Twitter
            </a>
          </blockquote>
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
        return (
          <iframe
            src={`https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(embed.url || '')}&width=500`}
            width={embed.width || '500'}
            height={embed.height || '600'}
            style={{ border: 'none', overflow: 'hidden' }}
            scrolling="no"
            frameBorder="0"
            allowFullScreen
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
          />
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
  }
}
