import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServicio, Servicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';
import { ISolicitante } from 'app/entities/solicitante/solicitante.model';
import { SolicitanteService } from 'app/entities/solicitante/service/solicitante.service';

@Component({
  selector: 'jhi-servicio-update',
  templateUrl: './servicio-update.component.html',
})
export class ServicioUpdateComponent implements OnInit {
  isSaving = false;

  solicitantesSharedCollection: ISolicitante[] = [];

  editForm = this.fb.group({
    id: [],
    servicioTitle: [],
    minSalary: [],
    maxSalary: [],
    solicitante: [],
  });

  constructor(
    protected servicioService: ServicioService,
    protected solicitanteService: SolicitanteService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ servicio }) => {
      this.updateForm(servicio);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const servicio = this.createFromForm();
    if (servicio.id !== undefined) {
      this.subscribeToSaveResponse(this.servicioService.update(servicio));
    } else {
      this.subscribeToSaveResponse(this.servicioService.create(servicio));
    }
  }

  trackSolicitanteById(index: number, item: ISolicitante): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IServicio>>): void {
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

  protected updateForm(servicio: IServicio): void {
    this.editForm.patchValue({
      id: servicio.id,
      servicioTitle: servicio.servicioTitle,
      minSalary: servicio.minSalary,
      maxSalary: servicio.maxSalary,
      solicitante: servicio.solicitante,
    });

    this.solicitantesSharedCollection = this.solicitanteService.addSolicitanteToCollectionIfMissing(
      this.solicitantesSharedCollection,
      servicio.solicitante
    );
  }

  protected loadRelationshipsOptions(): void {
    this.solicitanteService
      .query()
      .pipe(map((res: HttpResponse<ISolicitante[]>) => res.body ?? []))
      .pipe(
        map((solicitantes: ISolicitante[]) =>
          this.solicitanteService.addSolicitanteToCollectionIfMissing(solicitantes, this.editForm.get('solicitante')!.value)
        )
      )
      .subscribe((solicitantes: ISolicitante[]) => (this.solicitantesSharedCollection = solicitantes));
  }

  protected createFromForm(): IServicio {
    return {
      ...new Servicio(),
      id: this.editForm.get(['id'])!.value,
      servicioTitle: this.editForm.get(['servicioTitle'])!.value,
      minSalary: this.editForm.get(['minSalary'])!.value,
      maxSalary: this.editForm.get(['maxSalary'])!.value,
      solicitante: this.editForm.get(['solicitante'])!.value,
    };
  }
}
