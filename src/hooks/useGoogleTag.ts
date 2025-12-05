import { useEffect, useCallback } from 'react';

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

interface UseGoogleTagReturn {
  trackConversion: (value?: number, currency?: string) => void;
}

const useGoogleTag = (): UseGoogleTagReturn => {
  const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;
  const GOOGLE_CONVERSION_ID = import.meta.env.VITE_GOOGLE_CONVERSION_ID;

  useEffect(() => {
    if (!GOOGLE_ADS_ID) {
      console.warn('Google Ads ID not found');
      return;
    }

    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js"]`
    );

    if (!existingScript) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
      script.async = true;
      document.head.appendChild(script);
    }

    window.dataLayer = window.dataLayer || [];

    const gtag = (...args: unknown[]): void => {
      window.dataLayer.push(args);
    };

    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);
  }, [GOOGLE_ADS_ID]);

  const trackConversion = useCallback(
    (value: number = 1.0, currency: string = 'USD'): void => {
      if (window.gtag && GOOGLE_CONVERSION_ID) {
        window.gtag('event', 'conversion', {
          send_to: GOOGLE_CONVERSION_ID,
          value: value,
          currency: currency,
        });
      }
    },
    [GOOGLE_CONVERSION_ID]
  );

  return { trackConversion };
};

export default useGoogleTag;