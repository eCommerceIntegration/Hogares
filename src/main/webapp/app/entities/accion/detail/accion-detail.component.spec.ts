import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccionDetailComponent } from './accion-detail.component';

describe('Component Tests', () => {
  describe('Accion Management Detail Component', () => {
    let comp: AccionDetailComponent;
    let fixture: ComponentFixture<AccionDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AccionDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ accion: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(AccionDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AccionDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load accion on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.accion).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
