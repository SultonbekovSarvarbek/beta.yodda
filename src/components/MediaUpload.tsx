import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  value?: string;
  onChange?: (file: File | null, mediaType: 'photo' | 'video') => void;
}

const MAX_PHOTO_SIZE = 2 * 1024 * 1024; // 2MB in bytes
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB in bytes
const ACCEPTED_PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];
const ACCEPTED_PHOTO_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];
const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];

export function MediaUpload({ value, onChange }: MediaUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | undefined>(value);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const getMediaType = (file: File): 'photo' | 'video' | null => {
    if (ACCEPTED_PHOTO_TYPES.includes(file.type)) return 'photo';
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return 'video';
    return null;
  };

  const validateFile = (file: File): string | null => {
    const type = getMediaType(file);

    if (!type) {
      return t('miniLessons.create.errors.invalidFileType') || 'Unsupported file type. Please upload a photo (JPG, PNG, WEBP) or video (MP4, WebM, MOV).';
    }

    if (type === 'photo' && file.size > MAX_PHOTO_SIZE) {
      return t('miniLessons.create.errors.photoTooLarge') || 'Photo is too large. Maximum size is 2MB.';
    }

    if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
      return t('miniLessons.create.errors.videoTooLarge') || 'Video is too large. Maximum size is 50MB.';
    }

    return null;
  };

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const type = getMediaType(file);
    if (!type) return;

    setError('');
    setMediaType(type);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCurrentFile(file);
      onChange?.(file, type);
    };
    reader.readAsDataURL(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setCurrentFile(null);
    setMediaType(null);
    setError('');
    onChange?.(null, 'photo');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>{t('miniLessons.create.uploadMedia')}</Label>
        <p className="text-sm text-muted-foreground">
          {t('miniLessons.create.mediaDescription') || 'Upload a photo (max 2MB) or video (max 50MB). Supported formats: JPG, PNG, WEBP, MP4, WebM, MOV.'}
        </p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full max-w-md mx-auto rounded-lg overflow-hidden border bg-card" style={{ minHeight: '200px', maxHeight: '400px' }}>
            {mediaType === 'video' ? (
              <video
                src={preview}
                controls
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="Media preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          {currentFile && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card max-w-md mx-auto">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="flex-shrink-0">
                  {mediaType === 'video' ? (
                    <Video className="h-8 w-8 text-primary" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={currentFile.name}>
                    {currentFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(currentFile.size)} • {mediaType === 'video' ? t('miniLessons.create.video') : t('miniLessons.create.photo')}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="flex-shrink-0 cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('common.cancel')}</span>
              </Button>
            </div>
          )}
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              {t('miniLessons.create.changeMedia') || 'Change'}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              className="cursor-pointer"
            >
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
            isDragging ? 'border-primary bg-primary/5' : 'border-border',
            'hover:border-primary/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('miniLessons.create.dragDropMedia') || 'Drag and drop your photo or video here'}</p>
              <p className="text-xs text-muted-foreground">
                {t('miniLessons.create.orClickToSelect') || 'or click to select a file'}
              </p>
              <p className="text-xs text-muted-foreground">
                Photo: max 2MB • Video: max 50MB
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={[...ACCEPTED_PHOTO_EXTENSIONS, ...ACCEPTED_VIDEO_EXTENSIONS].join(',')}
        className="hidden"
        onChange={handleInputChange}
      />

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
