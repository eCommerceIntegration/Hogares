import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ServicioComponent } from '../list/servicio.component';
import { ServicioDetailComponent } from '../detail/servicio-detail.component';
import { ServicioUpdateComponent } from '../update/servicio-update.component';
import { ServicioRoutingResolveService } from './servicio-routing-resolve.service';

const servicioRoute: Routes = [
  {
    path: '',
    component: ServicioComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ServicioDetailComponent,
    resolve: {
      servicio: ServicioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ServicioUpdateComponent,
    resolve: {
      servicio: ServicioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ServicioUpdateComponent,
    resolve: {
      servicio: ServicioRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(servicioRoute)],
  exports: [RouterModule],
})
export class ServicioRoutingModule {}
