import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasValidToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private router: Router
  ) {}

  /**
   * Realiza el login del usuario
   */
  login(username: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, loginData).pipe(
      tap(response => {
        this.saveToken(response.token);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.hasValidToken();
  }

  /**
   * Verifica si el usuario está autenticado (alias en español)
   */
  estaAutenticado(): boolean {
    return this.hasValidToken();
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }
    
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Guarda el token en localStorage
   */
  private saveToken(token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  /**
   * Guarda el token en localStorage (alias público en español)
   */
  guardarToken(token: string): void {
    this.saveToken(token);
  }

  /**
   * Elimina el token del localStorage
   */
  private removeToken(): void {
    if (this.isBrowser()) {
      localStorage.removeItem(this.TOKEN_KEY);
    }
  }

  /**
   * Verifica si hay un token válido
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Verifica si estamos en el browser (SSR compatibility)
   */
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
