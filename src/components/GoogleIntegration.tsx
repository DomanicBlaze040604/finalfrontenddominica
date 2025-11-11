import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

interface GoogleIntegrationProps {
  googleAnalyticsId?: string;
  googleSearchConsoleId?: string;
}

export const GoogleIntegration = ({ 
  googleAnalyticsId, 
  googleSearchConsoleId 
}: GoogleIntegrationProps) => {
  useEffect(() => {
    // Load Google Analytics
    if (googleAnalyticsId && typeof window !== 'undefined') {
      // Check if gtag is already loaded
      if (!(window as any).gtag) {
        // Load gtag.js script
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`;
        script.async = true;
        document.head.appendChild(script);

        // Initialize gtag
        script.onload = () => {
          (window as any).dataLayer = (window as any).dataLayer || [];
          function gtag(...args: any[]) {
            (window as any).dataLayer.push(arguments);
          }
          (window as any).gtag = gtag;
          gtag('js', new Date());
          gtag('config', googleAnalyticsId, {
            page_path: window.location.pathname,
          });
        };
      }
    }
  }, [googleAnalyticsId]);

  // Track page views on route changes
  useEffect(() => {
    if (googleAnalyticsId && (window as any).gtag) {
      (window as any).gtag('config', googleAnalyticsId, {
        page_path: window.location.pathname,
      });
    }
  }, [googleAnalyticsId, window.location.pathname]);

  return (
    <Helmet>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          />
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_path: window.location.pathname
              });
            `}
          </script>
        </>
      )}

      {/* Google Search Console Verification */}
      {googleSearchConsoleId && (
        <meta 
          name="google-site-verification" 
          content={googleSearchConsoleId} 
        />
      )}
    </Helmet>
  );
};

// Hook for tracking custom events
export const useGoogleAnalytics = () => {
  const trackEvent = (
    eventName: string,
    eventParams?: Record<string, any>
  ) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, eventParams);
    }
  };

  const trackPageView = (pagePath: string, pageTitle?: string) => {
    if ((window as any).gtag) {
      (window as any).gtag('event', 'page_view', {
        page_path: pagePath,
        page_title: pageTitle,
      });
    }
  };

  return { trackEvent, trackPageView };
};

// Extend Window interface
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
