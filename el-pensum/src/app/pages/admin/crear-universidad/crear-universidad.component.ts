import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UniversidadService } from '../../../core/services/universidad.service';
import { Universidad } from '../../../core/models/universidad.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Admin: crear o editar universidad
@Component({
  selector: 'app-crear-universidad',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-universidad.component.html',
  styleUrls: ['./crear-universidad.component.css']
})
export class CrearUniversidadComponent implements OnInit {
  universidad: Universidad = {
    id: 0,
    nombre: '',
    pais: '',
    ciudad: '',
    rankingNacional: 0,
    rankingMundial: 0,
    logoUrl: '',
    imagenesCampus: []
  };

  id: number | null = null;
  modoEdicion: boolean = false;

  constructor(
    private universidadService: UniversidadService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Si hay id, es edición; si no, es creación
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.id = +idParam;
        this.modoEdicion = true;
        this.universidadService.getUniversidad(this.id).subscribe({
          next: (data: Universidad) => {
            this.universidad = data;
          },
          error: (err: any) => {
            console.error('Error al obtener universidad:', err);
          }
        });
      }
    });
  }

  guardar(): void {
    // Guarda o actualiza universidad
    if (this.modoEdicion && this.id !== null) {
      this.universidadService.actualizarUniversidad(this.id, this.universidad).subscribe({
        next: () => {
          alert('Universidad actualizada correctamente.');
          this.router.navigate(['/admin/universidades']);
        },
        error: (err: any) => {
          console.error('Error al actualizar universidad:', err);
        }
      });
    } else {
      this.universidadService.crearUniversidad(this.universidad).subscribe({
        next: () => {
          alert('Universidad creada exitosamente.');
          this.router.navigate(['/admin/universidades']);
        },
        error: (err: any) => {
          console.error('Error al crear universidad:', err);
        }
      });
    }
  }

  agregarImagen(): void {
    // Agrega campo de imagen
    this.universidad.imagenesCampus.push('');
  }

  eliminarImagen(index: number): void {
    // Elimina imagen
    this.universidad.imagenesCampus.splice(index, 1);
  }

  cancelar(): void {
    // Cancela y vuelve al listado
    this.router.navigate(['/admin/universidades']);
  }
}



