import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private toastr: ToastrService) {}

  /**
   * Muestra un mensaje de éxito
   */
  showSuccess(message: string, title: string = 'Éxito'): void {
    this.toastr.success(message, title);
  }

  /**
   * Muestra un mensaje de error
   */
  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title);
  }

  /**
   * Muestra un mensaje de advertencia
   */
  showWarning(message: string, title: string = 'Advertencia'): void {
    this.toastr.warning(message, title);
  }

  /**
   * Muestra un mensaje informativo
   */
  showInfo(message: string, title: string = 'Información'): void {
    this.toastr.info(message, title);
  }
}
