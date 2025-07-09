import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarreraUniversitaria } from '../models/carrera-universitaria.model';
import { Universidad } from '../models/universidad.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarreraUniversitariaService {
  private apiUrl = `${environment.apiUrl}/carrerauniversitaria`;

  constructor(private http: HttpClient) {}

  private obtenerHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // ✅ Obtener universidades que imparten una carrera específica
  getUniversidadesPorCarrera(idCarrera: number): Observable<Universidad[]> {
    return this.http.get<Universidad[]>(`${this.apiUrl}/universidades-por-carrera/${idCarrera}`);
  }

  // ✅ Obtener información para comparar una carrera entre dos universidades
  compararCarreras(uni1: number, uni2: number, carrera: string): Observable<CarreraUniversitaria[]> {
    const url = `${this.apiUrl}/comparacion?uni1=${uni1}&uni2=${uni2}&carrera=${encodeURIComponent(carrera)}`;
    return this.http.get<CarreraUniversitaria[]>(url);
  }

  // ✅ Asignar una carrera a una universidad
  asignarCarrera(asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.post<CarreraUniversitaria>(this.apiUrl, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Actualizar información de una asignación universidad-carrera
  actualizarRelacion(id: number, asignacion: CarreraUniversitaria): Observable<CarreraUniversitaria> {
    return this.http.put<CarreraUniversitaria>(`${this.apiUrl}/${id}`, asignacion, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Eliminar relación universidad-carrera
  eliminarRelacion(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.obtenerHeaders()
    });
  }

  // ✅ Obtener carreras que ofrece una universidad
  obtenerCarrerasPorUniversidad(idUniversidad: number): Observable<CarreraUniversitaria[]> {
    return this.http.get<CarreraUniversitaria[]>(`${this.apiUrl}/universidad/${idUniversidad}`);
  }

  // ✅ Eliminar asignación (alias útil)
  eliminarAsignacion(idAsignacion: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idAsignacion}`, {
      headers: this.obtenerHeaders()
    });
  }
}
