/**
 * For Parents Page
 * Landing page for parents looking to find tutors for their children
 */

import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  UserCheck,
  Calendar,
  Video,
  Shield,
  Sliders,
  DollarSign
} from 'lucide-react';

export function ForParents() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const howItWorksSteps = [
    {
      number: '1',
      icon: <Search className="h-8 w-8 text-blue-600" />,
      titleKey: 'forParents.howItWorks.step1.title',
      descriptionKey: 'forParents.howItWorks.step1.description',
    },
    {
      number: '2',
      icon: <UserCheck className="h-8 w-8 text-blue-600" />,
      titleKey: 'forParents.howItWorks.step2.title',
      descriptionKey: 'forParents.howItWorks.step2.description',
    },
    {
      number: '3',
      icon: <Calendar className="h-8 w-8 text-blue-600" />,
      titleKey: 'forParents.howItWorks.step3.title',
      descriptionKey: 'forParents.howItWorks.step3.description',
    },
    {
      number: '4',
      icon: <Video className="h-8 w-8 text-blue-600" />,
      titleKey: 'forParents.howItWorks.step4.title',
      descriptionKey: 'forParents.howItWorks.step4.description',
    },
  ];

  const benefits = [
    {
      icon: <Shield className="h-12 w-12 text-blue-600" />,
      titleKey: 'forParents.benefits.verified.title',
      descriptionKey: 'forParents.benefits.verified.description',
    },
    {
      icon: <Sliders className="h-12 w-12 text-blue-600" />,
      titleKey: 'forParents.benefits.convenient.title',
      descriptionKey: 'forParents.benefits.convenient.description',
    },
    {
      icon: <DollarSign className="h-12 w-12 text-blue-600" />,
      titleKey: 'forParents.benefits.transparent.title',
      descriptionKey: 'forParents.benefits.transparent.description',
    },
  ];

  const handleFindTutor = () => {
    navigate({ to: '/tutors' });
  };

  return (
    <>
      <Helmet>
        <title>Для родителей - Найдите репетитора для вашего ребенка | YODDAGRAM</title>
        <meta
          name="description"
          content="Найдите проверенного репетитора для вашего ребенка на YODDAGRAM. Удобный поиск, прозрачные цены, онлайн и офлайн занятия. Помогите вашему ребенку достичь успехов в учебе."
        />
        <meta name="keywords" content="репетитор для ребенка, найти репетитора, детское образование, школьные предметы, помощь в учебе, онлайн репетиторство" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content="Для родителей - Найдите репетитора для вашего ребенка" />
        <meta property="og:description" content="Найдите проверенного репетитора для вашего ребенка на YODDAGRAM. Удобный поиск, прозрачные цены." />
        <meta property="og:site_name" content="YODDAGRAM" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Для родителей - Найдите репетитора для вашего ребенка" />
        <meta property="twitter:description" content="Найдите проверенного репетитора для вашего ребенка. Удобный поиск, прозрачные цены." />

        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-6 bg-white rounded-lg p-8 md:p-12 box-shadow-none border">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          {t('forParents.hero.title')}
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          {t('forParents.hero.description')}
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg cursor-pointer"
          onClick={handleFindTutor}
        >
          {t('forParents.hero.button')}
        </Button>
      </div>

      <Separator className="my-6" />

      {/* How It Works Section */}
      <div className="mb-6 bg-white rounded-lg p-8 md:p-12 border box-shadow-none">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
          {t('forParents.howItWorks.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {howItWorksSteps.map((step) => (
            <Card key={step.number} className="relative hover:shadow-lg transition-shadow rounded-lg border">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <Badge className="bg-blue-600 w-10 h-10 text-white text-lg px-4 py-2 shrink-0">
                    {step.number}
                  </Badge>
                  <div className="ml-auto">
                    {step.icon}
                  </div>
                </div>
                <CardTitle className="text-xl">
                  {t(step.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  {t(step.descriptionKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="my-6" />

      {/* Why Choose Yodda Section */}
      <div className="mb-16 bg-white rounded-lg p-8 md:p-12 box-shadow-none border">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-10 text-center">
          {t('forParents.benefits.title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow rounded-lg border">
              <CardHeader>
                <div className="mb-4 flex justify-center">
                  {benefit.icon}
                </div>
                <CardTitle className="text-xl text-center">
                  {t(benefit.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-center">
                  {t(benefit.descriptionKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center bg-blue-50 rounded-lg p-8 md:p-12 box-shadow-none border">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          {t('forParents.cta.title')}
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          {t('forParents.cta.description')}
        </p>
        <Button
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg cursor-pointer"
          onClick={handleFindTutor}
        >
          {t('forParents.hero.button')}
        </Button>
      </div>
      </div>
    </>
  );
}
