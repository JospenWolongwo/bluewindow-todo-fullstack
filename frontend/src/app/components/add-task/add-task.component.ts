import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Task, TaskPriority } from 'src/app/Task';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AddTaskComponent implements OnInit {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  @Input() task: Task | null = null;

  // Form fields
  title: string = '';
  description: string = '';
  priority: TaskPriority = 'medium';
  day: string = '';
  reminder: boolean = false;

  showAddTask!: boolean;
  subscription!: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService
      .onToggle()
      .subscribe((value) => (this.showAddTask = value));
  }

  ngOnInit(): void {
    // If we have a task to edit, populate the form
    if (this.task) {
      this.title = this.task.title || this.task.text || '';
      this.description = this.task.description || '';
      this.priority = this.task.priority || 'medium';
      this.day = this.task.day || '';
      this.reminder = this.task.reminder || false;
    }
  }

  onSubmit() {
    if (!this.title) {
      alert('Please add a task!');
      return;
    }

    const newTask: Task = {
      id: this.task ? this.task.id : undefined,
      title: this.title,
      text: this.title,
      description: this.description,
      day: this.day,
      reminder: this.reminder,
      priority: this.priority,
    };

    this.onAddTask.emit(newTask);

    // Clear form
    this.title = '';
    this.description = '';
    this.day = '';
    this.reminder = false;
    this.priority = 'medium';
    this.task = null;
  }
}
