import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { HogarComponent } from './list/hogar.component';
import { HogarDetailComponent } from './detail/hogar-detail.component';
import { HogarUpdateComponent } from './update/hogar-update.component';
import { HogarDeleteDialogComponent } from './delete/hogar-delete-dialog.component';
import { HogarRoutingModule } from './route/hogar-routing.module';

@NgModule({
  imports: [SharedModule, HogarRoutingModule],
  declarations: [HogarComponent, HogarDetailComponent, HogarUpdateComponent, HogarDeleteDialogComponent],
  entryComponents: [HogarDeleteDialogComponent],
})
export class HogarModule {}
