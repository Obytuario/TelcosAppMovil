import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ManageWorkOrderPageRoutingModule } from './manage-work-order-routing.module';

import { ManageWorkOrderPage } from './manage-work-order.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ManageWorkOrderPageRoutingModule
  ],
  declarations: [ManageWorkOrderPage]
})
export class ManageWorkOrderPageModule {}
