jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { HogarService } from '../service/hogar.service';
import { IHogar, Hogar } from '../hogar.model';

import { HogarUpdateComponent } from './hogar-update.component';

describe('Component Tests', () => {
  describe('Hogar Management Update Component', () => {
    let comp: HogarUpdateComponent;
    let fixture: ComponentFixture<HogarUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let hogarService: HogarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HogarUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(HogarUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HogarUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      hogarService = TestBed.inject(HogarService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const hogar: IHogar = { id: 'CBA' };

        activatedRoute.data = of({ hogar });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(hogar));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Hogar>>();
        const hogar = { id: 'ABC' };
        jest.spyOn(hogarService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ hogar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: hogar }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(hogarService.update).toHaveBeenCalledWith(hogar);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Hogar>>();
        const hogar = new Hogar();
        jest.spyOn(hogarService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ hogar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: hogar }));
        saveSubject.complete();

        // THEN
        expect(hogarService.create).toHaveBeenCalledWith(hogar);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Hogar>>();
        const hogar = { id: 'ABC' };
        jest.spyOn(hogarService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ hogar });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(hogarService.update).toHaveBeenCalledWith(hogar);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
