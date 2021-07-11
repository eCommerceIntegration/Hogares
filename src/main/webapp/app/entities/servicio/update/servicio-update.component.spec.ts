jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ServicioService } from '../service/servicio.service';
import { IServicio, Servicio } from '../servicio.model';
import { ISolicitante } from 'app/entities/solicitante/solicitante.model';
import { SolicitanteService } from 'app/entities/solicitante/service/solicitante.service';

import { ServicioUpdateComponent } from './servicio-update.component';

describe('Component Tests', () => {
  describe('Servicio Management Update Component', () => {
    let comp: ServicioUpdateComponent;
    let fixture: ComponentFixture<ServicioUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let servicioService: ServicioService;
    let solicitanteService: SolicitanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ServicioUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ServicioUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ServicioUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      servicioService = TestBed.inject(ServicioService);
      solicitanteService = TestBed.inject(SolicitanteService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Solicitante query and add missing value', () => {
        const servicio: IServicio = { id: 'CBA' };
        const solicitante: ISolicitante = { id: 'bdce1122-ebf4-455a-b4b6-94949d57f79d' };
        servicio.solicitante = solicitante;

        const solicitanteCollection: ISolicitante[] = [{ id: '2b06b51a-b30f-429e-910f-f831fe5ff5e6' }];
        jest.spyOn(solicitanteService, 'query').mockReturnValue(of(new HttpResponse({ body: solicitanteCollection })));
        const additionalSolicitantes = [solicitante];
        const expectedCollection: ISolicitante[] = [...additionalSolicitantes, ...solicitanteCollection];
        jest.spyOn(solicitanteService, 'addSolicitanteToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        expect(solicitanteService.query).toHaveBeenCalled();
        expect(solicitanteService.addSolicitanteToCollectionIfMissing).toHaveBeenCalledWith(
          solicitanteCollection,
          ...additionalSolicitantes
        );
        expect(comp.solicitantesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const servicio: IServicio = { id: 'CBA' };
        const solicitante: ISolicitante = { id: '381fd218-452a-4799-be21-542cfc4fe5b3' };
        servicio.solicitante = solicitante;

        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(servicio));
        expect(comp.solicitantesSharedCollection).toContain(solicitante);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Servicio>>();
        const servicio = { id: 'ABC' };
        jest.spyOn(servicioService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: servicio }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(servicioService.update).toHaveBeenCalledWith(servicio);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Servicio>>();
        const servicio = new Servicio();
        jest.spyOn(servicioService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: servicio }));
        saveSubject.complete();

        // THEN
        expect(servicioService.create).toHaveBeenCalledWith(servicio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Servicio>>();
        const servicio = { id: 'ABC' };
        jest.spyOn(servicioService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ servicio });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(servicioService.update).toHaveBeenCalledWith(servicio);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackSolicitanteById', () => {
        it('Should return tracked Solicitante primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackSolicitanteById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
