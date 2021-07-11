import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IHogar } from '../hogar.model';
import { HogarService } from '../service/hogar.service';
import { HogarDeleteDialogComponent } from '../delete/hogar-delete-dialog.component';

@Component({
  selector: 'jhi-hogar',
  templateUrl: './hogar.component.html',
})
export class HogarComponent implements OnInit {
  hogars?: IHogar[];
  isLoading = false;

  constructor(protected hogarService: HogarService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.hogarService.query().subscribe(
      (res: HttpResponse<IHogar[]>) => {
        this.isLoading = false;
        this.hogars = res.body ?? [];
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(index: number, item: IHogar): string {
    return item.id!;
  }

  delete(hogar: IHogar): void {
    const modalRef = this.modalService.open(HogarDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.hogar = hogar;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
