import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITrabajo, Trabajo } from '../trabajo.model';
import { TrabajoService } from '../service/trabajo.service';
import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { EmpleadoService } from 'app/entities/empleado/service/empleado.service';

@Component({
  selector: 'jhi-trabajo-update',
  templateUrl: './trabajo-update.component.html',
})
export class TrabajoUpdateComponent implements OnInit {
  isSaving = false;

  empleadosSharedCollection: IEmpleado[] = [];

  editForm = this.fb.group({
    id: [],
    trabajoTitle: [],
    minSalary: [],
    maxSalary: [],
    empleado: [],
  });

  constructor(
    protected trabajoService: TrabajoService,
    protected empleadoService: EmpleadoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ trabajo }) => {
      this.updateForm(trabajo);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const trabajo = this.createFromForm();
    if (trabajo.id !== undefined) {
      this.subscribeToSaveResponse(this.trabajoService.update(trabajo));
    } else {
      this.subscribeToSaveResponse(this.trabajoService.create(trabajo));
    }
  }

  trackEmpleadoById(index: number, item: IEmpleado): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITrabajo>>): void {
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

  protected updateForm(trabajo: ITrabajo): void {
    this.editForm.patchValue({
      id: trabajo.id,
      trabajoTitle: trabajo.trabajoTitle,
      minSalary: trabajo.minSalary,
      maxSalary: trabajo.maxSalary,
      empleado: trabajo.empleado,
    });

    this.empleadosSharedCollection = this.empleadoService.addEmpleadoToCollectionIfMissing(
      this.empleadosSharedCollection,
      trabajo.empleado
    );
  }

  protected loadRelationshipsOptions(): void {
    this.empleadoService
      .query()
      .pipe(map((res: HttpResponse<IEmpleado[]>) => res.body ?? []))
      .pipe(
        map((empleados: IEmpleado[]) =>
          this.empleadoService.addEmpleadoToCollectionIfMissing(empleados, this.editForm.get('empleado')!.value)
        )
      )
      .subscribe((empleados: IEmpleado[]) => (this.empleadosSharedCollection = empleados));
  }

  protected createFromForm(): ITrabajo {
    return {
      ...new Trabajo(),
      id: this.editForm.get(['id'])!.value,
      trabajoTitle: this.editForm.get(['trabajoTitle'])!.value,
      minSalary: this.editForm.get(['minSalary'])!.value,
      maxSalary: this.editForm.get(['maxSalary'])!.value,
      empleado: this.editForm.get(['empleado'])!.value,
    };
  }
}
