import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarvehiculoPage } from './agregarvehiculo.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarvehiculoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarvehiculoPageRoutingModule {}
