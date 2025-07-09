import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarreraService } from '../../../core/services/carrera.service';
import { Carrera } from '../../../core/models/carrera.model';

// Admin: gestionar carreras universitarias
@Component({
  selector: 'app-gestionar-carreras',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionar-carreras.component.html',
  styleUrls: ['./gestionar-carreras.component.css']
})
export class GestionarCarrerasComponent implements OnInit {
  carreras: Carrera[] = [];
  carreraActual: Carrera = { nombre: '' };
  modoEdicion: boolean = false;
  cargando: boolean = true;
  error: string = '';

  constructor(private carreraService: CarreraService) {}

  ngOnInit(): void {
    // Carga carreras al iniciar
    this.cargarCarreras();
  }

  cargarCarreras(): void {
    // Obtiene todas las carreras
    this.cargando = true;
    this.carreraService.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar carreras.';
        this.cargando = false;
        console.error(err);
      }
    });
  }

  guardar(): void {
    // Crea o actualiza una carrera
    if (!this.carreraActual.nombre?.trim()) {
      alert('El nombre de la carrera es obligatorio.');
      return;
    }

    if (this.modoEdicion && this.carreraActual.id != null) {
      this.carreraService.actualizarCarrera(this.carreraActual.id, this.carreraActual).subscribe({
        next: () => {
          alert('Carrera actualizada.');
          this.resetFormulario();
          this.cargarCarreras();
        },
        error: (err) => {
          alert('Error al actualizar la carrera.');
          console.error(err);
        }
      });
    } else {
      this.carreraService.crearCarrera(this.carreraActual).subscribe({
        next: () => {
          alert('Carrera creada.');
          this.resetFormulario();
          this.cargarCarreras();
        },
        error: (err) => {
          alert('Error al crear la carrera.');
          console.error(err);
        }
      });
    }
  }

  editar(carrera: Carrera): void {
    // Edita una carrera
    this.carreraActual = { ...carrera };
    this.modoEdicion = true;
  }

  eliminar(id: number): void {
    const confirmado = confirm('¿Eliminar esta carrera?');
    if (!confirmado) return;

    this.carreraService.eliminarCarrera(id).subscribe({
      next: () => {
        this.carreras = this.carreras.filter(c => c.id !== id);
      },
      error: (err) => {
        alert('Error al eliminar la carrera.');
        console.error(err);
      }
    });
  }

  cancelar(): void {
    this.resetFormulario();
  }

  private resetFormulario(): void {
    this.carreraActual = { nombre: '' };
    this.modoEdicion = false;
  }
}
