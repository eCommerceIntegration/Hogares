import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AccionComponent } from '../list/accion.component';
import { AccionDetailComponent } from '../detail/accion-detail.component';
import { AccionUpdateComponent } from '../update/accion-update.component';
import { AccionRoutingResolveService } from './accion-routing-resolve.service';

const accionRoute: Routes = [
  {
    path: '',
    component: AccionComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AccionDetailComponent,
    resolve: {
      accion: AccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AccionUpdateComponent,
    resolve: {
      accion: AccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AccionUpdateComponent,
    resolve: {
      accion: AccionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accionRoute)],
  exports: [RouterModule],
})
export class AccionRoutingModule {}
