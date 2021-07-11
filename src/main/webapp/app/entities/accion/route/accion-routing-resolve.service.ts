import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAccion, Accion } from '../accion.model';
import { AccionService } from '../service/accion.service';

@Injectable({ providedIn: 'root' })
export class AccionRoutingResolveService implements Resolve<IAccion> {
  constructor(protected service: AccionService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAccion> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((accion: HttpResponse<Accion>) => {
          if (accion.body) {
            return of(accion.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Accion());
  }
}
