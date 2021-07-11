import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { HogarComponent } from '../list/hogar.component';
import { HogarDetailComponent } from '../detail/hogar-detail.component';
import { HogarUpdateComponent } from '../update/hogar-update.component';
import { HogarRoutingResolveService } from './hogar-routing-resolve.service';

const hogarRoute: Routes = [
  {
    path: '',
    component: HogarComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: HogarDetailComponent,
    resolve: {
      hogar: HogarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: HogarUpdateComponent,
    resolve: {
      hogar: HogarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: HogarUpdateComponent,
    resolve: {
      hogar: HogarRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(hogarRoute)],
  exports: [RouterModule],
})
export class HogarRoutingModule {}
