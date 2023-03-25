import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  constructor(private router: Router, private popoverCtrl: PopoverController,
    private storageService: StorageService) { }

  ngOnInit() {}


  redirectLogin(){
    this.popoverCtrl.dismiss({
      item: '0'
    });
    this.storageService.clear();
    this.router.navigate(['/login']);
  }

}
