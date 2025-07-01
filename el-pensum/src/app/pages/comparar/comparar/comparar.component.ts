import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private universidadService: UniversidadService
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
}



 


