import { Injectable } from '@angular/core';
import { interval, Subject, takeUntil } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import { Session } from '../interfaces/interfaces';
import { DataService } from 'src/app/services/data.service';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from '@ionic/storage-angular';

import { App } from '@capacitor/app';
// import { BackgroundTask } from '@capawesome/capacitor-background-task';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {

  public coordinates: any;
  public session!: Session;

  private ngUnsubscribe = new Subject<void>();


  constructor(private storageService: StorageService, private dataService: DataService, private storage: Storage) {
    App.addListener('appStateChange', async ({ isActive }) => {
      if (isActive) {
        return;
      }
      // The app state has been changed to inactive.
      // Start the background task by calling `beforeExit`.
      // const taskId = await BackgroundTask.beforeExit(async () => {
      //   // Run your code...
      //   this.getSession();
      //   if (this.session) {
      //     this.getLocation();
      //   } else {
      //     // Finish the background task as soon as everything is done.
      //     BackgroundTask.finish({ taskId });
      //   }

      // });
    });
  }

  private fooSubject = new Subject<any>();

  publishSomeData(data: any) {
    this.fooSubject.next(data);
  }

  getObservable(): Subject<any> {
    return this.fooSubject;
  }

  getSession() {
    this.storageService.init();
    this.storage.get('session').then((val) => {
      this.session = val;
    });
  }

  sendLocation() {

    this.getSession();

    if (this.session) {
      //emit value in sequence every 1 second
      const source = interval(60000);
      //output: 0,1,2,3,4,5....
      const subscribe = source.pipe(takeUntil(this.ngUnsubscribe)).subscribe(val => { if (this.session) this.getLocation() });
    }
  }

  async getLocation() {
    this.getSession();

    if (this.session) {
      const permissions = await Geolocation.checkPermissions();

      if (permissions.coarseLocation === "denied") {
        const request = await Geolocation.requestPermissions();
      } else {
        this.coordinates = await Geolocation.getCurrentPosition();
        this.saveLocationUser();
      }
    }
  }

  private saveLocationUser() {

    const savelocationUser = {
      idUser: this.session.userID,
      latitude: this.coordinates.coords.latitude,
      longitude: this.coordinates.coords.longitude
    }

    this.dataService.saveLocationUser(savelocationUser).subscribe(resp => {
      if (resp.isSuccessful) {

      }
    });
  }

  unSubscribeLocation() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
