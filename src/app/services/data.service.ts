import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Menu } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  loading!: HTMLIonLoadingElement;

  constructor(private http: HttpClient, private loadingCtrl: LoadingController) { }


  getUsuarios(){
    return this.http.get('https://jsonplaceholder.typicode.com/users');
  }

  getMenuOpts(){
    return this.http.get<Menu[]>('/assets/data/menu-opts.json');
  }

  dismissLoading(){
    this.loading.dismiss();
  }


  async showLoading() {
    this.loading = await this.loadingCtrl.create({
      message: 'Cargando...',
      cssClass: 'custom-loading',
      //duration: 3000,
    });

    this.loading.present();
  }
}
