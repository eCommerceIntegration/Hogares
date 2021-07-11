import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ServicioService } from '../service/servicio.service';

import { ServicioComponent } from './servicio.component';

describe('Component Tests', () => {
  describe('Servicio Management Component', () => {
    let comp: ServicioComponent;
    let fixture: ComponentFixture<ServicioComponent>;
    let service: ServicioService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ServicioComponent],
      })
        .overrideTemplate(ServicioComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ServicioComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ServicioService);

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
      expect(comp.servicios?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
