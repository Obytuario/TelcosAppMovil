import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { MaterialService } from './services/materials.service';
import { ComponentsService } from '../../services/components.service';
import { Material } from './interfaces/interfaceMaterials';
import { ManageWorkOrder, VariablesManageWorkOrder } from '../../interfaces/interfaces';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

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

  constructor(private storage: Storage, public materialService: MaterialService,
    private comService: ComponentsService,
    private storageService: StorageService,
    private alertCtrl: AlertController) {

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: [],
      activity: [],
      assistants: []

    }

  }

  ngOnInit() {
    this.setupForm();
    this.getVariablesManageWorkOrder();
  }

  getManageWorkOrder() {
    this.storage.get('manageWorkOrder').then((val) => {
      this.manageWorkOrder = val;
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivity) {
          this.materialsArray = f.material;
        }
      });
    });
  }

  getVariablesManageWorkOrder() {
    this.storage.get('variablesManageWorkOrder').then((val) => {
      this.variablesManageWorkOrder = val;
      this.materialService.GetActyvitiMaterialByFile(val.idFolder).subscribe(resp => {
        this.materials = resp.result;
        this.getManageWorkOrder();
      });
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
          idDto: this.materialForm.get('material')?.value,
          codeMaterialDto: this.getMaterial(this.materialForm.get('material')?.value)?.codigoDto,
          decriptionMaterialDto: this.getMaterial(this.materialForm.get('material')?.value)?.nombreGeneric,
          quantityDto: this.materialForm.get('quantity')?.value
        };
        this.materialsArray?.push(material); //= [...[material], ...this.materialsArray];
        this.materialFormRef.resetForm();
        this.materialForm.reset();

        this.mapMaterials();
      }
    }
  }

  validateForm(): boolean {

    if (this.materialsArray?.find(f => f.idDto === this.materialForm.get('material')?.value)?.codeMaterialDto) {
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
        idActivityDto: this.variablesManageWorkOrder.idActivity,
        material: this.materialsArray,
        equipment: []
      }];
    } else if (!this.manageWorkOrder.supplies.find(f => f.idActivityDto === this.variablesManageWorkOrder.idActivity)?.idActivityDto) {
      this.manageWorkOrder.supplies.push({
        idActivityDto: this.variablesManageWorkOrder.idActivity,
        material: this.materialsArray,
        equipment: []
      });
    } else {
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivity) {
          f.material = this.materialsArray;
        } else {

        }
      });
    }

    this.setManageWorkOrder();
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

}
