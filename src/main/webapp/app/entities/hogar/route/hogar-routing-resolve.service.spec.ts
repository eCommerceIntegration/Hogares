jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IHogar, Hogar } from '../hogar.model';
import { HogarService } from '../service/hogar.service';

import { HogarRoutingResolveService } from './hogar-routing-resolve.service';

describe('Service Tests', () => {
  describe('Hogar routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: HogarRoutingResolveService;
    let service: HogarService;
    let resultHogar: IHogar | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(HogarRoutingResolveService);
      service = TestBed.inject(HogarService);
      resultHogar = undefined;
    });

    describe('resolve', () => {
      it('should return IHogar returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHogar = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultHogar).toEqual({ id: 'ABC' });
      });

      it('should return new IHogar if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHogar = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultHogar).toEqual(new Hogar());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Hogar })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultHogar = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultHogar).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
