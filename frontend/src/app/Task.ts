export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id?: number;
    title: string;
    description?: string;
    priority: TaskPriority;
    created_at?: Date;
    updated_at?: Date;
}