import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VervehiculoPageRoutingModule } from './vervehiculo-routing.module';

import { VervehiculoPage } from './vervehiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VervehiculoPageRoutingModule
  ],
  declarations: [VervehiculoPage]
})
export class VervehiculoPageModule {}
