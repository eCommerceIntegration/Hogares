jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { AccionService } from '../service/accion.service';
import { IAccion, Accion } from '../accion.model';
import { IServicio } from 'app/entities/servicio/servicio.model';
import { ServicioService } from 'app/entities/servicio/service/servicio.service';

import { AccionUpdateComponent } from './accion-update.component';

describe('Component Tests', () => {
  describe('Accion Management Update Component', () => {
    let comp: AccionUpdateComponent;
    let fixture: ComponentFixture<AccionUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let accionService: AccionService;
    let servicioService: ServicioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AccionUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(AccionUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AccionUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      accionService = TestBed.inject(AccionService);
      servicioService = TestBed.inject(ServicioService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Servicio query and add missing value', () => {
        const accion: IAccion = { id: 'CBA' };
        const servicio: IServicio = { id: '3b577e3e-a51b-4171-b4ce-0e731862afb6' };
        accion.servicio = servicio;

        const servicioCollection: IServicio[] = [{ id: '1783d9b8-4e88-4487-a381-a375b9c836c2' }];
        jest.spyOn(servicioService, 'query').mockReturnValue(of(new HttpResponse({ body: servicioCollection })));
        const additionalServicios = [servicio];
        const expectedCollection: IServicio[] = [...additionalServicios, ...servicioCollection];
        jest.spyOn(servicioService, 'addServicioToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ accion });
        comp.ngOnInit();

        expect(servicioService.query).toHaveBeenCalled();
        expect(servicioService.addServicioToCollectionIfMissing).toHaveBeenCalledWith(servicioCollection, ...additionalServicios);
        expect(comp.serviciosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const accion: IAccion = { id: 'CBA' };
        const servicio: IServicio = { id: 'e17a7afc-bcbb-4877-af33-cf95f8a2b243' };
        accion.servicio = servicio;

        activatedRoute.data = of({ accion });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(accion));
        expect(comp.serviciosSharedCollection).toContain(servicio);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Accion>>();
        const accion = { id: 'ABC' };
        jest.spyOn(accionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ accion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accion }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(accionService.update).toHaveBeenCalledWith(accion);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Accion>>();
        const accion = new Accion();
        jest.spyOn(accionService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ accion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: accion }));
        saveSubject.complete();

        // THEN
        expect(accionService.create).toHaveBeenCalledWith(accion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Accion>>();
        const accion = { id: 'ABC' };
        jest.spyOn(accionService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ accion });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(accionService.update).toHaveBeenCalledWith(accion);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackServicioById', () => {
        it('Should return tracked Servicio primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackServicioById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
