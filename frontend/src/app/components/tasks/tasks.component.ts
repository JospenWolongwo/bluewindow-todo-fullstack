import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/Task';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {
  tasks: Task[] = [];
  errorMessage: string = '';
  selectedTask: Task | null = null;
  showAddTask: boolean = false;
  subscription: Subscription;

  constructor(
    private taskService: TaskService, 
    private uiService: UiService
  ) {
    this.subscription = this.uiService.onToggle().subscribe(
      value => this.showAddTask = value
    );
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => this.tasks = tasks,
      error: (error) => this.errorMessage = error
    });
  }

  deleteTask(task: Task): void {
    if (!task.id) return;
    
    this.taskService.deleteTask(task.id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter(t => t.id !== task.id);
        this.errorMessage = '';
      },
      error: (error) => this.errorMessage = `Error deleting task: ${error}`
    });
  }

  editTask(task: Task): void {
    this.selectedTask = { ...task };
  }

  updateTask(task: Task): void {
    if (!task.id) return;
    
    this.taskService.updateTask(task).subscribe({
      next: (updatedTask) => {
        this.tasks = this.tasks.map(t => 
          t.id === updatedTask.id ? updatedTask : t
        );
        this.selectedTask = null;
        this.errorMessage = '';
      },
      error: (error) => this.errorMessage = `Error updating task: ${error}`
    });
  }

  addTask(task: Task): void {
    this.taskService.addTask(task).subscribe({
      next: (newTask) => {
        this.tasks.push(newTask);
        this.errorMessage = '';
      },
      error: (error) => this.errorMessage = `Error adding task: ${error}`
    });
  }

  cancelEdit(): void {
    this.selectedTask = null;
  }
}
