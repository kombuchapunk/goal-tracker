'use client';

import { useState, useEffect } from 'react';
import { Goal, CalendarEvent } from '@/lib/types';
import { loadGoals, saveGoals } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GoalList from './GoalList';
import GoalCalendar from './GoalCalendar';
import WeeklyCalendar from './WeeklyCalendar';
import { Button } from './ui/button';
import { PlusCircle } from 'lucide-react';
import NewGoalDialog from './NewGoalDialog';

export default function GoalDashboard() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isNewGoalOpen, setIsNewGoalOpen] = useState(false);

  useEffect(() => {
    setGoals(loadGoals());
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents).map((event: any) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(parsedEvents);
    }
  }, []);

  const handleGoalUpdate = (updatedGoal: Goal) => {
    const newGoals = goals.map(g => g.id === updatedGoal.id ? updatedGoal : g);
    setGoals(newGoals);
    saveGoals(newGoals);
  };

  const handleNewGoal = (goal: Goal) => {
    const newGoals = [...goals, goal];
    setGoals(newGoals);
    saveGoals(newGoals);
    setIsNewGoalOpen(false);
  };

  const handleNewEvent = (event: CalendarEvent) => {
    const newEvents = [...events, event];
    setEvents(newEvents);
    localStorage.setItem('events', JSON.stringify(newEvents));
  };

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Goal Tracker</h1>
        <Button onClick={() => setIsNewGoalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Goal
        </Button>
      </div>

      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-[400px] grid-cols-3">
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="month">Month View</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="mt-6">
          <WeeklyCalendar
            goals={goals}
            events={events}
            onEventAdd={handleNewEvent}
          />
        </TabsContent>

        <TabsContent value="month" className="mt-6">
          <GoalCalendar goals={goals} />
        </TabsContent>

        <TabsContent value="goals" className="mt-6">
          <GoalList goals={goals} onGoalUpdate={handleGoalUpdate} />
        </TabsContent>
      </Tabs>

      <NewGoalDialog
        open={isNewGoalOpen}
        onOpenChange={setIsNewGoalOpen}
        onSave={handleNewGoal}
      />
    </div>
  );
}