import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { CarreraUniversitariaService } from '../../../core/services/carrera-universitaria.service';
import { UniversidadService } from '../../../core/services/universidad.service';
import { CarreraUniversitaria } from '../../../core/models/carrera-universitaria.model';

/**
 * Interfaz para los campos de comparación
 */
interface CampoComparacion {
  label: string;
  key: string;
}

/**
 * Constantes para las clases CSS de comparación
 */
const CSS_CLASSES = {
  UNAVAILABLE: 'bg-gray-100 text-gray-600',
  BETTER: 'bg-green-100 text-green-800',
  WORSE: 'bg-red-100 text-red-800',
  EQUAL: 'bg-yellow-100 text-yellow-800',
  NEUTRAL: 'bg-blue-100 text-blue-800',
  DEFAULT: 'bg-gray-100 text-gray-800',
  DURATION: 'bg-blue-100 text-blue-800',
  CREDITS: 'bg-purple-100 text-purple-800'
} as const;

/**
 * Constantes para valores predeterminados
 */
const DEFAULT_VALUES = {
  UNAVAILABLE: 'N/D',
  NO_AVAILABLE_TEXT: 'No disponible'
} as const;

/**
 * Componente para comparar carreras universitarias entre dos universidades
 * Permite visualizar diferencias en costos, duración y otros aspectos académicos
 */
@Component({
  selector: 'app-comparar',
  templateUrl: './comparar.component.html',
  styleUrls: ['./comparar.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class CompararComponent implements OnInit {
  // #region Properties
  carreraNombre = '';
  universidad1Nombre = '';
  universidad2Nombre = '';
  comparacion: CarreraUniversitaria[] = [];

  readonly camposComparacion: CampoComparacion[] = [
    { label: 'Duración (años)', key: 'duracionAnios' },
    { label: 'Costo Inscripción', key: 'costoInscripcion' },
    { label: 'Costo Crédito', key: 'costoCredito' },
    { label: 'Total Créditos', key: 'totalCreditos' },
    { label: 'Costo Carnet', key: 'costoCarnet' },
    { label: 'Pensum PDF', key: 'pensumPdf' }
  ];
  // #endregion

  // #region Constructor
  constructor(
    private route: ActivatedRoute,
    private carreraUniversitariaService: CarreraUniversitariaService,
    private universidadService: UniversidadService,
    private router: Router
  ) {}
  // #endregion

  // #region Lifecycle Hooks
  ngOnInit(): void {
    this.inicializarComparacion();
  }
  // #endregion

  // #region Public Methods
  /**
   * Obtiene el valor de un campo específico para mostrar en la tabla
   */
  obtenerValor(carreraUniversitaria: CarreraUniversitaria, campo: string): any {
    const valor = (carreraUniversitaria as any)[campo];
    return valor ?? DEFAULT_VALUES.UNAVAILABLE;
  }

  /**
   * Formatea un valor para su visualización según el tipo de campo
   */
  formatearValor(valor: any, tipoCampo: string): string {
    if (this.esValorNoDisponible(valor)) {
      return DEFAULT_VALUES.NO_AVAILABLE_TEXT;
    }
    
    if (this.esCampoCosto(tipoCampo)) {
      return this.formatearMoneda(valor);
    }
    
    if (tipoCampo === 'duracionAnios') {
      return this.formatearDuracion(valor);
    }
    
    if (tipoCampo === 'pensumPdf') {
      return this.formatearDisponibilidad(valor);
    }
    
    return valor.toString();
  }

  /**
   * Obtiene las clases CSS para mostrar visualmente la comparación entre valores
   */
  obtenerClasesComparacion(valor1: any, valor2: any, tipoCampo: string): string {
    if (this.esValorNoDisponible(valor1)) {
      return CSS_CLASSES.UNAVAILABLE;
    }

    if (this.esCampoCosto(tipoCampo)) {
      return this.obtenerClasesComparacionCosto(valor1, valor2);
    }

    if (tipoCampo === 'duracionAnios') {
      return CSS_CLASSES.DURATION;
    }

    if (tipoCampo === 'totalCreditos') {
      return CSS_CLASSES.CREDITS;
    }

    return CSS_CLASSES.DEFAULT;
  }

  /**
   * Calcula el costo total estimado de una carrera universitaria
   */
  calcularCostoTotal(carreraUniversitaria: CarreraUniversitaria): string {
    const costoInscripcion = this.convertirANumero(carreraUniversitaria.costoInscripcion);
    const costoCredito = this.convertirANumero(carreraUniversitaria.costoCredito);
    const totalCreditos = this.convertirANumero(carreraUniversitaria.totalCreditos);
    const costoCarnet = this.convertirANumero(carreraUniversitaria.costoCarnet);

    const costoTotal = costoInscripcion + (costoCredito * totalCreditos) + costoCarnet;
    
    if (costoTotal === 0) {
      return DEFAULT_VALUES.NO_AVAILABLE_TEXT;
    }
    
    return this.formatearMoneda(costoTotal);
  }

  /**
   * Navega de vuelta al formulario para iniciar una nueva comparación
   */
  iniciarNuevaComparacion(): void {
    this.router.navigate(['/comparar']);
  }
  // #endregion

  // #region Private Methods
  /**
   * Inicializa el proceso de comparación obteniendo parámetros de la URL
   */
  private inicializarComparacion(): void {
    const parametrosUrl = this.obtenerParametrosUrl();
    
    if (!this.validarParametrosUrl(parametrosUrl)) {
      console.error('❌ Faltan parámetros requeridos en la URL');
      return;
    }

    this.asignarNombresDesdeParametros(parametrosUrl);
    this.ejecutarComparacion();
  }

  /**
   * Obtiene los parámetros de la URL
   */
  private obtenerParametrosUrl() {
    return {
      slug1: this.route.snapshot.paramMap.get('slug1'),
      slug2: this.route.snapshot.paramMap.get('slug2'),
      slugCarrera: this.route.snapshot.paramMap.get('slugCarrera')
    };
  }

  /**
   * Valida que todos los parámetros requeridos estén presentes
   */
  private validarParametrosUrl(parametros: any): boolean {
    return !!(parametros.slug1 && parametros.slug2 && parametros.slugCarrera);
  }

  /**
   * Asigna los nombres convertidos desde los slugs de la URL
   */
  private asignarNombresDesdeParametros(parametros: any): void {
    this.universidad1Nombre = this.convertirSlugATexto(parametros.slug1);
    this.universidad2Nombre = this.convertirSlugATexto(parametros.slug2);
    this.carreraNombre = this.convertirSlugATexto(parametros.slugCarrera);
  }

  /**
   * Ejecuta la comparación obteniendo IDs de universidades y datos de comparación
   */
  private ejecutarComparacion(): void {
    const universidad1$ = this.universidadService.getUniversidadIdPorNombre(this.universidad1Nombre);
    const universidad2$ = this.universidadService.getUniversidadIdPorNombre(this.universidad2Nombre);

    forkJoin([universidad1$, universidad2$])
      .pipe(
        switchMap(([id1, id2]) => 
          this.carreraUniversitariaService.compararCarreras(id1, id2, this.carreraNombre)
        )
      )
      .subscribe({
        next: (datos) => this.comparacion = datos,
        error: (error) => this.manejarErrorComparacion(error)
      });
  }

  /**
   * Maneja errores durante el proceso de comparación
   */
  private manejarErrorComparacion(error: any): void {
    console.error('❌ Error al ejecutar la comparación:', error);
    // Aquí se podría mostrar un mensaje al usuario usando un servicio de notificaciones
  }

  /**
   * Convierte un slug de URL a texto legible
   */
  private convertirSlugATexto(slug: string): string {
    return slug.replace(/-/g, ' ');
  }

  /**
   * Verifica si un valor es considerado no disponible
   */
  private esValorNoDisponible(valor: any): boolean {
    return valor === DEFAULT_VALUES.UNAVAILABLE || 
           valor === null || 
           valor === undefined;
  }

  /**
   * Verifica si un campo es de tipo costo
   */
  private esCampoCosto(tipoCampo: string): boolean {
    return tipoCampo.includes('costo') || tipoCampo.includes('Costo');
  }

  /**
   * Formatea un valor numérico como moneda
   */
  private formatearMoneda(valor: number): string {
    return `$${Number(valor).toLocaleString()}`;
  }

  /**
   * Formatea la duración en años
   */
  private formatearDuracion(valor: number): string {
    return `${valor} años`;
  }

  /**
   * Formatea la disponibilidad de un recurso
   */
  private formatearDisponibilidad(valor: any): string {
    return valor ? 'Disponible' : DEFAULT_VALUES.NO_AVAILABLE_TEXT;
  }

  /**
   * Obtiene clases CSS específicas para comparación de costos
   */
  private obtenerClasesComparacionCosto(valor1: any, valor2: any): string {
    if (this.esValorNoDisponible(valor2)) {
      return CSS_CLASSES.NEUTRAL;
    }
    
    const numero1 = Number(valor1);
    const numero2 = Number(valor2);
    
    if (numero1 < numero2) {
      return CSS_CLASSES.BETTER; // Menor costo es mejor
    } else if (numero1 > numero2) {
      return CSS_CLASSES.WORSE; // Mayor costo es peor
    } else {
      return CSS_CLASSES.EQUAL; // Costos iguales
    }
  }

  /**
   * Convierte un valor a número, retornando 0 si no es válido
   */
  private convertirANumero(valor: any): number {
    return Number(valor || 0);
  }
  // #endregion
}
