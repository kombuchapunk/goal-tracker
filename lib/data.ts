import { Goal } from './types';

export const initialGoals: Goal[] = [
  {
    id: '1',
    title: 'Start learning to play guitar',
    status: 'not_started',
    progress: 0,
    category: 'Learning',
    description: 'Learn basic chords and practice regularly',
    weeklyTasks: [
      {
        id: 'task1',
        goalId: '1',
        title: 'Guitar Practice',
        description: 'Practice basic chords',
        duration: 60,
        dayOfWeek: 1,
        timeSlot: '18:00',
        isCompleted: false
      }
    ]
  },
  {
    id: '2',
    title: 'Complete Google Cybersecurity Professional certificate',
    status: 'in_progress',
    progress: 35,
    category: 'Career',
    weeklyTasks: [
      {
        id: 'task2',
        goalId: '2',
        title: 'Study Session',
        duration: 90,
        dayOfWeek: 2,
        timeSlot: '19:00',
        isCompleted: false
      }
    ]
  },
  {
    id: '3',
    title: 'Start learning German',
    status: 'not_started',
    progress: 0,
    category: 'Learning',
    weeklyTasks: []
  },
  // ... add the rest of your goals here
];

// Load goals from localStorage or use initial data
export const loadGoals = (): Goal[] => {
  if (typeof window === 'undefined') return initialGoals;
  const stored = localStorage.getItem('goals');
  return stored ? JSON.parse(stored) : initialGoals;
};

// Save goals to localStorage
export const saveGoals = (goals: Goal[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('goals', JSON.stringify(goals));
};