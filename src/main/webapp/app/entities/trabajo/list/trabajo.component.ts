import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ITrabajo } from '../trabajo.model';
import { TrabajoService } from '../service/trabajo.service';
import { TrabajoDeleteDialogComponent } from '../delete/trabajo-delete-dialog.component';

@Component({
  selector: 'jhi-trabajo',
  templateUrl: './trabajo.component.html',
})
export class TrabajoComponent implements OnInit {
  trabajos?: ITrabajo[];
  isLoading = false;

  constructor(protected trabajoService: TrabajoService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.trabajoService.query().subscribe(
      (res: HttpResponse<ITrabajo[]>) => {
        this.isLoading = false;
        this.trabajos = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: ITrabajo): string {
    return item.id!;
  }

  delete(trabajo: ITrabajo): void {
    const modalRef = this.modalService.open(TrabajoDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.trabajo = trabajo;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
