/**
 * AppLayout
 * Common layout wrapper for all application pages
 * Provides consistent structure: Sidebar, Header, Footer, and Navigation components
 */

import type { ReactNode } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { SuggestionsPanel } from '@/components/SuggestionsPanel';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Footer } from '@/components/Footer';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MobileHeader />
      <Sidebar />
      <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        {children}
      </main>
      <SuggestionsPanel />
      <BottomNavigation />
      <Footer />
    </div>
  );
}
