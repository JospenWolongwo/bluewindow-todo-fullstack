import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Task, TaskPriority } from 'src/app/Task';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter();
  
  // Form fields
  title: string = '';
  description: string = '';
  priority: TaskPriority = 'medium';
  
  showAddTask!: boolean;
  subscription!: Subscription;

  constructor(private uiService: UiService) {
    this.subscription = this.uiService.onToggle().subscribe((value) => this.showAddTask = value);
  }

  ngOnInit(): void {
    // Initialize component
  }

  onSubmit() {
    if (!this.title) {
      alert('Please enter a task title');
      return;
    }

    const newTask: Task = {
      title: this.title,
      description: this.description,
      priority: this.priority
    };

    this.onAddTask.emit(newTask);
    
    // Reset form
    this.title = '';
    this.description = '';
    this.priority = 'medium';
  }
}
