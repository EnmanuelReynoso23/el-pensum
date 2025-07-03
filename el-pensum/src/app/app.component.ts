// Importa el decorador Component para definir un componente Angular
import { Component } from '@angular/core';
// Importa RouterOutlet para la navegación entre páginas
import { RouterOutlet } from '@angular/router';
// Importa el componente de navegación
import { NavbarComponent } from './shared/navbar/navbar.component';
// Importa el componente de footer
import { FooterComponent } from './shared/footer/footer.component';

/**
 * Componente principal de la aplicación El Pensum.
 * Renderiza la estructura base y el router outlet para las páginas.
 */
@Component({
  selector: 'app-root', // Nombre de la etiqueta personalizada
  standalone: true, // Permite usar el componente sin módulo
  imports: [RouterOutlet, NavbarComponent, FooterComponent], // Habilita navegación entre rutas, navbar y footer
  templateUrl: './app.component.html', // Plantilla HTML principal
  styleUrl: './app.component.css' // Estilos del componente
})
export class AppComponent {
  /**
   * Título de la aplicación, visible en la plantilla si se usa.
   */
  title = 'el-pensum';
}
