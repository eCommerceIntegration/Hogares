import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ITask, Task } from '../task.model';
import { TaskService } from '../service/task.service';
import { ITrabajo } from 'app/entities/trabajo/trabajo.model';
import { TrabajoService } from 'app/entities/trabajo/service/trabajo.service';

@Component({
  selector: 'jhi-task-update',
  templateUrl: './task-update.component.html',
})
export class TaskUpdateComponent implements OnInit {
  isSaving = false;

  trabajosSharedCollection: ITrabajo[] = [];

  editForm = this.fb.group({
    id: [],
    title: [],
    description: [],
    trabajo: [],
  });

  constructor(
    protected taskService: TaskService,
    protected trabajoService: TrabajoService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ task }) => {
      this.updateForm(task);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const task = this.createFromForm();
    if (task.id !== undefined) {
      this.subscribeToSaveResponse(this.taskService.update(task));
    } else {
      this.subscribeToSaveResponse(this.taskService.create(task));
    }
  }

  trackTrabajoById(index: number, item: ITrabajo): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ITask>>): void {
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

  protected updateForm(task: ITask): void {
    this.editForm.patchValue({
      id: task.id,
      title: task.title,
      description: task.description,
      trabajo: task.trabajo,
    });

    this.trabajosSharedCollection = this.trabajoService.addTrabajoToCollectionIfMissing(this.trabajosSharedCollection, task.trabajo);
  }

  protected loadRelationshipsOptions(): void {
    this.trabajoService
      .query()
      .pipe(map((res: HttpResponse<ITrabajo[]>) => res.body ?? []))
      .pipe(
        map((trabajos: ITrabajo[]) => this.trabajoService.addTrabajoToCollectionIfMissing(trabajos, this.editForm.get('trabajo')!.value))
      )
      .subscribe((trabajos: ITrabajo[]) => (this.trabajosSharedCollection = trabajos));
  }

  protected createFromForm(): ITask {
    return {
      ...new Task(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      description: this.editForm.get(['description'])!.value,
      trabajo: this.editForm.get(['trabajo'])!.value,
    };
  }
}
