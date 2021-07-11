import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccion } from '../accion.model';
import { AccionService } from '../service/accion.service';

@Component({
  templateUrl: './accion-delete-dialog.component.html',
})
export class AccionDeleteDialogComponent {
  accion?: IAccion;

  constructor(protected accionService: AccionService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.accionService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
