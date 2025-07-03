import { Carrera } from './carrera.model';
import { Universidad } from './universidad.model';

export interface CarreraUniversitaria {
  id?: number;
  universidadId: number;
  universidad?: Universidad;
  carreraId: number;
  carrera?: Carrera;
  duracionAnios: number;
  costoInscripcion: number;
  costoAdmision: number;
  costoCredito: number;
  totalCreditos: number;
  costoCarnet: number;
  pensumPdf?: string;
}
