import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { cn } from '@/lib/utils';

interface CertificateUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
  className?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];
const ACCEPTED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif', '.pdf'];

export const CertificateUpload: React.FC<CertificateUploadProps> = ({
  files,
  onChange,
  className,
}) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return t('beTutorForm.invalidFileType');
    }
    if (file.size > MAX_FILE_SIZE) {
      return t('beTutorForm.fileTooLarge');
    }
    return null;
  };

  const handleFileChange = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;

    const newFiles: File[] = [];
    let hasError = false;

    Array.from(selectedFiles).forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        hasError = true;
      } else {
        newFiles.push(file);
      }
    });

    if (!hasError) {
      setError('');
    }

    if (newFiles.length > 0) {
      onChange([...files, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    onChange(updatedFiles);
    setError('');
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
    handleFileChange(e.dataTransfer.files);
  };

  const getFilePreview = (file: File) => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="space-y-2">
        <Label>{t('beTutorForm.certificates')}</Label>
        <p className="text-sm text-muted-foreground">
          {t('beTutorForm.certificatesDescription')}
        </p>
      </div>

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
              {t('beTutorForm.uploadCertificates')}
            </Button>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(',')}
          onChange={(e) => handleFileChange(e.target.files)}
          className="hidden"
        />
      </div>

      {error && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <Label>{t('beTutorForm.uploadedFiles', { count: files.length })}</Label>
          <div className="grid gap-3">
            {files.map((file, index) => {
              const preview = getFilePreview(file);
              const isPdf = file.type === 'application/pdf';

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 rounded-lg border p-3 bg-card"
                >
                  <div className="flex-shrink-0">
                    {preview ? (
                      <img
                        src={preview}
                        alt={file.name}
                        className="h-12 w-12 rounded object-cover"
                      />
                    ) : isPdf ? (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-red-100">
                        <FileText className="h-6 w-6 text-red-600" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/10">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveFile(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">{t('beTutorForm.removeFile')}</span>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
