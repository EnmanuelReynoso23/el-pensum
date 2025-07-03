import { CarreraUniversitaria } from './carrera-universitaria.model';

export interface Carrera {
  id?: number;
  nombre?: string;
  carrerasUniversitarias?: CarreraUniversitaria[];
}
