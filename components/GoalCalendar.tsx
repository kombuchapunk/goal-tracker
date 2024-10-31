'use client';

import { Goal } from '@/lib/types';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { format } from 'date-fns';

interface GoalCalendarProps {
  goals: Goal[];
}

export default function GoalCalendar({ goals }: GoalCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getDayContent = (day: Date | undefined) => {
    if (!day) return null;
    
    const dayOfWeek = day.getDay();
    const tasksForDay = goals.flatMap(goal => 
      goal.weeklyTasks.filter(task => task.dayOfWeek === dayOfWeek)
    );

    if (tasksForDay.length === 0) return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 h-1 flex gap-0.5">
        {tasksForDay.map((task, i) => (
          <div
            key={`${task.id}-${i}`}
            className="flex-1 bg-primary/50 rounded-full"
            style={{
              maxWidth: `${100 / tasksForDay.length}%`
            }}
          />
        ))}
      </div>
    );
  };

  const footer = date ? (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Tasks for {format(date, 'EEEE')}:</h3>
      <div className="space-y-2">
        {goals.flatMap(goal =>
          goal.weeklyTasks
            .filter(task => task.dayOfWeek === date.getDay())
            .map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between text-sm p-2 bg-muted rounded-md"
              >
                <div>
                  <span className="font-medium">{task.title}</span>
                  <span className="text-muted-foreground ml-2">({goal.title})</span>
                </div>
                <span>{task.timeSlot}</span>
              </div>
            ))
        )}
      </div>
    </div>
  ) : null;

  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        components={{
          DayContent: ({ date: dayDate }) => (
            <div className="relative w-full h-full p-2">
              <span>{dayDate?.getDate()}</span>
              {getDayContent(dayDate)}
            </div>
          ),
        }}
      />
      {footer}
    </Card>
  );
}