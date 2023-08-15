import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MenuComponent } from './menu/menu.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PopoverInfoComponent } from './popover-info/popover-info.component';
import { ModalInfoComponent } from './modal-info/modal-info.component';



@NgModule({
  declarations: [MenuComponent, PopoverInfoComponent, ModalInfoComponent],
  exports: [MenuComponent, PopoverInfoComponent, ModalInfoComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule
  ]
})
export class ComponentsModule { }
