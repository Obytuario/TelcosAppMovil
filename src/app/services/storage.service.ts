import { Injectable } from '@angular/core';

import { Storage } from '@ionic/storage-angular';
import { Session, ManageWorkOrder, VariablesManageWorkOrder, Masters } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;
  private _localSession!: Session;

  constructor(private storage: Storage) {
    this.init();
  }
  get getSession() {
    this.getSessionLocal();
    return this._localSession;
  }


  init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this.storage.create();
  }

  async loadSession(session: Session) {
    try {
      await this.storage.set('session', session);
    } catch (error) {

    }
  }

  async loadSelectMasters(selectMasters: Masters) {
    try {
      await this.storage.set('selectMasters', selectMasters);
    } catch (error) {

    }
  }

  async loadMasters(masters: Masters) {
    try {
      await this.storage.set('masters', masters);
    } catch (error) {

    }
  }

  async loadManageWorkOrder(manageWorkOrder: ManageWorkOrder) {
    try {
      await this.storage.set('manageWorkOrder', manageWorkOrder);
    } catch (error) {

    }
  }

  async loadVariablesManageWorkOrder(variablesManageWorkOrder: VariablesManageWorkOrder) {
    try {
      await this.storage.set('variablesManageWorkOrder', variablesManageWorkOrder);
    } catch (error) {

    }
  }

  async getSessionLocal() : Promise<Session> {
      return await this.storage.get('session').then((val) => {
          return val;
      });
  }



  async clear() {
    try {
      await this.storage.clear();
    } catch (error) {

    }
  }


}
