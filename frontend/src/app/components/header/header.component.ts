import { Component, OnInit, OnDestroy } from '@angular/core';
import { UiService } from 'src/app/services/ui.service';
import { Subscription } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [CommonModule, RouterModule, ButtonComponent],
  standalone: true
})
export class HeaderComponent implements OnInit, OnDestroy {

  title: string = 'Task Tracker';
  showAddTask: boolean = false;
  subscription!: Subscription;
  authSubscription!: Subscription;
  isLoggedIn: boolean = false;
  username: string = '';

  constructor(
    private uiService: UiService, 
    private router: Router,
    private authService: AuthService
  ) {
    this.subscription = this.uiService.onToggle().subscribe((value) => this.showAddTask = value);
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.username = user?.username || '';
    });
  }

  ngOnInit(): void {
    // Check if user is already logged in
    this.isLoggedIn = this.authService.isLoggedIn;
    if (this.isLoggedIn) {
      this.username = this.authService.currentUserValue?.username || '';
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.authSubscription.unsubscribe();
  }

  toggleAddTask() {
    this.uiService.toggleAddTask();
  }

  hasRouter(route: string) {
    return this.router.url === route;
  }

  onLogout() {
    this.authService.logout();
  }
}
