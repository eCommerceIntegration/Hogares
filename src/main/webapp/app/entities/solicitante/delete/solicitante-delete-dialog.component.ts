import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISolicitante } from '../solicitante.model';
import { SolicitanteService } from '../service/solicitante.service';

@Component({
  templateUrl: './solicitante-delete-dialog.component.html',
})
export class SolicitanteDeleteDialogComponent {
  solicitante?: ISolicitante;

  constructor(protected solicitanteService: SolicitanteService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.solicitanteService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
