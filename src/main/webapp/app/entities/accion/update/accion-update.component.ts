import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IAccion, Accion } from '../accion.model';
import { AccionService } from '../service/accion.service';
import { IServicio } from 'app/entities/servicio/servicio.model';
import { ServicioService } from 'app/entities/servicio/service/servicio.service';

@Component({
  selector: 'jhi-accion-update',
  templateUrl: './accion-update.component.html',
})
export class AccionUpdateComponent implements OnInit {
  isSaving = false;

  serviciosSharedCollection: IServicio[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    description: [],
    servicio: [],
  });

  constructor(
    protected accionService: AccionService,
    protected servicioService: ServicioService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ accion }) => {
      this.updateForm(accion);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const accion = this.createFromForm();
    if (accion.id !== undefined) {
      this.subscribeToSaveResponse(this.accionService.update(accion));
    } else {
      this.subscribeToSaveResponse(this.accionService.create(accion));
    }
  }

  trackServicioById(index: number, item: IServicio): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAccion>>): void {
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

  protected updateForm(accion: IAccion): void {
    this.editForm.patchValue({
      id: accion.id,
      title: accion.title,
      description: accion.description,
      servicio: accion.servicio,
    });

    this.serviciosSharedCollection = this.servicioService.addServicioToCollectionIfMissing(this.serviciosSharedCollection, accion.servicio);
  }

  protected loadRelationshipsOptions(): void {
    this.servicioService
      .query()
      .pipe(map((res: HttpResponse<IServicio[]>) => res.body ?? []))
      .pipe(
        map((servicios: IServicio[]) =>
          this.servicioService.addServicioToCollectionIfMissing(servicios, this.editForm.get('servicio')!.value)
        )
      )
      .subscribe((servicios: IServicio[]) => (this.serviciosSharedCollection = servicios));
  }

  protected createFromForm(): IAccion {
    return {
      ...new Accion(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      servicio: this.editForm.get(['servicio'])!.value,
    };
  }
}
