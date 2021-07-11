import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import * as dayjs from 'dayjs';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IEmpleado, Empleado } from '../empleado.model';
import { EmpleadoService } from '../service/empleado.service';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

@Component({
  selector: 'jhi-empleado-update',
  templateUrl: './empleado-update.component.html',
})
export class EmpleadoUpdateComponent implements OnInit {
  isSaving = false;

  hogarsSharedCollection: IHogar[] = [];

  editForm = this.fb.group({
    id: [],
    empleadoId: [],
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
    protected empleadoService: EmpleadoService,
    protected hogarService: HogarService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ empleado }) => {
      if (empleado.id === undefined) {
        const today = dayjs().startOf('day');
        empleado.hireDate = today;
      }

      this.updateForm(empleado);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const empleado = this.createFromForm();
    if (empleado.id !== undefined) {
      this.subscribeToSaveResponse(this.empleadoService.update(empleado));
    } else {
      this.subscribeToSaveResponse(this.empleadoService.create(empleado));
    }
  }

  trackHogarById(index: number, item: IHogar): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEmpleado>>): void {
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

  protected updateForm(empleado: IEmpleado): void {
    this.editForm.patchValue({
      id: empleado.id,
      empleadoId: empleado.empleadoId,
      firstName: empleado.firstName,
      lastName: empleado.lastName,
      email: empleado.email,
      phoneNumber: empleado.phoneNumber,
      hireDate: empleado.hireDate ? empleado.hireDate.format(DATE_TIME_FORMAT) : null,
      salary: empleado.salary,
      commissionPct: empleado.commissionPct,
      hogar: empleado.hogar,
    });

    this.hogarsSharedCollection = this.hogarService.addHogarToCollectionIfMissing(this.hogarsSharedCollection, empleado.hogar);
  }

  protected loadRelationshipsOptions(): void {
    this.hogarService
      .query()
      .pipe(map((res: HttpResponse<IHogar[]>) => res.body ?? []))
      .pipe(map((hogars: IHogar[]) => this.hogarService.addHogarToCollectionIfMissing(hogars, this.editForm.get('hogar')!.value)))
      .subscribe((hogars: IHogar[]) => (this.hogarsSharedCollection = hogars));
  }

  protected createFromForm(): IEmpleado {
    return {
      ...new Empleado(),
      id: this.editForm.get(['id'])!.value,
      empleadoId: this.editForm.get(['empleadoId'])!.value,
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
