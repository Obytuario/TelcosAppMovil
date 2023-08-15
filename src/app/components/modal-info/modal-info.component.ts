import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-info',
  templateUrl: './modal-info.component.html',
  styleUrls: ['./modal-info.component.scss'],
})
export class ModalInfoComponent implements OnInit {

  @Input() dinamycArry: string[] = [];

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  selectItem(item: string) {
    this.modalCtrl.dismiss({
      address: item
    });
  }

  exit() {
    this.modalCtrl.dismiss();
  }

}
