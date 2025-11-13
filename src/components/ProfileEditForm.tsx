/**
 * Profile Edit Form Component
 * Allows users to update their profile information (name, email, phone)
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { updateProfile, type UpdateProfileRequest } from '@/services/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function ProfileEditForm() {
  const { t } = useTranslation();
  const { user, refreshProfile } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateProfileRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateProfileRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = t('profileEdit.errors.nameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('profileEdit.errors.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('profileEdit.errors.emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('profileEdit.errors.phoneRequired');
    } else if (!/^\+998\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('profileEdit.errors.phoneInvalid');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await updateProfile(formData);
      await refreshProfile();
      toast.success(t('profileEdit.updateSuccess'));
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || t('profileEdit.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof UpdateProfileRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Card className="border rounded-md">
      <CardHeader className="p-4 md:p-6">
        <CardTitle className="text-lg sm:text-xl">{t('profileEdit.title')}</CardTitle>
        <CardDescription className="text-sm">{t('profileEdit.description')}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 md:p-6 pt-0">
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="text-sm">{t('profileEdit.name')}</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder={t('profileEdit.namePlaceholder')}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-xs sm:text-sm text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="email" className="text-sm">{t('profileEdit.email')}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder={t('profileEdit.emailPlaceholder')}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className="text-xs sm:text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="phone" className="text-sm">{t('profileEdit.phone')}</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder={t('profileEdit.phonePlaceholder')}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && <p className="text-xs sm:text-sm text-red-500">{errors.phone}</p>}
          </div>

          <Button type="submit" disabled={isLoading} variant="success" className="w-full mt-4 sm:mt-6">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('profileEdit.saveChanges')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
