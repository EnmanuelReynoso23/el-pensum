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
export class InicioComponent {}
