import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ServicioComponent } from './list/servicio.component';
import { ServicioDetailComponent } from './detail/servicio-detail.component';
import { ServicioUpdateComponent } from './update/servicio-update.component';
import { ServicioDeleteDialogComponent } from './delete/servicio-delete-dialog.component';
import { ServicioRoutingModule } from './route/servicio-routing.module';

@NgModule({
  imports: [SharedModule, ServicioRoutingModule],
  declarations: [ServicioComponent, ServicioDetailComponent, ServicioUpdateComponent, ServicioDeleteDialogComponent],
  entryComponents: [ServicioDeleteDialogComponent],
})
export class ServicioModule {}
