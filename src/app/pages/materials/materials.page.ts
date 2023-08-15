import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { MaterialService } from './services/materials.service';
import { ComponentsService } from '../../services/components.service';
import { Material } from './interfaces/interfaceMaterials';
import { ManageWorkOrder, Masters, VariablesManageWorkOrder } from '../../interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-materials',
  templateUrl: './materials.page.html',
  styleUrls: ['./materials.page.scss'],
})
export class MaterialsPage implements OnInit {

  @ViewChild('materialFormRef', { static: false }) materialFormRef!: NgForm;

  public materialForm: FormGroup = new FormGroup({});

  public manageWorkOrder: ManageWorkOrder;
  public variablesManageWorkOrder!: VariablesManageWorkOrder;

  public materials: any[] = [];
  public materialsArray?: Material[] = [];
  public masters!: Masters;
  public selectMasters!: Masters;

  constructor(private storage: Storage, public materialService: MaterialService,
    private comService: ComponentsService,
    private storageService: StorageService,
    private alertCtrl: AlertController,
    private router: Router,
    private globalService: GlobalService) {

    this.initializeApp();

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: [],
      activity: [],
      photos: [],
      assistants: []

    }

    this.storage.get('masters').then((val) => {
      if (val !== null) {
        this.masters = val;
      } else {
        this.masters = {
          activitys: [],
          materials: [],
          equipments: []
        };
      }

    });

  }

  initializeApp() {
    this.globalService.getObservable().subscribe((data) => {
      this.selectMasters = data;
      if (data.materials.length > 0) {
        this.materialForm.patchValue({
          material: data.materials[0].nombreGeneric
        });
      }
    });
  }

  ngOnInit() {
    this.setupForm();
    this.getVariablesManageWorkOrder();
  }

  getManageWorkOrder() {
    this.storage.get('manageWorkOrder').then((val) => {
      this.manageWorkOrder = val;
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp) {
          this.materialsArray = f.material;
        }
      });
    });
  }

  getVariablesManageWorkOrder() {
    this.storage.get('variablesManageWorkOrder').then((val) => {
      this.variablesManageWorkOrder = val;
      if (this.masters?.materials?.length > 0) {
        this.materials = this.masters.materials;
      } else {
        this.materialService.GetMaterialByActivity(val.idActivity).subscribe(resp => {
          this.materials = resp.result;
          this.masters.materials = this.materials;
          this.getManageWorkOrder();
          this.setMasters();
        });
      }

    });
  }

  get f() {
    return this.materialForm.controls;
  }

  setupForm() {
    this.materialForm = new FormGroup({
      material: new FormControl(null, Validators.required),
      quantity: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    let ev: any = undefined;

    this.materialFormRef.onSubmit(ev);

    if (this.materialForm.valid) {
      if (this.validateForm()) {
        const material = {
          idDto: this.selectMasters.materials[0]?.idParamGenericActividad,
          codeMaterialDto: this.selectMasters.materials[0]?.codigoDto,
          decriptionMaterialDto: this.selectMasters.materials[0]?.nombreGeneric,
          quantityDto: this.materialForm.get('quantity')?.value
        };
        this.materialsArray?.push(material); //= [...[material], ...this.materialsArray];
        this.materialFormRef.resetForm();
        this.materialForm.reset();

        this.mapMaterials();

        this.selectMasters.materials = [];
        this.setSelectMasters();
      }
    }
  }

  validateForm(): boolean {

    if (this.materialsArray?.find(f => f.idDto === this.selectMasters.materials[0]?.idParamGenericActividad)?.codeMaterialDto) {
      this.presentAlertMultipleButton('Este material ya esta asociado');
      return false;
    } else if (this.materialForm.get('quantity')?.value === 0) {
      this.presentAlertMultipleButton('La cantidad no es un valor permitido');
      return false;
    }

    return true;
  }

  async presentAlertMultipleButton(message: string) {
    const alert = await this.alertCtrl.create({
      header: message,
      buttons: [
        {
          text: 'Ok',
          role: 'confirm',
          handler: () => {

          },
        },
      ],
    });

    await alert.present();
  }

  getMaterial(id: string) {
    return this.materials.find(f => f.idParamGenericActividad === id);
  }

  deleteMaterial(id: string) {
    this.materialsArray = this.materialsArray?.filter(f => f.idDto !== id);
    this.mapMaterials();
  }

  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

  mapMaterials() {
    if (this.manageWorkOrder.supplies.length === 0) {
      this.manageWorkOrder.supplies = [{
        idActivityDto: this.variablesManageWorkOrder.idActivityTemp,
        material: this.materialsArray,
        equipment: []
      }];
    } else if (!this.manageWorkOrder.supplies.find(f => f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp)?.idActivityDto) {
      this.manageWorkOrder.supplies.push({
        idActivityDto: this.variablesManageWorkOrder.idActivityTemp,
        material: this.materialsArray,
        equipment: []
      });
    } else {
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp) {
          f.material = this.materialsArray;
        } else {

        }
      });
    }

    this.setManageWorkOrder();
  }

  goToSearch() {
    this.router.navigate(['/search'], { queryParams: { origin: 'M' } });
  }

  async setSelectMasters() {
    await this.storageService.loadSelectMasters(this.selectMasters);
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

  async setMasters() {
    await this.storageService.loadMasters(this.masters);
  }

}
