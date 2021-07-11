import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ILocation, Location } from '../location.model';
import { LocationService } from '../service/location.service';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

@Component({
  selector: 'jhi-location-update',
  templateUrl: './location-update.component.html',
})
export class LocationUpdateComponent implements OnInit {
  isSaving = false;

  hogarsSharedCollection: IHogar[] = [];

  editForm = this.fb.group({
    id: [],
    streetAddress: [],
    postalCode: [],
    city: [],
    stateProvince: [],
    hogar: [],
  });

  constructor(
    protected locationService: LocationService,
    protected hogarService: HogarService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ location }) => {
      this.updateForm(location);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const location = this.createFromForm();
    if (location.id !== undefined) {
      this.subscribeToSaveResponse(this.locationService.update(location));
    } else {
      this.subscribeToSaveResponse(this.locationService.create(location));
    }
  }

  trackHogarById(index: number, item: IHogar): string {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILocation>>): void {
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

  protected updateForm(location: ILocation): void {
    this.editForm.patchValue({
      id: location.id,
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      city: location.city,
      stateProvince: location.stateProvince,
      hogar: location.hogar,
    });

    this.hogarsSharedCollection = this.hogarService.addHogarToCollectionIfMissing(this.hogarsSharedCollection, location.hogar);
  }

  protected loadRelationshipsOptions(): void {
    this.hogarService
      .query()
      .pipe(map((res: HttpResponse<IHogar[]>) => res.body ?? []))
      .pipe(map((hogars: IHogar[]) => this.hogarService.addHogarToCollectionIfMissing(hogars, this.editForm.get('hogar')!.value)))
      .subscribe((hogars: IHogar[]) => (this.hogarsSharedCollection = hogars));
  }

  protected createFromForm(): ILocation {
    return {
      ...new Location(),
      id: this.editForm.get(['id'])!.value,
      streetAddress: this.editForm.get(['streetAddress'])!.value,
      postalCode: this.editForm.get(['postalCode'])!.value,
      city: this.editForm.get(['city'])!.value,
      stateProvince: this.editForm.get(['stateProvince'])!.value,
      hogar: this.editForm.get(['hogar'])!.value,
    };
  }
}
