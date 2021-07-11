import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { SolicitanteService } from '../service/solicitante.service';

import { SolicitanteComponent } from './solicitante.component';

describe('Component Tests', () => {
  describe('Solicitante Management Component', () => {
    let comp: SolicitanteComponent;
    let fixture: ComponentFixture<SolicitanteComponent>;
    let service: SolicitanteService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SolicitanteComponent],
      })
        .overrideTemplate(SolicitanteComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SolicitanteComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(SolicitanteService);

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
      expect(comp.solicitantes?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
