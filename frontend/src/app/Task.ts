export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id?: number;
  title: string;
  text?: string;
  description?: string;
  priority: TaskPriority;
  day?: string;
  reminder?: boolean;
  created_at?: Date;
  updated_at?: Date;
  userId?: number;
}
