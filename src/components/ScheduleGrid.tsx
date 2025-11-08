import { Card } from '@/components/ui/card';
import type { Schedule } from '@/types/tutor';
import { useTranslation } from 'react-i18next';

interface ScheduleGridProps {
  schedule: Schedule;
}

export function ScheduleGrid({ schedule }: ScheduleGridProps) {
  const { t } = useTranslation();

  const days = [
    { key: 'mon', label: t('days.monday') },
    { key: 'tue', label: t('days.tuesday') },
    { key: 'wed', label: t('days.wednesday') },
    { key: 'thu', label: t('days.thursday') },
    { key: 'fri', label: t('days.friday') },
    { key: 'sat', label: t('days.saturday') },
    { key: 'sun', label: t('days.sunday') },
  ] as const;

  return (
    <div className="space-y-3">
      {days.map((day) => {
        const daySchedule = schedule[day.key as keyof Schedule];
        const hasSlots = daySchedule && daySchedule.length > 0;

        return (
          <Card key={day.key} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-semibold text-sm mb-2">{day.label}</h4>
                {hasSlots ? (
                  <div className="flex flex-wrap gap-2">
                    {daySchedule.map((time, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
