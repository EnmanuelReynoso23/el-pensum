import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { Universidad } from '../../../core/models/universidad.model';
import { Carrera } from '../../../core/models/carrera.model';

import { CarreraService } from '../../../core/services/carrera.service';
import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';

// Formulario para comparar universidades y carreras
@Component({
  selector: 'app-formulario-comparar',
  templateUrl: './formulario-comparar.component.html',
  styleUrls: ['./formulario-comparar.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class FormularioCompararComponent implements OnInit {
  carreras: Carrera[] = [];
  universidadesFiltradas: Universidad[] = [];

  universidad1: Universidad | null = null;
  universidad2: Universidad | null = null;
  carrera: Carrera | null = null;

  constructor(
    private carreraService: CarreraService,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Carga las carreras al iniciar
    this.carreraService.getCarreras().subscribe(carreras => {
      this.carreras = carreras;
    });
  }

  onCarreraSeleccionada(): void {
    // Filtra universidades segĂşn la carrera seleccionada
    if (!this.carrera?.id) return;

    this.carreraUniversitariaService.getUniversidadesPorCarrera(this.carrera.id).subscribe(universidades => {
      this.universidadesFiltradas = universidades;
      this.universidad1 = null;
      this.universidad2 = null;
    });
  }

  comparar(): void {
    // Navega a la pĂĄgina de comparaciĂłn si todo estĂĄ seleccionado
    if (!this.universidad1 || !this.universidad2 || !this.carrera) return;

    const slug1 = this.slugify(this.universidad1.nombre);
    const slug2 = this.slugify(this.universidad2.nombre);
    const slugCarrera = this.slugify(this.carrera.nombre || '');

    this.router.navigate([`/comparar/${slug1}/${slug2}/${slugCarrera}`]);
  }

  private slugify(text: string): string {
    // Convierte texto a formato URL amigable
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[ -]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
