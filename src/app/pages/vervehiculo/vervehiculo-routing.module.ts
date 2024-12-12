import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VervehiculoPage } from './vervehiculo.page';

const routes: Routes = [
  {
    path: '',
    component: VervehiculoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VervehiculoPageRoutingModule {}
