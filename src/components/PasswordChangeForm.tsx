/**
 * Password Change Form Component
 * Allows users to change their password
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { changePassword, type ChangePasswordRequest } from '@/services/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff } from 'lucide-react';

export function PasswordChangeForm() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [formData, setFormData] = useState<ChangePasswordRequest>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordRequest, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ChangePasswordRequest, string>> = {};

    if (!formData.current_password) {
      newErrors.current_password = t('passwordChange.errors.currentPasswordRequired');
    }

    if (!formData.password) {
      newErrors.password = t('passwordChange.errors.newPasswordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('passwordChange.errors.passwordMinLength');
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = t('passwordChange.errors.confirmPasswordRequired');
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = t('passwordChange.errors.passwordMismatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !user) {
      return;
    }

    setIsLoading(true);

    try {
      await changePassword(user.id, formData);
      toast.success(t('passwordChange.updateSuccess'));
      // Reset form
      setFormData({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.message || t('passwordChange.updateError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof ChangePasswordRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('passwordChange.title')}</CardTitle>
        <CardDescription>{t('passwordChange.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current_password">{t('passwordChange.currentPassword')}</Label>
            <div className="relative">
              <Input
                id="current_password"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.current_password}
                onChange={(e) => handleChange('current_password', e.target.value)}
                placeholder={t('passwordChange.currentPasswordPlaceholder')}
                className={errors.current_password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.current_password && <p className="text-sm text-red-500">{errors.current_password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('passwordChange.newPassword')}</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                placeholder={t('passwordChange.newPasswordPlaceholder')}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password_confirmation">{t('passwordChange.confirmPassword')}</Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.password_confirmation}
                onChange={(e) => handleChange('password_confirmation', e.target.value)}
                placeholder={t('passwordChange.confirmPasswordPlaceholder')}
                className={errors.password_confirmation ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password_confirmation && <p className="text-sm text-red-500">{errors.password_confirmation}</p>}
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('passwordChange.changePassword')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
