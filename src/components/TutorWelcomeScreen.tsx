import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TelegramCommunityBlock } from './TelegramCommunityBlock';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface TutorWelcomeScreenProps {
  onContinue: () => void;
}

export function TutorWelcomeScreen({ onContinue }: TutorWelcomeScreenProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-8">
        {/* Success Icon and Title */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold">
            {t('tutorWelcome.title')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('tutorWelcome.subtitle')}
          </p>
        </div>

        {/* Welcome Message */}
        <div className="bg-muted/50 rounded-lg p-6 space-y-3">
          <h2 className="font-semibold text-lg">
            {t('tutorWelcome.nextSteps')}
          </h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t('tutorWelcome.step1')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t('tutorWelcome.step2')}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-1">•</span>
              <span>{t('tutorWelcome.step3')}</span>
            </li>
          </ul>
        </div>

        {/* Telegram Community Block */}
        <TelegramCommunityBlock />

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            onClick={onContinue}
            className="min-w-[200px]"
          >
            {t('tutorWelcome.continueButton')}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}
