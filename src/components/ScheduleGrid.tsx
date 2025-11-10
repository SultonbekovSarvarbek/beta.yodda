import { useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Schedule, FormatData } from '@/types/tutor';
import { useTranslation } from 'react-i18next';

interface ScheduleGridProps {
  schedule: Schedule;
  formatsData: FormatData[];
  onBookSlot?: (date: string, time: string) => void;
}

export function ScheduleGrid({ schedule, formatsData, onBookSlot }: ScheduleGridProps) {
  const { t } = useTranslation();
  const [weekOffset, setWeekOffset] = useState(0);

  // Get lesson duration from first format (in minutes)
  const getDurationMinutes = (): number => {
    if (!formatsData || formatsData.length === 0) return 60;
    const duration = formatsData[0].duration;

    // If duration is already a number, return it directly
    if (typeof duration === 'number') return duration;

    // If duration is a string, parse it
    if (typeof duration === 'string') {
      const match = duration.match(/(\d+)/);
      return match ? parseInt(match[1]) : 60;
    }

    return 60; // fallback
  };

  const durationMinutes = getDurationMinutes();

  // Get Monday of current week (or offset week)
  const getMondayOfWeek = (offset: number): Date => {
    const today = new Date();
    const day = today.getDay();
    // Calculate days to subtract to get to Monday
    const daysToMonday = day === 0 ? 6 : day - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - daysToMonday);
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() + offset * 7);
    return monday;
  };

  // Generate 7 days starting from Monday
  const getWeekDays = () => {
    const monday = getMondayOfWeek(weekOffset);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday.getTime()); // Use getTime() for clean copy
      date.setDate(monday.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  // Day keys for schedule lookup
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

  // Generate time slots (8:00 to 22:00) every 30 minutes
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    for (let hour = 8; hour < 22; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Format date as DD.MM.YYYY
  const formatDate = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Format time range
  const formatTimeRange = (startTime: string): string => {
    const [hours, minutes] = startTime.split(':');
    const startHour = parseInt(hours);
    const endHour = startHour + Math.floor(durationMinutes / 60);
    const endMinutes = (parseInt(minutes) + (durationMinutes % 60)) % 60;
    return `${startTime}-${endHour.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  };

  // Normalize time format to HH:MM (with leading zeros)
  const normalizeTime = (time: string): string => {
    const trimmed = time.trim();
    const [hours, minutes = '00'] = trimmed.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };

  // Check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if slot is available
  const isSlotAvailable = (date: Date, dayKey: string, time: string): boolean => {
    const now = new Date();
    const slotDateTime = new Date(date.getTime()); // Use getTime() for clean copy
    const [hours, minutes] = time.split(':');
    slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    // Check if slot is in the past
    if (slotDateTime < now) return false;

    // Check if slot is in tutor's schedule
    const daySchedule = schedule[dayKey as keyof Schedule];
    if (!daySchedule || daySchedule.length === 0) return false;

    // Normalize the time for comparison
    const normalizedTime = normalizeTime(time);

    // Check if the time matches the start of any time range
    return daySchedule.some(range => {
      const startTime = normalizeTime(range.split('-')[0]);
      return startTime === normalizedTime;
    });
  };

  // Handle previous week
  const handlePreviousWeek = () => {
    setWeekOffset(weekOffset - 1);
  };

  // Handle next week
  const handleNextWeek = () => {
    setWeekOffset(weekOffset + 1);
  };

  // Handle slot click
  const handleSlotClick = (date: Date, time: string) => {
    const dateStr = formatDate(date);
    onBookSlot?.(dateStr, time);
  };

  return (
    <div className="space-y-4">
      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={handlePreviousWeek}
          className="flex-1 sm:flex-none rounded-full px-6"
        >
          {t('schedule.previousWeek')}
        </Button>
        <Button
          variant="outline"
          onClick={handleNextWeek}
          className="flex-1 sm:flex-none rounded-full px-6"
        >
          {t('schedule.nextWeek')}
        </Button>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <div className="grid grid-cols-7 gap-0 min-w-[1000px] border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white">
          {/* Day Headers */}
          {weekDays.map((date, index) => {
            const dayKey = dayKeys[index];
            const isTodayColumn = isToday(date);

            return (
              <div
                key={index}
                className={`border-r last:border-r-0 border-gray-200 ${
                  isTodayColumn ? 'bg-blue-50/50' : 'bg-white'
                }`}
              >
                {/* Day Name */}
                <div
                  className={`text-center py-4 border-b border-gray-200 font-semibold text-base ${
                    isTodayColumn ? 'text-blue-600 bg-blue-50' : 'text-gray-900 bg-gray-50'
                  }`}
                >
                  {t(`days.${dayKey}`)}
                </div>

                {/* Date */}
                <div
                  className={`text-center py-3 border-b border-gray-200 text-sm font-medium ${
                    isTodayColumn ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {formatDate(date)}
                </div>

                {/* Time Slots */}
                <div className="py-3 px-2 space-y-1.5">
                  {timeSlots.map((time) => {
                    const available = isSlotAvailable(date, dayKey, time);
                    const timeRange = formatTimeRange(time);

                    return (
                      <div
                        key={time}
                        onClick={() => available && handleSlotClick(date, time)}
                        className={`text-center py-2.5 px-2 rounded-md transition-all duration-200 text-sm ${
                          available
                            ? 'text-gray-900 bg-blue-100 cursor-pointer hover:shadow-sm border-transparent hover:border-blue-200'
                            : 'text-gray-400 line-through bg-gray-50/50'
                        }`}
                      >
                        {timeRange}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
