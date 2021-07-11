jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { LocationService } from '../service/location.service';
import { ILocation, Location } from '../location.model';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

import { LocationUpdateComponent } from './location-update.component';

describe('Component Tests', () => {
  describe('Location Management Update Component', () => {
    let comp: LocationUpdateComponent;
    let fixture: ComponentFixture<LocationUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let locationService: LocationService;
    let hogarService: HogarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [LocationUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(LocationUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(LocationUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      locationService = TestBed.inject(LocationService);
      hogarService = TestBed.inject(HogarService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Hogar query and add missing value', () => {
        const location: ILocation = { id: 'CBA' };
        const hogar: IHogar = { id: 'f773e86d-cb92-438c-bccd-d53c91d7f22d' };
        location.hogar = hogar;

        const hogarCollection: IHogar[] = [{ id: 'd1534301-dbf3-40f3-92b5-924f8b09430d' }];
        jest.spyOn(hogarService, 'query').mockReturnValue(of(new HttpResponse({ body: hogarCollection })));
        const additionalHogars = [hogar];
        const expectedCollection: IHogar[] = [...additionalHogars, ...hogarCollection];
        jest.spyOn(hogarService, 'addHogarToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(hogarService.query).toHaveBeenCalled();
        expect(hogarService.addHogarToCollectionIfMissing).toHaveBeenCalledWith(hogarCollection, ...additionalHogars);
        expect(comp.hogarsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const location: ILocation = { id: 'CBA' };
        const hogar: IHogar = { id: '41622158-6398-4c77-b939-740667b8a897' };
        location.hogar = hogar;

        activatedRoute.data = of({ location });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(location));
        expect(comp.hogarsSharedCollection).toContain(hogar);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = { id: 'ABC' };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = new Location();
        jest.spyOn(locationService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: location }));
        saveSubject.complete();

        // THEN
        expect(locationService.create).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Location>>();
        const location = { id: 'ABC' };
        jest.spyOn(locationService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ location });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(locationService.update).toHaveBeenCalledWith(location);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackHogarById', () => {
        it('Should return tracked Hogar primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackHogarById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
