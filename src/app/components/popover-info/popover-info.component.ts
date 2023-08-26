import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { GlobalService } from 'src/app/services/global.service';
import { StorageService } from '../../services/storage.service';
import { Session } from 'src/app/interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  public session!: Session;

  constructor(private router: Router, private popoverCtrl: PopoverController,
    private storageService: StorageService, private globalService: GlobalService,
    private storage: Storage) { }

  ngOnInit() {
    this.storage.get('session').then((val) => {
      this.session = val;
    });
  }

  redirectLogin(){
    this.popoverCtrl.dismiss({
      item: '0'
    });
    this.storageService.clear();
    this.globalService.unSubscribeLocation();
    this.router.navigate(['/login']);
  }

}
