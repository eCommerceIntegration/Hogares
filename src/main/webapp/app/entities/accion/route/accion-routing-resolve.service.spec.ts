jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IAccion, Accion } from '../accion.model';
import { AccionService } from '../service/accion.service';

import { AccionRoutingResolveService } from './accion-routing-resolve.service';

describe('Service Tests', () => {
  describe('Accion routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: AccionRoutingResolveService;
    let service: AccionService;
    let resultAccion: IAccion | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(AccionRoutingResolveService);
      service = TestBed.inject(AccionService);
      resultAccion = undefined;
    });

    describe('resolve', () => {
      it('should return IAccion returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAccion).toEqual({ id: 'ABC' });
      });

      it('should return new IAccion if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccion = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultAccion).toEqual(new Accion());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Accion })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultAccion = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultAccion).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
