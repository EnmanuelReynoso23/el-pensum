import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { Universidad } from '../../../core/models/universidad.model';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Admin: lista y gestiona universidades
@Component({
  selector: 'app-listar-universidades',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listar-universidades.component.html',
  styleUrls: ['./listar-universidades.component.css']
})
export class ListarUniversidadesComponent implements OnInit {
  universidades: Universidad[] = [];
  carrerasPorUniversidad: Record<number, CarreraUniversitaria[]> = {};
  mostrarCarreras: { [key: number]: boolean } = {};
  cargando: boolean = true;
  error: string = '';

  constructor(
    private universidadService: UniversidadService,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carga universidades al iniciar
    this.universidadService.getUniversidades().subscribe({
      next: (data) => {
        this.universidades = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar universidades.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  eliminar(id: number): void {
    // Elimina una universidad
    const confirmado = confirm('¿Estás seguro de que deseas eliminar esta universidad?');
    if (!confirmado) return;

    this.universidadService.eliminarUniversidad(id).subscribe({
      next: () => {
        this.universidades = this.universidades.filter(u => u.id !== id);
        delete this.carrerasPorUniversidad[id];
      },
      error: (err) => {
        alert('Error al eliminar la universidad.');
        console.error(err);
      }
    });
  }

  editar(id: number): void {
    // Navega a la edición de universidad
    this.router.navigate(['/admin/editar-universidad', id]);
  }

  crearUniversidad(): void {
    // Navega a la creación de universidad
    this.router.navigate(['/admin/crear-universidad']);
  }

  toggleCarreras(idUniversidad: number): void {
    // Muestra/oculta carreras de una universidad
    if (this.mostrarCarreras[idUniversidad]) {
      this.mostrarCarreras[idUniversidad] = false;
      return;
    }

    if (!this.carrerasPorUniversidad[idUniversidad]) {
      this.universidadService.obtenerCarrerasAsignadas(idUniversidad).subscribe({
        next: (carreras) => {
          this.carrerasPorUniversidad[idUniversidad] = carreras;
          this.mostrarCarreras[idUniversidad] = true;
        },
        error: (err) => {
          alert('Error al obtener carreras asignadas.');
          console.error(err);
        }
      });
    } else {
      this.mostrarCarreras[idUniversidad] = true;
    }
  }

  eliminarAsignacion(idUniversidad: number, idAsignacion: number): void {
    // Elimina una carrera asignada a una universidad
    const confirmado = confirm('¿Eliminar esta carrera de la universidad?');
    if (!confirmado) return;

    this.carreraUniversitariaService.eliminarAsignacion(idAsignacion).subscribe({
      next: () => {
        this.carrerasPorUniversidad[idUniversidad] = this.carrerasPorUniversidad[idUniversidad]
          .filter(cu => cu.id !== idAsignacion);
      },
      error: (err) => {
        alert('Error al eliminar la asignación.');
        console.error(err);
      }
    });
  }

  getCarreras(idUniversidad: number): CarreraUniversitaria[] {
    // Devuelve las carreras de una universidad
    return this.carrerasPorUniversidad[idUniversidad] || [];
  }
}






