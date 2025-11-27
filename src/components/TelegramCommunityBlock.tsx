import { useTranslation } from 'react-i18next';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface TelegramCommunityBlockProps {
  variant?: 'default' | 'compact';
  className?: string;
}

export function TelegramCommunityBlock({ variant = 'default', className = '' }: TelegramCommunityBlockProps) {
  const { t } = useTranslation();

  const handleJoinChannel = () => {
    window.open('https://t.me/yodda_online', '_blank', 'noopener,noreferrer');
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">
          🔗 {t('telegram.community')}
        </span>
        <Button
          variant="link"
          size="sm"
          onClick={handleJoinChannel}
          className="h-auto p-0 text-sm"
        >
          {t('telegram.join')}
        </Button>
      </div>
    );
  }

  return (
    <Alert className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
      <AlertTitle>{t('telegram.title')}</AlertTitle>
      <AlertDescription>
        <p className="mb-3">{t('telegram.description')}</p>
        <Button
          onClick={handleJoinChannel}
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
        >
          {t('telegram.joinButton')}
        </Button>
      </AlertDescription>
    </Alert>
  );
}
