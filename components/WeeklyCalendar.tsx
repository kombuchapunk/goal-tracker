'use client';

import { useState } from 'react';
import { addDays, startOfWeek, format, isSameDay } from 'date-fns';
import { Goal, WeeklyTask, CalendarEvent } from '@/lib/types';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import NewEventDialog from './NewEventDialog';
import TimeGrid from './TimeGrid';

interface WeeklyCalendarProps {
  goals: Goal[];
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
}

export default function WeeklyCalendar({ goals, events, onEventAdd }: WeeklyCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isNewEventOpen, setIsNewEventOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setIsNewEventOpen(true);
  };

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(event.start, date));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
          </span>
        </div>
        <Button onClick={() => setIsNewEventOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-8 gap-px bg-border">
        <div className="bg-background p-2 sticky left-0 z-10">
          <div className="h-12" /> {/* Time header spacer */}
        </div>
        {weekDays.map(day => (
          <div key={day.toISOString()} className="bg-background p-2">
            <div className="text-center">
              <div className="font-medium">{format(day, 'EEE')}</div>
              <div className="text-sm text-muted-foreground">{format(day, 'd')}</div>
            </div>
          </div>
        ))}
      </div>

      <TimeGrid
        weekDays={weekDays}
        events={events}
        onTimeSlotClick={handleTimeSlotClick}
      />

      <NewEventDialog
        open={isNewEventOpen}
        onOpenChange={setIsNewEventOpen}
        onSave={onEventAdd}
        goals={goals}
        initialDate={selectedDate}
        initialTime={selectedTime}
      />
    </Card>
  );
}