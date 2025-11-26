import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

const METRIKA_ID = Number(import.meta.env.VITE_YANDEX_METRIKA_ID);

// Extend Window interface to include ym function
declare global {
  interface Window {
    ym?: (id: number, method: string, url: string) => void;
  }
}

/**
 * Hook to track page views with Yandex Metrika in SPA
 * Automatically tracks route changes using TanStack Router
 */
export function useYandexMetrika() {
  const location = useLocation();

  useEffect(() => {
    // Send page hit to Yandex Metrika
    if (window.ym && METRIKA_ID) {
      const url = location.pathname + location.search;
      window.ym(METRIKA_ID, 'hit', url);
    }
  }, [location.pathname, location.search]);
}
