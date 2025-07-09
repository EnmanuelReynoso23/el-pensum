import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingCount = 0;

  constructor(private spinner: NgxSpinnerService) {}

  /**
   * Muestra el spinner de carga
   */
  show(): void {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      this.spinner.show();
    }
  }

  /**
   * Oculta el spinner de carga
   */
  hide(): void {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.spinner.hide();
    }
  }

  /**
   * Fuerza el ocultamiento del spinner
   */
  forceHide(): void {
    this.loadingCount = 0;
    this.spinner.hide();
  }
}
