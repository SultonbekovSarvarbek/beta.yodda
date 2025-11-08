import { BeTutorForm } from '@/components/BeTutorForm';
import { Sidebar } from '@/components/Sidebar';
import { TutorMarketingSidebar } from '@/components/TutorMarketingSidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { BottomNavigation } from '@/components/BottomNavigation';

export function BeTutor() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        <BeTutorForm />
      </main>

      {/* Marketing Sidebar */}
      <TutorMarketingSidebar />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
