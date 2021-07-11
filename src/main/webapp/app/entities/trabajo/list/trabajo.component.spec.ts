import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TrabajoService } from '../service/trabajo.service';

import { TrabajoComponent } from './trabajo.component';

describe('Component Tests', () => {
  describe('Trabajo Management Component', () => {
    let comp: TrabajoComponent;
    let fixture: ComponentFixture<TrabajoComponent>;
    let service: TrabajoService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TrabajoComponent],
      })
        .overrideTemplate(TrabajoComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TrabajoComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TrabajoService);

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
      expect(comp.trabajos?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
