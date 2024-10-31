import { Metadata } from 'next';
import GoalDashboard from '@/components/GoalDashboard';

export const metadata: Metadata = {
  title: 'Goal Tracker - Dashboard',
  description: 'Track your yearly goals and weekly tasks',
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <GoalDashboard />
    </main>
  );
}