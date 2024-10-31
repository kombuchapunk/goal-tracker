'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useState, useEffect } from 'react';
import { Goal, CalendarEvent } from '@/lib/types';
import { addMinutes, format } from 'date-fns';

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (event: CalendarEvent) => void;
  goals: Goal[];
  initialDate: Date | null;
  initialTime: string | null;
}

export default function NewEventDialog({
  open,
  onOpenChange,
  onSave,
  goals,
  initialDate,
  initialTime,
}: NewEventDialogProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [goalId, setGoalId] = useState('none'); // Changed from empty string to 'none'

  useEffect(() => {
    if (initialDate) {
      setDate(format(initialDate, 'yyyy-MM-dd'));
    }
    if (initialTime) {
      setStartTime(initialTime);
    }
  }, [initialDate, initialTime]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDate = new Date(`${date}T${startTime}`);
    const endDate = addMinutes(startDate, parseInt(duration));

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      start: startDate,
      end: endDate,
      goalId: goalId === 'none' ? '' : goalId,
      taskId: '',
    };

    onSave(newEvent);
    onOpenChange(false);
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setStartTime('');
    setDuration('60');
    setGoalId('none');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="15"
                step="15"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goal">Related Goal (optional)</Label>
            <Select value={goalId} onValueChange={setGoalId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No related goal</SelectItem>
                {goals.map((goal) => (
                  <SelectItem key={goal.id} value={goal.id}>
                    {goal.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">Save Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}