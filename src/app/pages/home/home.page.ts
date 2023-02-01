import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonList, LoadingController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { PopoverInfoComponent } from '../../components/popover-info/popover-info.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  loading!: HTMLIonLoadingElement;
  usuarios!: Observable<any>;
  isOpen = false;

  @ViewChild(IonList) ionList!: IonList;


  constructor(private dataService: DataService,private popoverCtrl: PopoverController) { }

  ngOnInit() {
    this.usuarios = this.dataService.getUsuarios();
  }

  favorite(user: any) {
    console.log(user);
    this.ionList.closeSlidingItems();
  }

  async presentPopover(ev: any) {

    const popover = await this.popoverCtrl.create({
      component: PopoverInfoComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true
    });

    await popover.present();

    const {data} = await popover.onWillDismiss();
    console.log(data);

  }

}
