import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SolicitanteComponent } from './list/solicitante.component';
import { SolicitanteDetailComponent } from './detail/solicitante-detail.component';
import { SolicitanteUpdateComponent } from './update/solicitante-update.component';
import { SolicitanteDeleteDialogComponent } from './delete/solicitante-delete-dialog.component';
import { SolicitanteRoutingModule } from './route/solicitante-routing.module';

@NgModule({
  imports: [SharedModule, SolicitanteRoutingModule],
  declarations: [SolicitanteComponent, SolicitanteDetailComponent, SolicitanteUpdateComponent, SolicitanteDeleteDialogComponent],
  entryComponents: [SolicitanteDeleteDialogComponent],
})
export class SolicitanteModule {}
