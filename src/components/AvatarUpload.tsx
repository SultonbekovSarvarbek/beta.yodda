import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AvatarUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/heic', 'image/heif'];
const ACCEPTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.heic', '.heif'];

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | undefined>(value);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return t('beTutorForm.invalidFileType');
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('beTutorForm.fileTooLarge');
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

    setError('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setCurrentFile(file);
      onChange?.(file);
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
    setError('');
    onChange?.(null);
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
        <Label>{t('beTutorForm.uploadAvatar')}</Label>
        <p className="text-sm text-muted-foreground">
          {t('beTutorForm.certificatesDescription')}
        </p>
      </div>

      {preview ? (
        <div className="space-y-3">
          <div className="relative w-full aspect-video max-w-md mx-auto rounded-lg overflow-hidden border bg-card">
            <img
              src={preview}
              alt="Avatar preview"
              className="w-full h-full object-cover"
            />
          </div>
          {currentFile && (
            <div className="flex items-center justify-between p-3 rounded-lg border bg-card max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <ImageIcon className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{currentFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(currentFile.size)}
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">{t('beTutorForm.removeFile')}</span>
              </Button>
            </div>
          )}
          <div className="flex justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
            >
              {t('beTutorForm.changeAvatar')}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
            >
              {t('beTutorForm.removeFile')}
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-border',
            'hover:border-primary/50'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="rounded-full bg-primary/10 p-4">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">{t('beTutorForm.dragDropFiles')}</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                {t('beTutorForm.uploadAvatar')}
              </Button>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_EXTENSIONS.join(',')}
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
