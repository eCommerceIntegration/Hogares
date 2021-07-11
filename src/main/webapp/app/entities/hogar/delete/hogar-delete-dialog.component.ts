import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IHogar } from '../hogar.model';
import { HogarService } from '../service/hogar.service';

@Component({
  templateUrl: './hogar-delete-dialog.component.html',
})
export class HogarDeleteDialogComponent {
  hogar?: IHogar;

  constructor(protected hogarService: HogarService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.hogarService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
