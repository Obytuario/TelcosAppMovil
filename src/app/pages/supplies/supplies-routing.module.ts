import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SuppliesPage } from './supplies.page';
import { EquipmentPageModule } from '../equipment/equipment.module';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/supplies/materials',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SuppliesPage,
    children: [
      {
        path: 'materials',
        loadChildren: () => import('../materials/materials.module').then(m => m.MaterialsPageModule)
      },
      {
        path: 'equipment',
        loadChildren: () => import('../equipment/equipment.module').then(m => m.EquipmentPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliesPageRoutingModule {}
