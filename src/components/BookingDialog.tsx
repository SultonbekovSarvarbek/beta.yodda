import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MessageCircle, DollarSign } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutor: {
    fullname: string;
    image?: { medium?: string; small?: string } | null;
    formatsData: Array<{
      id: number;
      name: string;
      amount: number;
      duration: string | number;
    }>;
    phone?: string;
    email?: string;
    telegram?: string;
  };
}

export function BookingDialog({ open, onOpenChange, tutor }: BookingDialogProps) {
  const { t } = useTranslation();

  // Get primary format (first one or default)
  const primaryFormat = tutor.formatsData[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('bookingDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('bookingDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tutor Info Section */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage
                src={tutor.image?.medium || tutor.image?.small}
                alt={tutor.fullname}
              />
              <AvatarFallback>{tutor.fullname.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{tutor.fullname}</h3>
              {primaryFormat && (
                <p className="text-sm text-gray-600">
                  {primaryFormat.duration} {t('pricingCard.minutes')} • {primaryFormat.name}
                </p>
              )}
            </div>
          </div>

          {/* Price Section */}
          {primaryFormat && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  {t('bookingDialog.price')}
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600 ml-7">
                {primaryFormat.amount.toLocaleString()} {t('pricingCard.sumPerLesson')}
              </p>
            </div>
          )}

          {/* Contact Information Section */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-gray-700">
              {t('bookingDialog.contactInfo')}
            </h4>

            {/* Phone */}
            {tutor.phone ? (
              <a
                href={`tel:${tutor.phone}`}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Phone className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{tutor.phone}</p>
                  <p className="text-xs text-gray-500">{t('bookingDialog.phone')}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('bookingDialog.notProvided')}</p>
                  <p className="text-xs text-gray-400">{t('bookingDialog.phone')}</p>
                </div>
              </div>
            )}

            {/* Email */}
            {tutor.email ? (
              <a
                href={`mailto:${tutor.email}`}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{tutor.email}</p>
                  <p className="text-xs text-gray-500">{t('bookingDialog.email')}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('bookingDialog.notProvided')}</p>
                  <p className="text-xs text-gray-400">{t('bookingDialog.email')}</p>
                </div>
              </div>
            )}

            {/* Telegram */}
            {tutor.telegram ? (
              <a
                href={`https://t.me/${tutor.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MessageCircle className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">@{tutor.telegram.replace('@', '')}</p>
                  <p className="text-xs text-gray-500">{t('bookingDialog.telegram')}</p>
                </div>
              </a>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg opacity-50">
                <MessageCircle className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">{t('bookingDialog.notProvided')}</p>
                  <p className="text-xs text-gray-400">{t('bookingDialog.telegram')}</p>
                </div>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              {t('bookingDialog.note')}
            </p>
          </div>

          {/* Action Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            {t('bookingDialog.close')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
