import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MediaUploadProps {
  value?: string;
  onChange?: (file: File | null, mediaType: 'photo' | 'video') => void;
  allowedTypes?: ('photo' | 'video')[];
}

const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];

const ACCEPTED_VIDEO_EXTENSIONS = ['.mp4', '.webm', '.mov'];
const ACCEPTED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];

export function MediaUpload({ value, onChange, allowedTypes = ['video'] }: MediaUploadProps) {
  const [preview, setPreview] = useState<string | undefined>(value);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'photo' | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (value) {
      setPreview(value);
    }
  }, [value]);

  const getMediaType = (file: File): 'video' | 'photo' | null => {
    if (ACCEPTED_VIDEO_TYPES.includes(file.type)) return 'video';
    if (ACCEPTED_IMAGE_TYPES.includes(file.type)) return 'photo';
    return null;
  };

  const validateFile = (file: File): string | null => {
    const type = getMediaType(file);

    if (!type) {
      return 'Неподдерживаемый формат файла.';
    }

    if (type === 'video' && !allowedTypes.includes('video')) {
      return 'Пожалуйста, загрузите фото.';
    }

    if (type === 'photo' && !allowedTypes.includes('photo')) {
      return 'Пожалуйста, загрузите видео.';
    }

    if (type === 'video' && file.size > MAX_VIDEO_SIZE) {
      return 'Видео слишком большое. Максимальный размер 100MB.';
    }

    if (type === 'photo' && file.size > MAX_IMAGE_SIZE) {
      return 'Фото слишком большое. Максимальный размер 10MB.';
    }

    return null;
  };

  // ... (handleFileChange and other handlers remain mostly the same but need to use the new validation)

  const getAcceptedExtensions = () => {
    const extensions = [];
    if (allowedTypes.includes('video')) extensions.push(...ACCEPTED_VIDEO_EXTENSIONS);
    if (allowedTypes.includes('photo')) extensions.push(...ACCEPTED_IMAGE_EXTENSIONS);
    return extensions.join(',');
  };

  const getHelperText = () => {
    const parts = [];
    if (allowedTypes.includes('video')) parts.push('Видео (макс. 100MB)');
    if (allowedTypes.includes('photo')) parts.push('Фото (макс. 10MB)');
    return `Загрузите ${parts.join(' или ')}.`;
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
    onChange?.(null, 'video'); // Default to video or whatever, doesn't matter since file is null
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
        <Label>Загрузить медиа файл</Label>
        <p className="text-sm text-muted-foreground">
          {getHelperText()}
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
                alt="Preview"
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
                    <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center text-primary font-bold">IMG</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" title={currentFile.name}>
                    {currentFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(currentFile.size)} • {mediaType === 'video' ? 'Видео' : 'Фото'}
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
                <span className="sr-only">Отменить</span>
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
              Изменить
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              className="cursor-pointer"
            >
              Удалить
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
              <p className="text-sm font-medium">Перетащите файл сюда</p>
              <p className="text-xs text-muted-foreground">
                или нажмите для выбора файла
              </p>
              <p className="text-xs text-muted-foreground">
                {getHelperText()}
              </p>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={getAcceptedExtensions()}
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
