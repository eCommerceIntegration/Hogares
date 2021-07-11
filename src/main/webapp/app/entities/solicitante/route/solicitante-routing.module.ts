import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SolicitanteComponent } from '../list/solicitante.component';
import { SolicitanteDetailComponent } from '../detail/solicitante-detail.component';
import { SolicitanteUpdateComponent } from '../update/solicitante-update.component';
import { SolicitanteRoutingResolveService } from './solicitante-routing-resolve.service';

const solicitanteRoute: Routes = [
  {
    path: '',
    component: SolicitanteComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SolicitanteDetailComponent,
    resolve: {
      solicitante: SolicitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SolicitanteUpdateComponent,
    resolve: {
      solicitante: SolicitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SolicitanteUpdateComponent,
    resolve: {
      solicitante: SolicitanteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(solicitanteRoute)],
  exports: [RouterModule],
})
export class SolicitanteRoutingModule {}
