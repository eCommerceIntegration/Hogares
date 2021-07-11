jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { EmpleadoService } from '../service/empleado.service';
import { IEmpleado, Empleado } from '../empleado.model';
import { IHogar } from 'app/entities/hogar/hogar.model';
import { HogarService } from 'app/entities/hogar/service/hogar.service';

import { EmpleadoUpdateComponent } from './empleado-update.component';

describe('Component Tests', () => {
  describe('Empleado Management Update Component', () => {
    let comp: EmpleadoUpdateComponent;
    let fixture: ComponentFixture<EmpleadoUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let empleadoService: EmpleadoService;
    let hogarService: HogarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmpleadoUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(EmpleadoUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmpleadoUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      empleadoService = TestBed.inject(EmpleadoService);
      hogarService = TestBed.inject(HogarService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Hogar query and add missing value', () => {
        const empleado: IEmpleado = { id: 'CBA' };
        const hogar: IHogar = { id: 'c159c3c3-4166-479e-9d79-3eddbbb19d00' };
        empleado.hogar = hogar;

        const hogarCollection: IHogar[] = [{ id: '3e646fc6-f9b4-4e07-825b-d31658a563a5' }];
        jest.spyOn(hogarService, 'query').mockReturnValue(of(new HttpResponse({ body: hogarCollection })));
        const additionalHogars = [hogar];
        const expectedCollection: IHogar[] = [...additionalHogars, ...hogarCollection];
        jest.spyOn(hogarService, 'addHogarToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        expect(hogarService.query).toHaveBeenCalled();
        expect(hogarService.addHogarToCollectionIfMissing).toHaveBeenCalledWith(hogarCollection, ...additionalHogars);
        expect(comp.hogarsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const empleado: IEmpleado = { id: 'CBA' };
        const hogar: IHogar = { id: 'feadfec0-6fd9-4c52-a3d3-8e2cdc935937' };
        empleado.hogar = hogar;

        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(empleado));
        expect(comp.hogarsSharedCollection).toContain(hogar);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Empleado>>();
        const empleado = { id: 'ABC' };
        jest.spyOn(empleadoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empleado }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(empleadoService.update).toHaveBeenCalledWith(empleado);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Empleado>>();
        const empleado = new Empleado();
        jest.spyOn(empleadoService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: empleado }));
        saveSubject.complete();

        // THEN
        expect(empleadoService.create).toHaveBeenCalledWith(empleado);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Empleado>>();
        const empleado = { id: 'ABC' };
        jest.spyOn(empleadoService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ empleado });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(empleadoService.update).toHaveBeenCalledWith(empleado);
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
