import { useTranslation } from 'react-i18next';
import { Clock, DollarSign, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function TutorMarketingSidebar() {
  const { t } = useTranslation();

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: t('marketing.benefit1Title'),
      description: t('marketing.benefit1Desc'),
    },
    {
      icon: <DollarSign className="w-6 h-6 text-green-500" />,
      title: t('marketing.benefit2Title'),
      description: t('marketing.benefit2Desc'),
    },
    {
      icon: <Users className="w-6 h-6 text-purple-500" />,
      title: t('marketing.benefit3Title'),
      description: t('marketing.benefit3Desc'),
    },
  ];

  return (
    <div className="hidden xl:block fixed right-0 top-0 w-80 h-full px-4 py-4 pl-0 overflow-y-auto bg-gray-50">
      {/* Why Become a Tutor */}
      <Card className="mb-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">{t('marketing.whyBecomeTutor')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex gap-3">
              <div className="flex-shrink-0">{benefit.icon}</div>
              <div>
                <h4 className="font-semibold text-sm mb-1">{benefit.title}</h4>
                <p className="text-xs text-gray-600">{benefit.description}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="mb-6 shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">{t('marketing.statistics')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{t('marketing.stat1')}</span>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{t('marketing.stat2')}</span>
          </div>
          <Separator />
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{t('marketing.stat3')}</span>
          </div>
        </CardContent>
      </Card>

      {/* Testimonials */}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle className="text-lg">{t('marketing.testimonials')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm italic mb-2">{t('marketing.testimonial1')}</p>
            <p className="text-xs text-gray-600">— {t('marketing.testimonial1Author')}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <p className="text-sm italic mb-2">{t('marketing.testimonial2')}</p>
            <p className="text-xs text-gray-600">— {t('marketing.testimonial2Author')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
