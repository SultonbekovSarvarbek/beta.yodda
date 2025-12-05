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
  useEffect(() => {
    const GOOGLE_ADS_ID = import.meta.env.VITE_GOOGLE_ADS_ID;

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
  }, []);

  // Отслеживание конверсий Google Ads
  const trackConversion = useCallback(
    (value: number = 1.0, currency: string = 'USD'): void => {
      if (window.gtag) {
        window.gtag('event', 'conversion', {
          send_to: 'AW-17611463437/uXehCOvryLUbEI225s1B',
          value: value,
          currency: currency,
        });
      }
    },
    []
  );

  return { trackConversion };
};

export default useGoogleTag;