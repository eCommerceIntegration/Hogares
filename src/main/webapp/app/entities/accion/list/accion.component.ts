import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAccion } from '../accion.model';
import { AccionService } from '../service/accion.service';
import { AccionDeleteDialogComponent } from '../delete/accion-delete-dialog.component';

@Component({
  selector: 'jhi-accion',
  templateUrl: './accion.component.html',
})
export class AccionComponent implements OnInit {
  accions?: IAccion[];
  isLoading = false;

  constructor(protected accionService: AccionService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.accionService.query().subscribe(
      (res: HttpResponse<IAccion[]>) => {
        this.isLoading = false;
        this.accions = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IAccion): string {
    return item.id!;
  }

  delete(accion: IAccion): void {
    const modalRef = this.modalService.open(AccionDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.accion = accion;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
