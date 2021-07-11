jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IServicio, Servicio } from '../servicio.model';
import { ServicioService } from '../service/servicio.service';

import { ServicioRoutingResolveService } from './servicio-routing-resolve.service';

describe('Service Tests', () => {
  describe('Servicio routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ServicioRoutingResolveService;
    let service: ServicioService;
    let resultServicio: IServicio | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ServicioRoutingResolveService);
      service = TestBed.inject(ServicioService);
      resultServicio = undefined;
    });

    describe('resolve', () => {
      it('should return IServicio returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultServicio = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultServicio).toEqual({ id: 'ABC' });
      });

      it('should return new IServicio if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultServicio = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultServicio).toEqual(new Servicio());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Servicio })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultServicio = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultServicio).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
