import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AccionComponent } from './list/accion.component';
import { AccionDetailComponent } from './detail/accion-detail.component';
import { AccionUpdateComponent } from './update/accion-update.component';
import { AccionDeleteDialogComponent } from './delete/accion-delete-dialog.component';
import { AccionRoutingModule } from './route/accion-routing.module';

@NgModule({
  imports: [SharedModule, AccionRoutingModule],
  declarations: [AccionComponent, AccionDetailComponent, AccionUpdateComponent, AccionDeleteDialogComponent],
  entryComponents: [AccionDeleteDialogComponent],
})
export class AccionModule {}
