import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { TrabajoDetailComponent } from './trabajo-detail.component';

describe('Component Tests', () => {
  describe('Trabajo Management Detail Component', () => {
    let comp: TrabajoDetailComponent;
    let fixture: ComponentFixture<TrabajoDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TrabajoDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ trabajo: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(TrabajoDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(TrabajoDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load trabajo on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.trabajo).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
