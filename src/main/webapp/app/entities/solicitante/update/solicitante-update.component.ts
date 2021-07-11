import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { ISolicitante, Solicitante } from '../solicitante.model';
import { SolicitanteService } from '../service/solicitante.service';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

@Component({
  selector: 'jhi-solicitante-update',
  templateUrl: './solicitante-update.component.html',
})
export class SolicitanteUpdateComponent implements OnInit {
  isSaving = false;

  hogarsSharedCollection: IHogar[] = [];

  editForm = this.fb.group({
    id: [],
    firstName: [],
    lastName: [],
    email: [],
    phoneNumber: [],
    hireDate: [],
    salary: [],
    commissionPct: [],
    hogar: [],
  });

  constructor(
    protected solicitanteService: SolicitanteService,
    protected hogarService: HogarService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ solicitante }) => {
      if (solicitante.id === undefined) {
        const today = dayjs().startOf('day');
        solicitante.hireDate = today;
      }

      this.updateForm(solicitante);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const solicitante = this.createFromForm();
    if (solicitante.id !== undefined) {
      this.subscribeToSaveResponse(this.solicitanteService.update(solicitante));
    } else {
      this.subscribeToSaveResponse(this.solicitanteService.create(solicitante));
    }
  }

  trackHogarById(index: number, item: IHogar): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISolicitante>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(solicitante: ISolicitante): void {
    this.editForm.patchValue({
      id: solicitante.id,
      firstName: solicitante.firstName,
      lastName: solicitante.lastName,
      email: solicitante.email,
      phoneNumber: solicitante.phoneNumber,
      hireDate: solicitante.hireDate ? solicitante.hireDate.format(DATE_TIME_FORMAT) : null,
      salary: solicitante.salary,
      commissionPct: solicitante.commissionPct,
      hogar: solicitante.hogar,
    });

    this.hogarsSharedCollection = this.hogarService.addHogarToCollectionIfMissing(this.hogarsSharedCollection, solicitante.hogar);
  }

  protected loadRelationshipsOptions(): void {
    this.hogarService
      .query()
      .pipe(map((res: HttpResponse<IHogar[]>) => res.body ?? []))
      .pipe(map((hogars: IHogar[]) => this.hogarService.addHogarToCollectionIfMissing(hogars, this.editForm.get('hogar')!.value)))
      .subscribe((hogars: IHogar[]) => (this.hogarsSharedCollection = hogars));
  }

  protected createFromForm(): ISolicitante {
    return {
      ...new Solicitante(),
      id: this.editForm.get(['id'])!.value,
      firstName: this.editForm.get(['firstName'])!.value,
      lastName: this.editForm.get(['lastName'])!.value,
      email: this.editForm.get(['email'])!.value,
      phoneNumber: this.editForm.get(['phoneNumber'])!.value,
      hireDate: this.editForm.get(['hireDate'])!.value ? dayjs(this.editForm.get(['hireDate'])!.value, DATE_TIME_FORMAT) : undefined,
      salary: this.editForm.get(['salary'])!.value,
      commissionPct: this.editForm.get(['commissionPct'])!.value,
      hogar: this.editForm.get(['hogar'])!.value,
    };
  }
}
