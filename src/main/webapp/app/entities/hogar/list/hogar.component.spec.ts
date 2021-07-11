import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { HogarService } from '../service/hogar.service';

import { HogarComponent } from './hogar.component';

describe('Component Tests', () => {
  describe('Hogar Management Component', () => {
    let comp: HogarComponent;
    let fixture: ComponentFixture<HogarComponent>;
    let service: HogarService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [HogarComponent],
      })
        .overrideTemplate(HogarComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(HogarComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(HogarService);

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
      expect(comp.hogars?.[0]).toEqual(expect.objectContaining({ id: 'ABC' }));
    });
  });
});
