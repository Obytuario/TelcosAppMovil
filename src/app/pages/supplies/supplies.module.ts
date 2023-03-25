import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SuppliesPageRoutingModule } from './supplies-routing.module';

import { SuppliesPage } from './supplies.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SuppliesPageRoutingModule
  ],
  declarations: [SuppliesPage]
})
export class SuppliesPageModule {}
