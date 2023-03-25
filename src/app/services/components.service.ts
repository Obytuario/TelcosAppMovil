import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentsService {

  loading!: HTMLIonLoadingElement;

  constructor(private loadingCtrl: LoadingController,) { }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'custom-loading',
      //duration: 3000,
    });

    this.loading.present();
  }

  dismissLoading(){
    this.loading.dismiss();
  }
}
