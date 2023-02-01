import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-info',
  templateUrl: './popover-info.component.html',
  styleUrls: ['./popover-info.component.scss'],
})
export class PopoverInfoComponent implements OnInit {

  constructor(private router: Router, private popoverCtrl: PopoverController) { }

  ngOnInit() {}


  redirectLogin(){
    this.popoverCtrl.dismiss({
      item: '0'
    });
    this.router.navigate(['/login']);
  }

}
