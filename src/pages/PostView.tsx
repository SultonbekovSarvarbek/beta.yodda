import { useParams, useNavigate } from '@tanstack/react-router';
import { useAnnouncementById } from '@/hooks/api';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

// Utility function to detect file type
const getFileType = (filePath: string): 'pdf' | 'image' | 'video' => {
  const extension = filePath.split('.').pop()?.toLowerCase();

  // Video extensions
  const videoExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv', 'ogg', 'm4v'];
  if (videoExtensions.includes(extension || '')) {
    return 'video';
  }

  // PDF extension
  if (extension === 'pdf') {
    return 'pdf';
  }

  // Default to image
  return 'image';
};

export function PostView() {
  const { t } = useTranslation();
  const { tutorId, postId } = useParams({ from: '/tutor/$tutorId/post/$postId' });
  const navigate = useNavigate();
  const { data: tutor, isLoading, isError } = useAnnouncementById(parseInt(tutorId));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  if (isError || !tutor) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-lg mb-4">Post not found</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/tutor/$id', params: { id: tutorId } })}
          className="bg-white text-black hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>
    );
  }

  // Combine tutor files with mock posts to find the specific post
  const filePosts = (tutor.file || []).map((file) => ({
    id: `file-${file.unique_id}`,
    image: file.path,
    fileType: getFileType(file.path),
    isFile: true,
  }));

  const mockPosts = Array.from({ length: 9 }, (_, i) => ({
    id: i + 1,
    image: tutor.image?.small || `https://images.unsplash.com/photo-${1500000000000 + i * 1000}?w=400&h=400&fit=crop`,
    fileType: 'image' as const,
    isFile: false,
  }));

  const allPosts = [...filePosts, ...mockPosts];
  const post = allPosts.find((p) => p.id.toString() === postId);

  if (!post) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
        <p className="text-lg mb-4">Post not found</p>
        <Button
          variant="outline"
          onClick={() => navigate({ to: '/tutor/$id', params: { id: tutorId } })}
          className="bg-white text-black hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>
    );
  }

  const handleBack = () => {
    navigate({ to: '/tutor/$id', params: { id: tutorId } });
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4">
        <Button
          variant="ghost"
          onClick={handleBack}
          className="text-white hover:bg-white/10"
        >
          <ArrowLeft className="h-6 w-6" />
        </Button>
      </header>

      {/* Post content */}
      <div className="flex flex-col items-center justify-center min-h-screen pt-16 pb-8">
        {/* Video, Image, or PDF display */}
        <div className="w-full max-w-2xl px-4">
          {post.fileType === 'pdf' ? (
            <div className="flex flex-col items-center gap-6 py-12">
              <FileText className="h-32 w-32 text-white" />
              <span className="text-white text-xl font-medium">PDF Document</span>
              <Button
                onClick={() => window.open(post.image, '_blank')}
                variant="outline"
                className="bg-white text-black hover:bg-gray-100"
              >
                Open PDF in New Tab
              </Button>
            </div>
          ) : post.fileType === 'video' ? (
            <div className="w-full">
              <video
                src={post.image}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full rounded-lg"
              >
                <source src={post.image} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <img
              src={post.image}
              alt="Post"
              className="w-full object-contain rounded-lg"
            />
          )}
        </div>

        {/* Post information */}
        <div className="w-full max-w-2xl px-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-white/20">
              <img
                src={tutor.image?.thumbnail || tutor.image?.small}
                alt={tutor.fullname}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-semibold text-sm">{tutor.fullname}</p>
                <p className="text-white/60 text-xs">
                  {tutor.city.name}, {tutor.region.name}
                </p>
              </div>
            </div>
            <div>
              <p className="text-white/80 text-sm">
                <span className="text-white/60 font-medium">Type:</span>{' '}
                {post.fileType === 'pdf' ? 'PDF Document' :
                 post.fileType === 'video' ? 'Video' : 'Image'}
              </p>
              <p className="text-white/80 text-sm">
                <span className="text-white/60 font-medium">Source:</span>{' '}
                {post.isFile ? 'Tutor Upload' : 'Profile Gallery'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
