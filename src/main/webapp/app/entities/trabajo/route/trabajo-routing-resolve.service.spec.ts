jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ITrabajo, Trabajo } from '../trabajo.model';
import { TrabajoService } from '../service/trabajo.service';

import { TrabajoRoutingResolveService } from './trabajo-routing-resolve.service';

describe('Service Tests', () => {
  describe('Trabajo routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: TrabajoRoutingResolveService;
    let service: TrabajoService;
    let resultTrabajo: ITrabajo | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(TrabajoRoutingResolveService);
      service = TestBed.inject(TrabajoService);
      resultTrabajo = undefined;
    });

    describe('resolve', () => {
      it('should return ITrabajo returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrabajo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTrabajo).toEqual({ id: 'ABC' });
      });

      it('should return new ITrabajo if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrabajo = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultTrabajo).toEqual(new Trabajo());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Trabajo })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultTrabajo = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultTrabajo).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
