import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-supplies',
  templateUrl: './supplies.page.html',
  styleUrls: ['./supplies.page.scss'],
})
export class SuppliesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public toggleTabsBar() {
    const tabId = document.getElementById('myTabs');
    if (tabId) {
      if (tabId.style.display === 'none') {
        tabId.style.display = 'flex';
      } else {
        tabId.style.display = 'none'
      }
    }
  }

  ionViewDidEnter() {
    this.toggleTabsBar();

  }
}
