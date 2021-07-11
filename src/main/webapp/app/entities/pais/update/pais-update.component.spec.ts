jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { PaisService } from '../service/pais.service';
import { IPais, Pais } from '../pais.model';
import { IRegion } from 'app/entities/region/region.model';
import { RegionService } from 'app/entities/region/service/region.service';

import { PaisUpdateComponent } from './pais-update.component';

describe('Component Tests', () => {
  describe('Pais Management Update Component', () => {
    let comp: PaisUpdateComponent;
    let fixture: ComponentFixture<PaisUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let paisService: PaisService;
    let regionService: RegionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [PaisUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(PaisUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(PaisUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      paisService = TestBed.inject(PaisService);
      regionService = TestBed.inject(RegionService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Region query and add missing value', () => {
        const pais: IPais = { id: 'CBA' };
        const region: IRegion = { id: '8bb2ebbf-d0a6-491c-a5f5-371ee3fdfbf0' };
        pais.region = region;

        const regionCollection: IRegion[] = [{ id: 'a9226a56-a326-4188-993c-35a3370448a7' }];
        jest.spyOn(regionService, 'query').mockReturnValue(of(new HttpResponse({ body: regionCollection })));
        const additionalRegions = [region];
        const expectedCollection: IRegion[] = [...additionalRegions, ...regionCollection];
        jest.spyOn(regionService, 'addRegionToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        expect(regionService.query).toHaveBeenCalled();
        expect(regionService.addRegionToCollectionIfMissing).toHaveBeenCalledWith(regionCollection, ...additionalRegions);
        expect(comp.regionsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const pais: IPais = { id: 'CBA' };
        const region: IRegion = { id: 'fb6fca38-2dc2-4a38-a917-8cfff7ece77e' };
        pais.region = region;

        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(pais));
        expect(comp.regionsSharedCollection).toContain(region);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pais>>();
        const pais = { id: 'ABC' };
        jest.spyOn(paisService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pais }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(paisService.update).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pais>>();
        const pais = new Pais();
        jest.spyOn(paisService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: pais }));
        saveSubject.complete();

        // THEN
        expect(paisService.create).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Pais>>();
        const pais = { id: 'ABC' };
        jest.spyOn(paisService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ pais });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(paisService.update).toHaveBeenCalledWith(pais);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackRegionById', () => {
        it('Should return tracked Region primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackRegionById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
