export type GoalStatus = 'not_started' | 'in_progress' | 'completed';

export interface Goal {
  id: string;
  title: string;
  status: GoalStatus;
  progress: number; // 0-100
  category: string;
  description?: string;
  startDate?: string;
  targetDate?: string;
  weeklyTasks: WeeklyTask[];
}

export interface WeeklyTask {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  timeSlot: string; // HH:mm format
  isCompleted: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  goalId: string;
  taskId: string;
}