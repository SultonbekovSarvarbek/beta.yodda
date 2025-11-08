import { Sidebar } from '@/components/Sidebar';
import { MobileHeader } from '@/components/MobileHeader';
import { SuggestionsPanel } from '@/components/SuggestionsPanel';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Footer } from '@/components/Footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleGrid } from '@/components/ScheduleGrid';
import { PricingCard } from '@/components/PricingCard';
import { Check, Share2, MapPin, Grid3x3, User, Calendar, DollarSign, Star } from 'lucide-react';
import { useParams } from '@tanstack/react-router';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { Loader2 } from 'lucide-react';

export function TutorProfile() {
  const { id } = useParams({ from: '/tutor/$id' });
  const { data: tutors, loading, error } = useAnnouncements();

  // Find the tutor by ID from the list
  // In a real app, you'd fetch a single tutor from API
  const tutor = tutors.find((t) => t.id.toString() === id);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MobileHeader />
        <Sidebar />
        <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-gray-400" />
          </div>
        </main>
        <SuggestionsPanel />
        <BottomNavigation />
        <Footer />
      </div>
    );
  }

  if (error || !tutor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <MobileHeader />
        <Sidebar />
        <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg mb-2">Tutor not found</p>
              <p className="text-gray-500 text-sm">
                The tutor you're looking for doesn't exist or has been removed.
              </p>
            </div>
          </div>
        </main>
        <SuggestionsPanel />
        <BottomNavigation />
        <Footer />
      </div>
    );
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${tutor.fullname} - Tutor Profile`,
        text: `Check out ${tutor.fullname}'s profile on Yodagram`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Profile link copied to clipboard!');
    }
  };

  const handleBookLesson = () => {
    alert('Booking functionality coming soon!');
  };

  // Mock posts count based on tutor data
  const postsCount = tutor.subjects.length * 4 || 12;
  const followersCount = Math.floor(Math.random() * 500) + 100;
  const followingCount = Math.floor(Math.random() * 200) + 50;

  // Generate mock posts (using tutor image or placeholders)
  const mockPosts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: tutor.image || `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&h=400&fit=crop`,
  }));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <MobileHeader />

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 xl:mr-80 pb-16 lg:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Profile Header - Instagram Style */}
          <div className="bg-white rounded-lg border p-6 md:p-8 mb-0">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Avatar */}
              <div className="flex justify-center md:justify-start">
                <Avatar className="h-32 w-32 md:h-40 md:w-40">
                  <AvatarImage
                    src={tutor.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&h=300&fit=crop'}
                    alt={tutor.fullname}
                  />
                  <AvatarFallback>{tutor.fullname.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                {/* Name and Actions */}
                <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-semibold">{tutor.fullname}</h1>
                    
                    <div className="flex items-center justify-center w-4 h-4 bg-blue-500 rounded-full">
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={4} />
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleBookLesson} size="sm">
                      Book Lesson
                    </Button>
                    <Button onClick={handleShare} variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Instagram Stats */}
                <div className="flex gap-8 mb-4">
                  <div>
                    <span className="font-semibold">{postsCount}</span>{' '}
                    <span className="text-gray-600">posts</span>
                  </div>
                  <div>
                    <span className="font-semibold">{followersCount}</span>{' '}
                    <span className="text-gray-600">followers</span>
                  </div>
                  <div>
                    <span className="font-semibold">{followingCount}</span>{' '}
                    <span className="text-gray-600">following</span>
                  </div>
                </div>

                {/* Bio Section */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {tutor.city.name}, {tutor.region.name}
                    </span>
                    <span>•</span>
                    <span>{tutor.age} years old</span>
                  </div>

                  <p className="text-sm text-gray-800">{tutor.description}</p>

                  {/* Subjects */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject.id} variant="secondary">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram-Style Tabs */}
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="w-full h-auto bg-white border rounded-lg p-2 justify-center gap-2">
              <TabsTrigger
                value="posts"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gray-100 data-[state=active]:font-semibold rounded-lg"
              >
                <Grid3x3 className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Posts</span>
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gray-100 data-[state=active]:font-semibold rounded-lg"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">About</span>
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gray-100 data-[state=active]:font-semibold rounded-lg"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Schedule</span>
              </TabsTrigger>
              <TabsTrigger
                value="pricing"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gray-100 data-[state=active]:font-semibold rounded-lg"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Pricing</span>
              </TabsTrigger>
              <TabsTrigger
                value="reviews"
                className="flex-1 flex items-center justify-center gap-2 py-3 data-[state=active]:bg-gray-100 data-[state=active]:font-semibold rounded-lg"
              >
                <Star className="h-4 w-4" />
                <span className="hidden sm:inline text-sm">Reviews</span>
              </TabsTrigger>
            </TabsList>

            {/* Posts Tab */}
            <TabsContent value="posts" className="mt-0">
              <div className="bg-white border rounded-lg p-4">
                <div className="grid grid-cols-3 gap-1 sm:gap-2">
                  {mockPosts.map((post) => (
                    <div
                      key={post.id}
                      className="aspect-square bg-gray-200 rounded overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                    >
                      <img
                        src={post.image}
                        alt={`Post ${post.id}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="mt-0">
              <div className="bg-white border rounded-lg p-6 space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">About Me</h3>
                  <p className="text-gray-700">{tutor.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Experience</h3>
                  <p className="text-gray-700">{tutor.experience} years of teaching experience</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Subjects I Teach</h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((subject) => (
                      <Badge key={subject.id} variant="outline" className="text-sm">
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Price Range</h3>
                  <p className="text-gray-700">
                    {tutor.min_price.toLocaleString()} - {tutor.max_price.toLocaleString()} sum per
                    hour
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="mt-0">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Weekly Availability</h3>
                <ScheduleGrid schedule={tutor.schedule} />
              </div>
            </TabsContent>

            {/* Pricing Tab */}
            <TabsContent value="pricing" className="mt-0">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Lesson Formats</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tutor.formatsData.map((format) => (
                    <PricingCard key={format.id} format={format} onBook={handleBookLesson} />
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="mt-0">
              <div className="bg-white border rounded-lg p-6">
                <h3 className="font-semibold text-lg mb-4">Student Reviews</h3>
                <div className="text-center py-12 text-gray-500">
                  <p>No reviews yet</p>
                  <p className="text-sm mt-2">Be the first to leave a review for this tutor!</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Desktop Suggestions Panel */}
      <SuggestionsPanel />

      {/* Mobile Bottom Navigation */}
      <BottomNavigation />

      {/* Footer */}
      <Footer />
    </div>
  );
}
