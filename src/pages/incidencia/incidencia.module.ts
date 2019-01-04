import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IncidenciaPage } from './incidencia';

@NgModule({
  declarations: [
    IncidenciaPage,
  ],
  imports: [
    IonicPageModule.forChild(IncidenciaPage),
  ],
})
export class IncidenciaPageModule {}
