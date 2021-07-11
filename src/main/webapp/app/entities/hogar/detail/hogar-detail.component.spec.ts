import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { HogarDetailComponent } from './hogar-detail.component';

describe('Component Tests', () => {
  describe('Hogar Management Detail Component', () => {
    let comp: HogarDetailComponent;
    let fixture: ComponentFixture<HogarDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [HogarDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ hogar: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(HogarDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(HogarDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load hogar on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.hogar).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
