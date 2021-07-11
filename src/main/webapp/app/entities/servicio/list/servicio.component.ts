import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IServicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';
import { ServicioDeleteDialogComponent } from '../delete/servicio-delete-dialog.component';

@Component({
  selector: 'jhi-servicio',
  templateUrl: './servicio.component.html',
})
export class ServicioComponent implements OnInit {
  servicios?: IServicio[];
  isLoading = false;

  constructor(protected servicioService: ServicioService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.servicioService.query().subscribe(
      (res: HttpResponse<IServicio[]>) => {
        this.isLoading = false;
        this.servicios = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IServicio): string {
    return item.id!;
  }

  delete(servicio: IServicio): void {
    const modalRef = this.modalService.open(ServicioDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.servicio = servicio;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
