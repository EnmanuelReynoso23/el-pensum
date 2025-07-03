import { Component } from '@angular/core';
import { FormularioCompararComponent } from '../comparar/formulario-comparar/formulario-comparar.component';

// Página de inicio
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
  standalone: true,
  imports: [FormularioCompararComponent]
})
export class InicioComponent {
  
  scrollToComparar() {
    const element = document.getElementById('comparar');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToFeatures() {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToServicios() {
    const element = document.getElementById('servicios');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
