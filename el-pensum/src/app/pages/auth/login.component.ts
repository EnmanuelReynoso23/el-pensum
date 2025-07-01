import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

// Login de usuario
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Inicia sesión
  login(): void {
    this.error = '';
    this.authService.login(this.username, this.password).subscribe({
      next: (res) => {
        this.authService.guardarToken(res.token);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.error = 'Credenciales inválidas.';
      }
    });
  }
}
