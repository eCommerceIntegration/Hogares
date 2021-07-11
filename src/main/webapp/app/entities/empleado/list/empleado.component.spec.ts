import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EmpleadoService } from '../service/empleado.service';

import { EmpleadoComponent } from './empleado.component';

describe('Component Tests', () => {
  describe('Empleado Management Component', () => {
    let comp: EmpleadoComponent;
    let fixture: ComponentFixture<EmpleadoComponent>;
    let service: EmpleadoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [EmpleadoComponent],
      })
        .overrideTemplate(EmpleadoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(EmpleadoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(EmpleadoService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 'ABC' }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.empleados?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
