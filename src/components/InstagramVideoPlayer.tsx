import { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import type { MiniLessonMedia } from '@/types/api';

interface InstagramVideoPlayerProps {
  media?: MiniLessonMedia;
  src?: string;
  className?: string;
}

type VideoQuality = '480p' | '720p' | '1080p' | 'original';

export function InstagramVideoPlayer({ media, src, className = '' }: InstagramVideoPlayerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [currentQuality, setCurrentQuality] = useState<VideoQuality>('720p');
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasInitialPlayed = useRef(false);

  // If simple src is provided (not a media object), use it directly
  const isSimpleVideo = !media && !!src;

  // Get available qualities based on media versions
  const availableQualities = (): VideoQuality[] => {
    if (isSimpleVideo || !media) return [];
    const qualities: VideoQuality[] = [];
    if (media.versions?.['480p']) qualities.push('480p');
    if (media.versions?.['720p']) qualities.push('720p');
    if (media.versions?.['1080p']) qualities.push('1080p');
    if (media.original) qualities.push('original');
    return qualities;
  };

  // Get video URL based on selected quality
  const getVideoUrl = (quality: VideoQuality): string => {
    if (isSimpleVideo) return src!;
    if (!media) return '';
    if (quality === 'original') return media.original;
    return media.versions?.[quality] || media.original;
  };

  const currentSrc = getVideoUrl(currentQuality);

  useEffect(() => {
    // Reset initial play flag when component mounts
    hasInitialPlayed.current = false;

    // Cleanup: pause video when component unmounts
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    // Attempt to play the video when component mounts or source changes
    if (!videoRef.current || !currentSrc) return;

    const video = videoRef.current;
    const savedTime = video.currentTime || 0;
    const wasPlaying = !video.paused;

    const handleCanPlay = () => {
      if (!videoRef.current) return;

      // Restore playback position for quality changes
      if (savedTime > 0) {
        videoRef.current.currentTime = savedTime;
      }

      // Play if: (1) was playing before quality change, OR (2) first time loading
      if (wasPlaying || !hasInitialPlayed.current) {
        hasInitialPlayed.current = true;
        videoRef.current.play().catch((error) => {
          console.log('Autoplay prevented:', error);
          setIsPlaying(false);
        });
      }
    };

    video.addEventListener('canplay', handleCanPlay, { once: true });

    // Trigger load
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentSrc]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering play/pause
    setIsMuted(!isMuted);
  };

  const toggleQualityMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowQualityMenu(!showQualityMenu);
  };

  const changeQuality = (quality: VideoQuality, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentQuality(quality);
    setShowQualityMenu(false);
  };

  const qualities = availableQualities();

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center bg-black ${className}`}
    >
      <video
        ref={videoRef}
        src={currentSrc}
        autoPlay
        loop
        playsInline
        muted={isMuted}
        className="max-w-full max-h-full object-contain cursor-pointer"
        onClick={togglePlayPause}
      />

      {/* Quality Menu */}
      {showQualityMenu && (
        <div className="absolute bottom-16 right-4 bg-black/90 rounded-lg p-2 min-w-[120px] z-50">
          <div className="text-xs text-white/60 px-3 py-1 font-semibold">Качество</div>
          {qualities.map((quality) => (
            <button
              key={quality}
              onClick={(e) => changeQuality(quality, e)}
              className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                currentQuality === quality
                  ? 'bg-primary text-primary-foreground'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {quality === 'original' ? 'Оригинал' : quality}
              {currentQuality === quality && ' ✓'}
            </button>
          ))}
        </div>
      )}

      {/* Control Buttons */}
      <div className="absolute bottom-4 right-4 flex gap-2 z-50">
        {/* Quality Button */}
        {qualities.length > 1 && (
          <button
            onClick={toggleQualityMenu}
            className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 cursor-pointer"
            aria-label="Video quality"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        {/* Mute/Unmute Button */}
        <button
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 cursor-pointer"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeX className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Play/Pause Indicator (optional - fades quickly) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-black/50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}

      {/* Quality Indicator - only show for media objects with multiple qualities */}
      {!isSimpleVideo && qualities.length > 1 && (
        <div className="absolute top-4 left-4 px-2 py-1 rounded bg-black/50 text-white text-xs font-medium">
          {currentQuality === 'original' ? 'Оригинал' : currentQuality}
        </div>
      )}
    </div>
  );
}
