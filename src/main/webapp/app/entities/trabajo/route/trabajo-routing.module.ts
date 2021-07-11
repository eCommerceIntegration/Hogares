import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { TrabajoComponent } from '../list/trabajo.component';
import { TrabajoDetailComponent } from '../detail/trabajo-detail.component';
import { TrabajoUpdateComponent } from '../update/trabajo-update.component';
import { TrabajoRoutingResolveService } from './trabajo-routing-resolve.service';

const trabajoRoute: Routes = [
  {
    path: '',
    component: TrabajoComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: TrabajoDetailComponent,
    resolve: {
      trabajo: TrabajoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: TrabajoUpdateComponent,
    resolve: {
      trabajo: TrabajoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: TrabajoUpdateComponent,
    resolve: {
      trabajo: TrabajoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(trabajoRoute)],
  exports: [RouterModule],
})
export class TrabajoRoutingModule {}
