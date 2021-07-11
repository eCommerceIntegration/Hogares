jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask, Task } from '../task.model';
import { ITrabajo } from 'app/entities/trabajo/trabajo.model';
import { TrabajoService } from 'app/entities/trabajo/service/trabajo.service';

import { TaskUpdateComponent } from './task-update.component';

describe('Component Tests', () => {
  describe('Task Management Update Component', () => {
    let comp: TaskUpdateComponent;
    let fixture: ComponentFixture<TaskUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let taskService: TaskService;
    let trabajoService: TrabajoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TaskUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(TaskUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TaskUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      taskService = TestBed.inject(TaskService);
      trabajoService = TestBed.inject(TrabajoService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Trabajo query and add missing value', () => {
        const task: ITask = { id: 'CBA' };
        const trabajo: ITrabajo = { id: 'c602295b-b91e-4ae8-9429-8a031254e816' };
        task.trabajo = trabajo;

        const trabajoCollection: ITrabajo[] = [{ id: '3dc219e6-419b-4575-b252-be80daae975b' }];
        jest.spyOn(trabajoService, 'query').mockReturnValue(of(new HttpResponse({ body: trabajoCollection })));
        const additionalTrabajos = [trabajo];
        const expectedCollection: ITrabajo[] = [...additionalTrabajos, ...trabajoCollection];
        jest.spyOn(trabajoService, 'addTrabajoToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(trabajoService.query).toHaveBeenCalled();
        expect(trabajoService.addTrabajoToCollectionIfMissing).toHaveBeenCalledWith(trabajoCollection, ...additionalTrabajos);
        expect(comp.trabajosSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const task: ITask = { id: 'CBA' };
        const trabajo: ITrabajo = { id: '4761a098-df58-433d-b75c-1418e14831fb' };
        task.trabajo = trabajo;

        activatedRoute.data = of({ task });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(task));
        expect(comp.trabajosSharedCollection).toContain(trabajo);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = { id: 'ABC' };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = new Task();
        jest.spyOn(taskService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: task }));
        saveSubject.complete();

        // THEN
        expect(taskService.create).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Task>>();
        const task = { id: 'ABC' };
        jest.spyOn(taskService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ task });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(taskService.update).toHaveBeenCalledWith(task);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackTrabajoById', () => {
        it('Should return tracked Trabajo primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackTrabajoById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
