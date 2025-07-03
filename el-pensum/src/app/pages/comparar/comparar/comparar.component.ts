import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';
// Página de comparación de universidades y carreras
@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.component.html',
  styleUrls: ['./comparar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CompararComponent implements OnInit {
  carreraNombre = '';
  universidad1Nombre = '';
  universidad2Nombre = '';

  comparacion: CarreraUniversitaria[] = [];

  campos = [
    { label: 'Duración (años)', key: 'duracionAnios' },
    { label: 'Costo Inscripción', key: 'costoInscripcion' },
    { label: 'Costo Admision', key: 'costoAdmision' },
    { label: 'Costo Crédito', key: 'costoCredito' },
    { label: 'Total Créditos', key: 'totalCreditos' },
    { label: 'Costo Carnet', key: 'costoCarnet' },
    { label: 'Pensum PDF', key: 'pensumPdf' }
  ];

  constructor(
    private route: ActivatedRoute,
    private cuService: CarreraUniversitariaService,
    private universidadService: UniversidadService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtiene los parámetros de la URL y realiza la comparación
    const slug1 = this.route.snapshot.paramMap.get('slug1');
    const slug2 = this.route.snapshot.paramMap.get('slug2');
    const slugCarrera = this.route.snapshot.paramMap.get('slugCarrera');

    if (!slug1 || !slug2 || !slugCarrera) {
      console.error('❌ Faltan parámetros en la URL');
      return;
    }

    this.universidad1Nombre = this.deslugify(slug1);
    this.universidad2Nombre = this.deslugify(slug2);
    this.carreraNombre = this.deslugify(slugCarrera);

    this.obtenerIdsYComparar();
  }

  private obtenerIdsYComparar(): void {
    // Busca los IDs y compara las carreras
    this.universidadService.getUniversidadIdPorNombre(this.universidad1Nombre).subscribe({
      next: id1 => {
        this.universidadService.getUniversidadIdPorNombre(this.universidad2Nombre).subscribe({
          next: id2 => {
            this.cuService.compararCarreras(id1, id2, this.carreraNombre).subscribe({
              next: data => this.comparacion = data,
              error: err => console.error('❌ Error al obtener comparación:', err)
            });
          },
          error: err => console.error('❌ Error al obtener ID universidad 2:', err)
        });
      },
      error: err => console.error('❌ Error al obtener ID universidad 1:', err)
    });
  }

  deslugify(slug: string): string {
    // Convierte slug a texto normal
    return slug.replace(/-/g, ' ');
  }

  obtenerValor(cu: CarreraUniversitaria, campo: string): any {
    // Obtiene el valor de un campo de la comparación
    const valor = (cu as any)[campo];
    return valor ?? 'N/D';
  }

  formatValue(value: any, key: string): string {
    // Formatea los valores para mostrar
    if (value === 'N/D' || value === null || value === undefined) {
      return 'No disponible';
    }
    
    if (key.includes('costo') || key.includes('Costo')) {
      return `$${Number(value).toLocaleString()}`;
    }
    
    if (key === 'duracionAnios') {
      return `${value} años`;
    }
    
    if (key === 'pensumPdf') {
      return value ? 'Disponible' : 'No disponible';
    }
    
    return value.toString();
  }

  getValueClass(value1: any, value2: any, key: string): string {
    // Determina las clases CSS basadas en la comparación de valores
    if (value1 === 'N/D' || value1 === null || value1 === undefined) {
      return 'bg-gray-100 text-gray-600';
    }

    // Para costos, menor es mejor
    if (key.includes('costo') || key.includes('Costo')) {
      if (value2 === 'N/D' || value2 === null || value2 === undefined) {
        return 'bg-blue-100 text-blue-800';
      }
      
      const num1 = Number(value1);
      const num2 = Number(value2);
      
      if (num1 < num2) {
        return 'bg-green-100 text-green-800'; // Mejor (menor costo)
      } else if (num1 > num2) {
        return 'bg-red-100 text-red-800'; // Peor (mayor costo)
      } else {
        return 'bg-yellow-100 text-yellow-800'; // Igual
      }
    }

    // Para duración, depende de la preferencia del usuario
    if (key === 'duracionAnios') {
      return 'bg-blue-100 text-blue-800';
    }

    // Para créditos, más puede ser mejor o peor dependiendo del contexto
    if (key === 'totalCreditos') {
      return 'bg-purple-100 text-purple-800';
    }

    // Default
    return 'bg-gray-100 text-gray-800';
  }

  calcularCostoTotal(cu: CarreraUniversitaria): string {
    // Calcula el costo total estimado
    const inscripcion = Number(cu.costoInscripcion || 0);
    const admision = Number(cu.costoAdmision || 0);
    const credito = Number(cu.costoCredito || 0);
    const totalCreditos = Number(cu.totalCreditos || 0);
    const carnet = Number(cu.costoCarnet || 0);

    const total = inscripcion + admision + (credito * totalCreditos) + carnet;
    
    if (total === 0) {
      return 'No disponible';
    }
    
    return `$${total.toLocaleString()}`;
  }

  nuevaComparacion(): void {
    // Navega de vuelta al formulario para una nueva comparación
    this.router.navigate(['/comparar']);
  }
}



 


