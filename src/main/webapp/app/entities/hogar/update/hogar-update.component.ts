import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IHogar, Hogar } from '../hogar.model';
import { HogarService } from '../service/hogar.service';

@Component({
  selector: 'jhi-hogar-update',
  templateUrl: './hogar-update.component.html',
})
export class HogarUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    hogarName: [null, [Validators.required]],
    language: [],
  });

  constructor(protected hogarService: HogarService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ hogar }) => {
      this.updateForm(hogar);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const hogar = this.createFromForm();
    if (hogar.id !== undefined) {
      this.subscribeToSaveResponse(this.hogarService.update(hogar));
    } else {
      this.subscribeToSaveResponse(this.hogarService.create(hogar));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IHogar>>): void {
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

  protected updateForm(hogar: IHogar): void {
    this.editForm.patchValue({
      id: hogar.id,
      hogarName: hogar.hogarName,
      language: hogar.language,
    });
  }

  protected createFromForm(): IHogar {
    return {
      ...new Hogar(),
      id: this.editForm.get(['id'])!.value,
      hogarName: this.editForm.get(['hogarName'])!.value,
      language: this.editForm.get(['language'])!.value,
    };
  }
}
