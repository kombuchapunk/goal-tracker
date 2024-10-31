'use client';

import { Goal } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Edit2, Plus } from 'lucide-react';
import { useState } from 'react';
import EditGoalDialog from './EditGoalDialog';

interface GoalListProps {
  goals: Goal[];
  onGoalUpdate: (goal: Goal) => void;
}

export default function GoalList({ goals, onGoalUpdate }: GoalListProps) {
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);

  const getStatusColor = (status: Goal['status']) => {
    switch (status) {
      case 'not_started':
        return 'bg-red-500';
      case 'in_progress':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {goals.map((goal) => (
        <Card key={goal.id} className="relative">
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle className="text-xl">{goal.title}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingGoal(goal)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline">{goal.category}</Badge>
              <Badge
                className={`${getStatusColor(goal.status)} text-white`}
              >
                {goal.status.replace('_', ' ')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Progress</span>
                  <span>{goal.progress}%</span>
                </div>
                <Progress value={goal.progress} />
              </div>
              <div>
                <h4 className="font-medium mb-2">Weekly Tasks</h4>
                <div className="space-y-2">
                  {goal.weeklyTasks.map((task) => (
                    <div
                      key={task.id}
                      className="text-sm flex items-center justify-between"
                    >
                      <span>{task.title}</span>
                      <span className="text-muted-foreground">
                        {task.duration}min
                      </span>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => setEditingGoal(goal)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {editingGoal && (
        <EditGoalDialog
          goal={editingGoal}
          open={!!editingGoal}
          onOpenChange={(open) => !open && setEditingGoal(null)}
          onSave={(updatedGoal) => {
            onGoalUpdate(updatedGoal);
            setEditingGoal(null);
          }}
        />
      )}
    </div>
  );
}