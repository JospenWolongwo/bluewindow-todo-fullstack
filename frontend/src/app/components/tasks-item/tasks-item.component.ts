import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from 'src/app/Task';
import { faTimes, faEdit } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-tasks-item',
  templateUrl: './tasks-item.component.html',
  styleUrls: ['./tasks-item.component.css'],
  standalone: true,
  imports: [CommonModule, FontAwesomeModule]
})
export class TasksItemComponent implements OnInit {
  constructor() { }
  @Input() task!: Task;
  @Output() onDeleteTask: EventEmitter<Task> = new EventEmitter();
  @Output() onEditTask: EventEmitter<Task> = new EventEmitter();
  faTimes = faTimes;
  faEdit = faEdit;

  ngOnInit(): void {
    // Initialize component
  }

  onDelete(task: Task) {
    this.onDeleteTask.emit(task);
  }

  onEdit(task: Task) {
    this.onEditTask.emit(task);
  }

  getPriorityClass(priority: string): string {
    return `priority-${priority.toLowerCase()}`;
  }
}
