import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { TrabajoComponent } from './list/trabajo.component';
import { TrabajoDetailComponent } from './detail/trabajo-detail.component';
import { TrabajoUpdateComponent } from './update/trabajo-update.component';
import { TrabajoDeleteDialogComponent } from './delete/trabajo-delete-dialog.component';
import { TrabajoRoutingModule } from './route/trabajo-routing.module';

@NgModule({
  imports: [SharedModule, TrabajoRoutingModule],
  declarations: [TrabajoComponent, TrabajoDetailComponent, TrabajoUpdateComponent, TrabajoDeleteDialogComponent],
  entryComponents: [TrabajoDeleteDialogComponent],
})
export class TrabajoModule {}
