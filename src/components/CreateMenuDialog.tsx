import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { FileText, Video } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface CreateMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMenuDialog({ open, onOpenChange }: CreateMenuDialogProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleCreateMiniLesson = () => {
    onOpenChange(false);
    navigate({ to: '/mini-lessons/upload' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{t('miniLessons.menu.title') || 'Создать'}</DialogTitle>
          <DialogDescription>
            {t('miniLessons.menu.description') || 'Выберите, что вы хотите создать'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 sm:gap-4 h-auto py-4 cursor-not-allowed opacity-60"
            disabled
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left whitespace-normal">
              <p className="font-medium">{t('miniLessons.menu.createPost')} (скоро)</p>
              <p className="text-xs text-muted-foreground break-words">
                {t('miniLessons.menu.postDescription') || 'Загрузите фото, добавьте описание и выберите предмет'}
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="w-full justify-start gap-2 sm:gap-4 h-auto py-4 cursor-pointer"
            onClick={handleCreateMiniLesson}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
              <Video className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 text-left whitespace-normal">
              <p className="font-medium">{t('miniLessons.menu.createLesson')}</p>
              <p className="text-xs text-muted-foreground break-words">
                {t('miniLessons.menu.lessonDescription') || 'Загрузите видео или фото урок'}
              </p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
