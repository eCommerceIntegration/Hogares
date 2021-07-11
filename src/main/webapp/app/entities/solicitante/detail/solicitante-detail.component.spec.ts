import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SolicitanteDetailComponent } from './solicitante-detail.component';

describe('Component Tests', () => {
  describe('Solicitante Management Detail Component', () => {
    let comp: SolicitanteDetailComponent;
    let fixture: ComponentFixture<SolicitanteDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [SolicitanteDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ solicitante: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(SolicitanteDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(SolicitanteDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load solicitante on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.solicitante).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
