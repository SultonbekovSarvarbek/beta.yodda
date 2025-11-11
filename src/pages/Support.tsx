/**
 * Support/Contact Page
 * Contact form and support information
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Phone, Send, MessageCircle } from 'lucide-react';
import { sendContactMessage } from '@/services/api';

export function Support() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = t('support.form.errors.nameRequired');
    }

    if (!formData.phone.trim()) {
      errors.phone = t('support.form.errors.phoneRequired');
    } else if (!formData.phone.match(/^\+998\d{9}$/)) {
      errors.phone = t('support.form.errors.phoneInvalid');
    }

    if (!formData.message.trim()) {
      errors.message = t('support.form.errors.messageRequired');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('idle');

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await sendContactMessage(formData);
      setSubmitStatus('success');
      // Reset form
      setFormData({ name: '', phone: '', message: '' });
      setValidationErrors({});
    } catch (error) {
      console.error('Failed to send message:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Title */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('support.title')}
        </h1>
        <p className="text-lg text-gray-600">
          {t('support.description')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact Form */}
        <Card className="border rounded-lg">
          <CardHeader>
            <CardTitle className="text-2xl">{t('support.form.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name">
                  {t('support.form.name')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('support.form.namePlaceholder')}
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className={validationErrors.name ? 'border-red-500' : ''}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <Label htmlFor="phone">
                  {t('support.form.phone')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder={t('support.form.phonePlaceholder')}
                  value={formData.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className={validationErrors.phone ? 'border-red-500' : ''}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">{validationErrors.phone}</p>
                )}
              </div>

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message">
                  {t('support.form.message')} <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="message"
                  placeholder={t('support.form.messagePlaceholder')}
                  value={formData.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  className={validationErrors.message ? 'border-red-500' : ''}
                  rows={5}
                />
                {validationErrors.message && (
                  <p className="text-sm text-red-500">{validationErrors.message}</p>
                )}
              </div>

              {/* Submit Status Messages */}
              {submitStatus === 'success' && (
                <div className="p-3 rounded-md bg-green-50 border border-green-200">
                  <p className="text-sm text-green-600">{t('support.form.success')}</p>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{t('support.form.error')}</p>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    {t('support.form.sending')}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    {t('support.form.submit')}
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-4">
          {/* Phone Contact */}
          <Card className="border rounded-lg gap-2">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                {t('support.contact.phone.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="tel:+998940444581"
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                +998 94 044 45 81
              </a>
            </CardContent>
          </Card>

          {/* Telegram Contact */}
          <Card className="border rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                {t('support.contact.telegram.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <a
                href="https://t.me/yodda_online_manager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-medium text-blue-600 hover:underline"
              >
                {t('support.contact.telegram.link')}
              </a>
            </CardContent>
          </Card>

          {/* Social Media */}
          <Card className="border rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl">{t('support.contact.social.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-gray-600">{t('support.contact.social.description')}</p>
              <div className="flex gap-4">
                <a
                  href="https://www.instagram.com/yodda.uz/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
