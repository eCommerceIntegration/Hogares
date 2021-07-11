import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ITrabajo, Trabajo } from '../trabajo.model';
import { TrabajoService } from '../service/trabajo.service';

@Injectable({ providedIn: 'root' })
export class TrabajoRoutingResolveService implements Resolve<ITrabajo> {
  constructor(protected service: TrabajoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ITrabajo> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((trabajo: HttpResponse<Trabajo>) => {
          if (trabajo.body) {
            return of(trabajo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Trabajo());
  }
}
