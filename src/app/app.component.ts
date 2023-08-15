import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { DataService } from './services/data.service';
import { Session } from './interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { StorageService } from './services/storage.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})

export class AppComponent {

  constructor() {

  }



}
