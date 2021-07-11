import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServicioDetailComponent } from './servicio-detail.component';

describe('Component Tests', () => {
  describe('Servicio Management Detail Component', () => {
    let comp: ServicioDetailComponent;
    let fixture: ComponentFixture<ServicioDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ServicioDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ servicio: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(ServicioDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ServicioDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load servicio on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.servicio).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
