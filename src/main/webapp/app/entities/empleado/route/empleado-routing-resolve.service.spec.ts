jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IEmpleado, Empleado } from '../empleado.model';
import { EmpleadoService } from '../service/empleado.service';

import { EmpleadoRoutingResolveService } from './empleado-routing-resolve.service';

describe('Service Tests', () => {
  describe('Empleado routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: EmpleadoRoutingResolveService;
    let service: EmpleadoService;
    let resultEmpleado: IEmpleado | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(EmpleadoRoutingResolveService);
      service = TestBed.inject(EmpleadoService);
      resultEmpleado = undefined;
    });

    describe('resolve', () => {
      it('should return IEmpleado returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmpleado = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultEmpleado).toEqual({ id: 'ABC' });
      });

      it('should return new IEmpleado if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmpleado = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultEmpleado).toEqual(new Empleado());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Empleado })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultEmpleado = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultEmpleado).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
