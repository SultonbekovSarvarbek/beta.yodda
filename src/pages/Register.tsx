/**
 * Register Page
 * Handles user registration matching the design
 */

import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation, Trans } from 'react-i18next';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/types/auth';
import { UserRole as UserRoleEnum } from '@/constants/roles';

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    telegram: '',
    role: '' as UserRole | '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = t('auth.register.errors.required');
    }

    if (!formData.phone.trim()) {
      errors.phone = t('auth.register.errors.required');
    } else if (!formData.phone.match(/^\+998\d{9}$/)) {
      errors.phone = t('auth.register.errors.invalidPhone');
    }

    // Validate telegram username for seekers
    if (formData.role === 'seeker') {
      if (!formData.telegram.trim()) {
        errors.telegram = t('auth.register.errors.required');
      } else if (!formData.telegram.match(/^@?[a-zA-Z0-9_]{5,32}$/)) {
        errors.telegram = t('auth.register.errors.invalidTelegram');
      }
    }

    if (!formData.role) {
      errors.role = t('auth.register.errors.required');
    }

    if (!formData.password.trim()) {
      errors.password = t('auth.register.errors.required');
    } else if (formData.password.length < 6) {
      errors.password = t('auth.register.errors.minPassword');
    }

    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = t('auth.register.errors.required');
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = t('auth.register.errors.passwordMismatch');
    }

    if (!agreedToTerms) {
      errors.terms = t('auth.register.errors.required');
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) {
      return;
    }

    try {
      await register({
        name: formData.name,
        phone: formData.phone,
        telegram: formData.telegram,
        role: formData.role as UserRole,
        role_id: formData.role === 'tutor' ? UserRoleEnum.TUTOR : UserRoleEnum.SEEKER,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        termsAccepted: agreedToTerms,
      });
      // Navigate to profile after successful registration
      navigate({ to: '/profile' });
    } catch (err) {
      // Error is handled by AuthContext
      console.error('Registration failed:', err);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  return (
    <div className="flex items-center justify-center px-4 py-12 min-h-screen">
      <Card className="w-full max-w-xl border rounded-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t('auth.register.title')}
            </CardTitle>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  {t('auth.register.fullName')} <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.register.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={validationErrors.name ? 'border-red-500' : ''}
                    required
                  />
                </div>
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Phone Number Field */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    {t('auth.register.phoneNumber')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('auth.register.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={validationErrors.phone ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Telegram Username Field (for seekers) */}
                <div className="space-y-2">
                  <Label htmlFor="telegram" className="flex items-center gap-2">
                    {t('auth.register.telegram')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="telegram"
                      type="text"
                      placeholder={t('auth.register.telegramPlaceholder')}
                      value={formData.telegram}
                      onChange={(e) => updateField('telegram', e.target.value)}
                      className={validationErrors.telegram ? 'border-red-500' : ''}
                      required
                    />
                  </div>
                  {validationErrors.telegram && (
                    <p className="text-sm text-red-500">{validationErrors.telegram}</p>
                  )}
                </div>
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2">
                  {t('auth.register.role')} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => {
                    if (value === 'tutor') {
                      // Redirect to tutor registration form
                      navigate({ to: '/be-tutor' });
                    } else {
                      updateField('role', value);
                    }
                  }}
                >
                  <SelectTrigger
                     className={`w-full ${validationErrors.role ? 'border-red-500' : ''}`}
                  >
                    <SelectValue placeholder={t('auth.register.rolePlaceholder')} />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeker">
                        {t('auth.register.roleSeeker')}
                      </SelectItem>
                      <SelectItem value="tutor">
                        {t('auth.register.roleTutor')}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                {validationErrors.role && (
                  <p className="text-sm text-red-500">{validationErrors.role}</p>
                )}
              </div>

              {/* Password Fields */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    {t('auth.register.password')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`pr-10 bg-white ${validationErrors.password ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-sm text-red-500">{validationErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                    {t('auth.register.confirmPassword')} <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.confirmPasswordPlaceholder')}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      className={`pr-10 bg-white ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="space-y-2">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={agreedToTerms}
                    onCheckedChange={(checked) => {
                      setAgreedToTerms(checked as boolean);
                      if (validationErrors.terms) {
                        setValidationErrors({ ...validationErrors, terms: '' });
                      }
                    }}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
                    <Trans
                      i18nKey="auth.register.agreeTerms"
                      components={{
                        termsLink: (
                          <a
                            href="/terms"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                        privacyLink: (
                          <a
                            href="/privacy"
                            className="text-blue-600 hover:underline font-medium"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ),
                      }}
                      values={{
                        termsLink: t('auth.register.termsOfUse'),
                        privacyLink: t('auth.register.privacyPolicy'),
                      }}
                    />
                  </Label>
                </div>
                {validationErrors.terms && (
                  <p className="text-sm text-red-500">{validationErrors.terms}</p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 mt-4">
              <Button
                type="submit"
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    {t('common.submit')}
                  </span>
                ) : (
                  t('auth.register.registerButton')
                )}
              </Button>

              <p className="text-sm text-center text-gray-600">
                {t('auth.register.haveAccount')}{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  {t('auth.register.signIn')}
                </Link>
              </p>
            </CardFooter>
        </form>
      </Card>
    </div>
  );
}
