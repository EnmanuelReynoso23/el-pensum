import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Universidad } from '../models/universidad.model';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniversidadService {
  private readonly API_URL = `${environment.apiUrl}/universidades`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las universidades
   */
  getUniversidades(): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(this.API_URL);
  }

  /**
   * Obtiene una universidad específica por ID
   */
  getUniversidad(id: number): Observable<Universidad> {
    return this.http.get<Universidad>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtiene las carreras asignadas a una universidad
   */
  obtenerCarrerasAsignadas(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.API_URL}/${idUniversidad}/carreras`);
  }

  /**
   * Obtiene universidades que ofrecen una carrera específica
   */
  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.API_URL}/por-carrera/${idCarrera}`);
  }

  /**
   * Crea una nueva universidad
   */
  crearUniversidad(universidad: Universidad): Observable<Universidad> {
    return this.http.post<Universidad>(this.API_URL, universidad);
  }

  /**
   * Actualiza una universidad existente
   */
  actualizarUniversidad(id: number, universidad: Universidad): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/${id}`, universidad);
  }

  /**
   * Elimina una universidad
   */
  eliminarUniversidad(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
   * Obtiene el ID de una universidad por su nombre
   */
  getUniversidadIdPorNombre(nombre: string): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/id`, {
      params: { nombre }
    });
  }
}
