import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarvehiculoPageRoutingModule } from './agregarvehiculo-routing.module';

import { AgregarvehiculoPage } from './agregarvehiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarvehiculoPageRoutingModule
  ],
  declarations: [AgregarvehiculoPage]
})
export class AgregarvehiculoPageModule {}
