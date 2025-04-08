import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  constructor(private http: HttpClient, private router: Router) {
    this.loadStoredUser();
  }

  private loadStoredUser(): void {
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('current_user');
    
    if (storedToken && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        // Invalid stored user, clear storage
        this.logout();
      }
    }
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  public get isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }

  public getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  register(registerData: RegisterDto): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, registerData, httpOptions).pipe(
      catchError(this.handleError<User>('register'))
    );
  }

  login(loginData: LoginDto): Observable<boolean> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData, httpOptions).pipe(
      tap(response => this.storeUserData(response)),
      map(() => true),
      catchError(this.handleError<boolean>('login', false))
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`).pipe(
      catchError(this.handleError<User>('getProfile'))
    );
  }

  logout(): void {
    // Remove user from local storage
    localStorage.removeItem('access_token');
    localStorage.removeItem('current_user');
    
    // Reset the BehaviorSubject
    this.currentUserSubject.next(null);
    
    // Navigate to login
    this.router.navigate(['/login']);
  }

  private storeUserData(response: AuthResponse): void {
    if (response && response.access_token && response.user) {
      localStorage.setItem('access_token', response.access_token);
      localStorage.setItem('current_user', JSON.stringify(response.user));
      this.currentUserSubject.next(response.user);
    }
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      if (error.status === 401) {
        this.logout();
      }
      
      return of(result as T);
    };
  }
}
