jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SolicitanteService } from '../service/solicitante.service';
import { ISolicitante, Solicitante } from '../solicitante.model';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

import { SolicitanteUpdateComponent } from './solicitante-update.component';

describe('Component Tests', () => {
  describe('Solicitante Management Update Component', () => {
    let comp: SolicitanteUpdateComponent;
    let fixture: ComponentFixture<SolicitanteUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let solicitanteService: SolicitanteService;
    let hogarService: HogarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SolicitanteUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SolicitanteUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SolicitanteUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      solicitanteService = TestBed.inject(SolicitanteService);
      hogarService = TestBed.inject(HogarService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Hogar query and add missing value', () => {
        const solicitante: ISolicitante = { id: 'CBA' };
        const hogar: IHogar = { id: '3d93744a-6c94-4ea6-8d9c-ca2f1de2c60e' };
        solicitante.hogar = hogar;

        const hogarCollection: IHogar[] = [{ id: '3bc266c4-1840-4fd3-9ccd-2b8bf5e531a8' }];
        jest.spyOn(hogarService, 'query').mockReturnValue(of(new HttpResponse({ body: hogarCollection })));
        const additionalHogars = [hogar];
        const expectedCollection: IHogar[] = [...additionalHogars, ...hogarCollection];
        jest.spyOn(hogarService, 'addHogarToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ solicitante });
        comp.ngOnInit();

        expect(hogarService.query).toHaveBeenCalled();
        expect(hogarService.addHogarToCollectionIfMissing).toHaveBeenCalledWith(hogarCollection, ...additionalHogars);
        expect(comp.hogarsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const solicitante: ISolicitante = { id: 'CBA' };
        const hogar: IHogar = { id: 'ec885ca3-251c-48a3-be6c-952e42edc8ee' };
        solicitante.hogar = hogar;

        activatedRoute.data = of({ solicitante });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(solicitante));
        expect(comp.hogarsSharedCollection).toContain(hogar);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Solicitante>>();
        const solicitante = { id: 'ABC' };
        jest.spyOn(solicitanteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ solicitante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: solicitante }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(solicitanteService.update).toHaveBeenCalledWith(solicitante);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Solicitante>>();
        const solicitante = new Solicitante();
        jest.spyOn(solicitanteService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ solicitante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: solicitante }));
        saveSubject.complete();

        // THEN
        expect(solicitanteService.create).toHaveBeenCalledWith(solicitante);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Solicitante>>();
        const solicitante = { id: 'ABC' };
        jest.spyOn(solicitanteService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ solicitante });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(solicitanteService.update).toHaveBeenCalledWith(solicitante);
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
