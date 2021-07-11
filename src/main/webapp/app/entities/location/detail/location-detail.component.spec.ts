import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LocationDetailComponent } from './location-detail.component';

describe('Component Tests', () => {
  describe('Location Management Detail Component', () => {
    let comp: LocationDetailComponent;
    let fixture: ComponentFixture<LocationDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [LocationDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ location: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(LocationDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(LocationDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load location on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.location).toEqual(expect.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
