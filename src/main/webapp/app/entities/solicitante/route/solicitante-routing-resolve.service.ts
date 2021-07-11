import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISolicitante, Solicitante } from '../solicitante.model';
import { SolicitanteService } from '../service/solicitante.service';

@Injectable({ providedIn: 'root' })
export class SolicitanteRoutingResolveService implements Resolve<ISolicitante> {
  constructor(protected service: SolicitanteService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISolicitante> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((solicitante: HttpResponse<Solicitante>) => {
          if (solicitante.body) {
            return of(solicitante.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Solicitante());
  }
}
