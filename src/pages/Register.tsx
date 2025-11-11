/**
 * Register Page
 * Handles user registration matching the design
 */

import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation, Trans } from 'react-i18next';
import { Eye, EyeOff, User, Phone, Mail, Lock, Briefcase } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UserRole } from '@/types/auth';

export function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
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

    if (!formData.email.trim()) {
      errors.email = t('auth.register.errors.required');
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      errors.email = t('auth.register.errors.invalidEmail');
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
        email: formData.email,
        role: formData.role as UserRole,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
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
      <Card className="w-full max-w-xl border">
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
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t('auth.register.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={`pl-10 ${validationErrors.name ? 'border-red-500' : ''}`}
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
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('auth.register.phonePlaceholder')}
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className={`pl-10 ${validationErrors.phone ? 'border-red-500' : ''}`}
                      required
                    />
                  </div>
                  {validationErrors.phone && (
                    <p className="text-sm text-red-500">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    {t('auth.register.email')}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('auth.register.emailPlaceholder')}
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={`pl-10 ${validationErrors.email ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
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
                  onValueChange={(value) => updateField('role', value)}
                >
                  <SelectTrigger
                    className={validationErrors.role ? 'border-red-500' : ''}
                  >
                    <SelectValue placeholder={t('auth.register.rolePlaceholder')} />
                  </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seeker">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t('auth.register.roleSeeker')}
                        </div>
                      </SelectItem>
                      <SelectItem value="tutor">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          {t('auth.register.roleTutor')}
                        </div>
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.passwordPlaceholder')}
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={`pl-10 pr-10 bg-white ${validationErrors.password ? 'border-red-500' : ''}`}
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder={t('auth.register.confirmPasswordPlaceholder')}
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      className={`pl-10 pr-10 bg-white ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
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

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-base font-semibold"
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
