'use client';

import { format, addMinutes, addHours, isSameDay, subDays } from 'date-fns';
import { CalendarEvent } from '@/lib/types';
import { cn } from '@/lib/utils';

interface TimeGridProps {
  weekDays: Date[];
  events: CalendarEvent[];
  onTimeSlotClick: (date: Date, time: string) => void;
}

export default function TimeGrid({ weekDays, events, onTimeSlotClick }: TimeGridProps) {
  // Generate time slots from 10:00 to 09:00 next day (23 hours)
  const timeSlots = Array.from({ length: 46 }, (_, i) => {
    const baseTime = new Date().setHours(10, 0, 0, 0);
    const time = addMinutes(baseTime, i * 30);
    return format(time, 'HH:mm');
  });

  const getEventsForSlot = (day: Date, timeSlot: string) => {
    const [hours, minutes] = timeSlot.split(':').map(Number);
    const isNextDay = hours < 10; // If time is before 10 AM, it belongs to the next day
    const eventDay = isNextDay ? addHours(day, 24) : day;
    
    return events.filter(event => {
      const eventTime = format(event.start, 'HH:mm');
      const eventDate = event.start;
      const adjustedEventDate = format(eventDate, 'HH:mm') < '10:00' 
        ? subDays(eventDate, 1) 
        : eventDate;
      
      return isSameDay(adjustedEventDate, day) && eventTime === timeSlot;
    });
  };

  return (
    <div className="grid grid-cols-8 gap-px bg-border overflow-auto max-h-[800px]">
      {/* Time labels column */}
      <div className="bg-background sticky left-0 z-10">
        {timeSlots.map(time => (
          <div
            key={time}
            className="h-12 border-b border-border flex items-center justify-end pr-2"
          >
            <span className="text-sm text-muted-foreground">{time}</span>
          </div>
        ))}
      </div>

      {/* Days columns */}
      {weekDays.map(day => (
        <div key={day.toISOString()} className="bg-background">
          {timeSlots.map(time => {
            const eventsInSlot = getEventsForSlot(day, time);
            const [hours] = time.split(':').map(Number);
            const isNextDay = hours < 10;
            
            return (
              <div
                key={`${day.toISOString()}-${time}`}
                className={cn(
                  'h-12 border-b border-border relative group cursor-pointer',
                  'hover:bg-accent/50 transition-colors',
                  isNextDay && 'bg-muted/30'
                )}
                onClick={() => onTimeSlotClick(isNextDay ? addHours(day, 24) : day, time)}
              >
                {eventsInSlot.map(event => (
                  <div
                    key={event.id}
                    className="absolute inset-x-1 h-11 bg-primary/10 border-l-4 border-primary rounded-sm p-1"
                  >
                    <div className="text-xs font-medium truncate">{event.title}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}