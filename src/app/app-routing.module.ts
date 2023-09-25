import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'work-order',
    loadChildren: () => import('./pages/work-order/work-order.module').then( m => m.WorkOrderPageModule)
  },
  {
    path: 'materials',
    loadChildren: () => import('./pages/materials/materials.module').then( m => m.MaterialsPageModule)
  },
  {
    path: 'equipment',
    loadChildren: () => import('./pages/equipment/equipment.module').then( m => m.EquipmentPageModule)
  },
  {
    path: 'supplies',
    loadChildren: () => import('./pages/supplies/supplies.module').then( m => m.SuppliesPageModule)
  },
  {
    path: 'manage-work-order',
    loadChildren: () => import('./pages/manage-work-order/manage-work-order.module').then( m => m.ManageWorkOrderPageModule)
  },
  {
    path: 'search',
    loadChildren: () => import('./pages/search/search.module').then( m => m.SearchPageModule)
  },
  {
    path: 'change-password',
    loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule)
  }



];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
