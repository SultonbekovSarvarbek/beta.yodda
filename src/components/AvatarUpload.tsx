import { useState, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface AvatarUploadProps {
  value?: string;
  onChange?: (file: File | null) => void;
}

export function AvatarUpload({ value, onChange }: AvatarUploadProps) {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<string | undefined>(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="w-32 h-32">
          {preview ? (
            <AvatarImage src={preview} alt="Avatar" />
          ) : (
            <AvatarFallback className="bg-gray-200">
              <Camera className="w-12 h-12 text-gray-400" />
            </AvatarFallback>
          )}
        </Avatar>
        <Button
          type="button"
          size="icon"
          className="absolute bottom-0 right-0 rounded-full"
          onClick={handleClick}
        >
          <Camera className="w-4 h-4" />
        </Button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button type="button" variant="outline" onClick={handleClick}>
        {preview ? t('beTutorForm.changeAvatar') : t('beTutorForm.uploadAvatar')}
      </Button>
    </div>
  );
}
