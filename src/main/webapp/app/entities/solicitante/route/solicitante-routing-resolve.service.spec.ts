jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ISolicitante, Solicitante } from '../solicitante.model';
import { SolicitanteService } from '../service/solicitante.service';

import { SolicitanteRoutingResolveService } from './solicitante-routing-resolve.service';

describe('Service Tests', () => {
  describe('Solicitante routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: SolicitanteRoutingResolveService;
    let service: SolicitanteService;
    let resultSolicitante: ISolicitante | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(SolicitanteRoutingResolveService);
      service = TestBed.inject(SolicitanteService);
      resultSolicitante = undefined;
    });

    describe('resolve', () => {
      it('should return ISolicitante returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSolicitante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSolicitante).toEqual({ id: 'ABC' });
      });

      it('should return new ISolicitante if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSolicitante = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultSolicitante).toEqual(new Solicitante());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse({ body: null as unknown as Solicitante })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultSolicitante = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultSolicitante).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
