import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Masters } from '../../interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  dinamycArry: any[] = [];
  selectMaster!: Masters;
  textoBuscar: string = '';
  origin: string = '';
  columna: string = 'descripcionDto';

  constructor(private storage: Storage,
    private route: ActivatedRoute, private storageService: StorageService,
    private router: Router, private globalService: GlobalService) {

    this.route.queryParams.subscribe(params => {
      this.origin = (params['origin'] || '')

      this.storage.get('masters').then((val: Masters) => {
        if (val !== null) {
          let arryTemp = [];
          if (this.origin == 'A') {
            arryTemp = val.activitys;
          }
          else if (this.origin == 'M') {
            arryTemp = val.materials;
            this.columna = 'nombreGeneric';
          }
          else if (this.origin == 'E') {
            arryTemp = val.equipments;
            this.columna = 'nombreGeneric';
          }
          else if (this.origin == 'X') {
            arryTemp = val.assistants;
            this.columna = 'nombreGeneric';
          }

          for (let index = 0; index < 20; index++) {
            const element = arryTemp[index];

            if (element === undefined) {
              break;
            }

            this.dinamycArry.push(element);
          }
        }
      });

    });

    this.selectMaster = {
      activitys: [],
      materials: [],
      equipments: [],
      assistants: []
    };

  }

  ngOnInit() {
  }

  onSearchChange(ev: any) {
    this.textoBuscar = ev.detail.value;
  }

  selectActivity(item: any) {
    let path = '';
    if (this.origin == 'A') {
      this.selectMaster.activitys.push(item);
      path = '/manage-work-order';
    }
    else if (this.origin == 'M') {
      this.selectMaster.materials.push(item);
      path = '/supplies/materials';
    }
    else if (this.origin == 'E') {
      this.selectMaster.equipments.push(item);
      path = '/supplies/equipment';
    }
    else if (this.origin == 'X') {
      this.selectMaster.assistants.push(item);
      path = '/manage-work-order';
    }

    this.globalService.publishSomeData(this.selectMaster);

    this.setSelectMasters();
    this.router.navigate([path]);
  }

  async setSelectMasters() {
    await this.storageService.loadSelectMasters(this.selectMaster);
  }

}
