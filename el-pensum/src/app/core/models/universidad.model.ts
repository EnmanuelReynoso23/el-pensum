import { CarreraUniversitaria } from './carrera-universitaria.model';

export interface Universidad {
  id?: number;
  nombre: string;
  pais: string;
  ciudad: string;
  rankingNacional: number;
  rankingMundial: number;
  logoUrl: string;
  imagenesCampus: string[];
  carreras?: CarreraUniversitaria[];
}
