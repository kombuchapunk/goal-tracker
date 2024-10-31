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
import { useState } from 'react';
import { Goal, WeeklyTask } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Plus, Trash2 } from 'lucide-react';

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (goal: Goal) => void;
}

export default function EditGoalDialog({
  goal,
  open,
  onOpenChange,
  onSave,
}: EditGoalDialogProps) {
  const [editedGoal, setEditedGoal] = useState<Goal>({ ...goal });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editedGoal);
  };

  const addTask = () => {
    const newTask: WeeklyTask = {
      id: Date.now().toString(),
      goalId: goal.id,
      title: '',
      duration: 30,
      dayOfWeek: 1,
      timeSlot: '09:00',
      isCompleted: false,
    };
    setEditedGoal({
      ...editedGoal,
      weeklyTasks: [...editedGoal.weeklyTasks, newTask],
    });
  };

  const updateTask = (taskId: string, updates: Partial<WeeklyTask>) => {
    setEditedGoal({
      ...editedGoal,
      weeklyTasks: editedGoal.weeklyTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    });
  };

  const removeTask = (taskId: string) => {
    setEditedGoal({
      ...editedGoal,
      weeklyTasks: editedGoal.weeklyTasks.filter((task) => task.id !== taskId),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Goal Details</TabsTrigger>
              <TabsTrigger value="tasks">Weekly Tasks</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editedGoal.title}
                  onChange={(e) =>
                    setEditedGoal({ ...editedGoal, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={editedGoal.category}
                  onChange={(e) =>
                    setEditedGoal({ ...editedGoal, category: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editedGoal.status}
                  onValueChange={(value) =>
                    setEditedGoal({
                      ...editedGoal,
                      status: value as Goal['status'],
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_started">Not Started</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={editedGoal.progress}
                  onChange={(e) =>
                    setEditedGoal({
                      ...editedGoal,
                      progress: parseInt(e.target.value),
                    })
                  }
                />
              </div>
            </TabsContent>

            <TabsContent value="tasks" className="space-y-4">
              <Button type="button" onClick={addTask}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
              {editedGoal.weeklyTasks.map((task) => (
                <div
                  key={task.id}
                  className="grid grid-cols-[1fr,auto,auto,auto,auto] gap-2 items-center"
                >
                  <Input
                    value={task.title}
                    onChange={(e) =>
                      updateTask(task.id, { title: e.target.value })
                    }
                    placeholder="Task title"
                  />
                  <Input
                    type="number"
                    value={task.duration}
                    onChange={(e) =>
                      updateTask(task.id, { duration: parseInt(e.target.value) })
                    }
                    className="w-20"
                    min="1"
                    placeholder="Minutes"
                  />
                  <Select
                    value={task.dayOfWeek.toString()}
                    onValueChange={(value) =>
                      updateTask(task.id, { dayOfWeek: parseInt(value) })
                    }
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Sunday</SelectItem>
                      <SelectItem value="1">Monday</SelectItem>
                      <SelectItem value="2">Tuesday</SelectItem>
                      <SelectItem value="3">Wednesday</SelectItem>
                      <SelectItem value="4">Thursday</SelectItem>
                      <SelectItem value="5">Friday</SelectItem>
                      <SelectItem value="6">Saturday</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="time"
                    value={task.timeSlot}
                    onChange={(e) =>
                      updateTask(task.id, { timeSlot: e.target.value })
                    }
                    className="w-32"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeTask(task.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}