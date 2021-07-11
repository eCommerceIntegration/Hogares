import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccionService } from '../service/accion.service';

import { AccionComponent } from './accion.component';

describe('Component Tests', () => {
  describe('Accion Management Component', () => {
    let comp: AccionComponent;
    let fixture: ComponentFixture<AccionComponent>;
    let service: AccionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [AccionComponent],
      })
        .overrideTemplate(AccionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(AccionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(AccionService);

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
      expect(comp.accions?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});