export type TabType = 'dashboard' | 'cleanup' | 'scheduler' | 'cisco' | 'citrix' | 'lockscreen' | 'configmgr';

export interface Ticket {
  id: string;
  user: string;
  email: string;
  department: string;
  location: 'WFH' | 'Office';
  subject: string;
  description: string;
  category: 'cleanup' | 'cisco' | 'citrix' | 'scheduler' | 'configmgr' | 'lockscreen';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  resolutionSteps?: string[];
  suggestedAction?: string;
  resolutionLog?: string;
}

export interface MetricCard {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  iconName: string;
  description: string;
}

export interface ScheduleTask {
  id: string;
  title: string;
  type: 'driver' | 'patch' | 'clean';
  target: string;
  time: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  status: 'active' | 'completed' | 'pending';
  lastRun: string;
}
