import { useEffect, useRef } from 'react';

interface SocialEmbedProps {
  html: string;
  provider: string;
}

/**
 * Component to safely render social media embeds
 * Uses dangerouslySetInnerHTML to render the full embed HTML from oEmbed APIs
 */
export const SocialEmbed = ({ html, provider }: SocialEmbedProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Execute any scripts in the embed HTML
    const scripts = containerRef.current.querySelectorAll('script');
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      
      // Copy attributes
      Array.from(script.attributes).forEach((attr) => {
        newScript.setAttribute(attr.name, attr.value);
      });
      
      // Copy content
      if (script.textContent) {
        newScript.textContent = script.textContent;
      }
      
      // Replace old script with new one to execute it
      script.parentNode?.replaceChild(newScript, script);
    });

    // Load platform-specific widgets if needed
    if (provider === 'twitter' && (window as any).twttr) {
      (window as any).twttr.widgets.load(containerRef.current);
    }
    
    if (provider === 'instagram' && (window as any).instgrm) {
      (window as any).instgrm.Embeds.process();
    }
    
    if (provider === 'facebook' && (window as any).FB) {
      (window as any).FB.XFBML.parse(containerRef.current);
    }
  }, [html, provider]);

  return (
    <div
      ref={containerRef}
      className="social-embed my-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default SocialEmbed;
