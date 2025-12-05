import { useEffect } from 'react';

// Расширяем глобальный Window интерфейс
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const useGoogleTag = (): void => {
  useEffect(() => {
    const GOOGLE_ADS_ID = process.env.REACT_APP_GOOGLE_ADS_ID;

    if (!GOOGLE_ADS_ID) {
      console.warn('Google Ads ID not found in environment variables');
      return;
    }

    // Проверяем, не загружен ли уже скрипт
    const existingScript = document.querySelector(
      `script[src*="googletagmanager.com/gtag/js"]`
    );

    if (existingScript) {
      return;
    }

    // Добавляем gtag.js скрипт
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`;
    script.async = true;
    document.head.appendChild(script);

    // Инициализируем gtag
    window.dataLayer = window.dataLayer || [];
    
    const gtag = (...args: unknown[]): void => {
      window.dataLayer.push(args);
    };
    
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GOOGLE_ADS_ID);

    // Cleanup при размонтировании
    return () => {
      const scriptToRemove = document.querySelector(
        `script[src*="googletagmanager.com/gtag/js"]`
      );
      if (scriptToRemove) {
        document.head.removeChild(scriptToRemove);
      }
    };
  }, []);
};

export default useGoogleTag;