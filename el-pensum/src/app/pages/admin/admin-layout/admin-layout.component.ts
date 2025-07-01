import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Layout principal del panel de administración
@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {
  sidebarAbierto = true;
  esPantallaMovil = this.isMobile();

  @HostListener('window:resize', [])
  onResize(): void {
    // Ajusta el sidebar según el tamaño de pantalla
    this.esPantallaMovil = this.isMobile();
    this.sidebarAbierto = !this.esPantallaMovil;
  }

  toggleSidebar(): void {
    // Abre/cierra el sidebar
    this.sidebarAbierto = !this.sidebarAbierto;
  }

  cerrarSidebar(): void {
    // Cierra el sidebar en móvil
    if (this.esPantallaMovil) {
      this.sidebarAbierto = false;
    }
  }

  isMobile(): boolean {
    // Detecta si es pantalla móvil
    return window.innerWidth < 768;
  }
}


