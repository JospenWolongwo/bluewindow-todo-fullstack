export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  created_at: Date;
  updated_at: Date;
}

export type CreateTask = Omit<Task, 'id' | 'created_at' | 'updated_at'>;
export type UpdateTask = Partial<CreateTask>;
