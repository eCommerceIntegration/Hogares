jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TrabajoService } from '../service/trabajo.service';
import { ITrabajo, Trabajo } from '../trabajo.model';
import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { EmpleadoService } from 'app/entities/empleado/service/empleado.service';

import { TrabajoUpdateComponent } from './trabajo-update.component';

describe('Component Tests', () => {
  describe('Trabajo Management Update Component', () => {
    let comp: TrabajoUpdateComponent;
    let fixture: ComponentFixture<TrabajoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let trabajoService: TrabajoService;
    let empleadoService: EmpleadoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TrabajoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TrabajoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TrabajoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      trabajoService = TestBed.inject(TrabajoService);
      empleadoService = TestBed.inject(EmpleadoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Empleado query and add missing value', () => {
        const trabajo: ITrabajo = { id: 'CBA' };
        const empleado: IEmpleado = { id: '7a9abd4a-8c37-4cfd-8f9f-5ce6fa489a87' };
        trabajo.empleado = empleado;

        const empleadoCollection: IEmpleado[] = [{ id: '12e9975b-5be0-4b6a-a96d-6cfd70b10d08' }];
        jest.spyOn(empleadoService, 'query').mockReturnValue(of(new HttpResponse({ body: empleadoCollection })));
        const additionalEmpleados = [empleado];
        const expectedCollection: IEmpleado[] = [...additionalEmpleados, ...empleadoCollection];
        jest.spyOn(empleadoService, 'addEmpleadoToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ trabajo });
        comp.ngOnInit();

        expect(empleadoService.query).toHaveBeenCalled();
        expect(empleadoService.addEmpleadoToCollectionIfMissing).toHaveBeenCalledWith(empleadoCollection, ...additionalEmpleados);
        expect(comp.empleadosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const trabajo: ITrabajo = { id: 'CBA' };
        const empleado: IEmpleado = { id: '9816f246-2d63-4837-9789-f09d862b2156' };
        trabajo.empleado = empleado;

        activatedRoute.data = of({ trabajo });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(trabajo));
        expect(comp.empleadosSharedCollection).toContain(empleado);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trabajo>>();
        const trabajo = { id: 'ABC' };
        jest.spyOn(trabajoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trabajo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: trabajo }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(trabajoService.update).toHaveBeenCalledWith(trabajo);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trabajo>>();
        const trabajo = new Trabajo();
        jest.spyOn(trabajoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trabajo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: trabajo }));
        saveSubject.complete();

        // THEN
        expect(trabajoService.create).toHaveBeenCalledWith(trabajo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Trabajo>>();
        const trabajo = { id: 'ABC' };
        jest.spyOn(trabajoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ trabajo });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(trabajoService.update).toHaveBeenCalledWith(trabajo);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackEmpleadoById', () => {
        it('Should return tracked Empleado primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackEmpleadoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
