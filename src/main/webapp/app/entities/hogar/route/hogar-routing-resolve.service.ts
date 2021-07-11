import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IHogar, Hogar } from '../hogar.model';
import { HogarService } from '../service/hogar.service';

@Injectable({ providedIn: 'root' })
export class HogarRoutingResolveService implements Resolve<IHogar> {
  constructor(protected service: HogarService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IHogar> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((hogar: HttpResponse<Hogar>) => {
          if (hogar.body) {
            return of(hogar.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Hogar());
  }
}
