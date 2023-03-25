import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManageWorkOrderPage } from './manage-work-order.page';

const routes: Routes = [
  {
    path: '',
    component: ManageWorkOrderPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageWorkOrderPageRoutingModule {}
