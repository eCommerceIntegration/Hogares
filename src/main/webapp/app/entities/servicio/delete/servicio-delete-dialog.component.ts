import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IServicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';

@Component({
  templateUrl: './servicio-delete-dialog.component.html',
})
export class ServicioDeleteDialogComponent {
  servicio?: IServicio;

  constructor(protected servicioService: ServicioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.servicioService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
