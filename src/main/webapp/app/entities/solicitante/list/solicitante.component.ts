import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ISolicitante } from '../solicitante.model';
import { SolicitanteService } from '../service/solicitante.service';
import { SolicitanteDeleteDialogComponent } from '../delete/solicitante-delete-dialog.component';

@Component({
  selector: 'jhi-solicitante',
  templateUrl: './solicitante.component.html',
})
export class SolicitanteComponent implements OnInit {
  solicitantes?: ISolicitante[];
  isLoading = false;

  constructor(protected solicitanteService: SolicitanteService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.solicitanteService.query().subscribe(
      (res: HttpResponse<ISolicitante[]>) => {
        this.isLoading = false;
        this.solicitantes = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ISolicitante): string {
    return item.id!;
  }

  delete(solicitante: ISolicitante): void {
    const modalRef = this.modalService.open(SolicitanteDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.solicitante = solicitante;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
