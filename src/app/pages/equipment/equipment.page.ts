import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ManageWorkOrder, VariablesManageWorkOrder } from '../../interfaces/interfaces';
import { Equipment } from './interfaces/interfaceEquipment';
import { ComponentsService } from '../../services/components.service';
import { StorageService } from '../../services/storage.service';
import { EquipmentService } from './services/equipment.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.page.html',
  styleUrls: ['./equipment.page.scss'],
})
export class EquipmentPage implements OnInit {

  @ViewChild('equipmentFormRef', { static: false }) equipmentFormRef!: NgForm;

  public equipmentForm: FormGroup = new FormGroup({});

  public manageWorkOrder: ManageWorkOrder;
  public variablesManageWorkOrder!: VariablesManageWorkOrder;

  public equipments: any[] = [];
  public equipmentsArray?: Equipment[] = [];

  movements: any[] = [];

  constructor(private storage: Storage, public equipmentService: EquipmentService,
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
    this.GetAllMovimientoEquipment();
  }

  GetAllMovimientoEquipment() {
    this.equipmentService.GetAllMovimientoEquipment().subscribe(resp => {
      this.movements = resp.result;
    });
  }

  getManageWorkOrder() {
    this.storage.get('manageWorkOrder').then((val) => {
      this.manageWorkOrder = val;
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivity) {
          this.equipmentsArray = f.equipment;
        }
      });
    });
  }

  getVariablesManageWorkOrder() {
    this.storage.get('variablesManageWorkOrder').then((val) => {
      this.variablesManageWorkOrder = val;
      this.equipmentService.GetActyvitiEquipmentByFile(val.idFolder).subscribe(resp => {
        this.equipments = resp.result;
        this.getManageWorkOrder();
      });
    });
  }

  get f() {
    return this.equipmentForm.controls;
  }

  setupForm() {
    this.equipmentForm = new FormGroup({
      equipment: new FormControl(null, Validators.required),
      Serial: new FormControl(null, Validators.required),
      movement: new FormControl(null, Validators.required)
    });
  }

  onSubmit() {
    let ev: any = undefined;

    this.equipmentFormRef.onSubmit(ev);

    if (this.equipmentForm.valid) {
      if (this.validateForm()) {
        const equipment = {
          idDto: this.equipmentForm.get('equipment')?.value,
          codeEquipmentDto: this.getEquipment(this.equipmentForm.get('equipment')?.value)?.codigoDto,
          decriptionEquipmentDto: this.getEquipment(this.equipmentForm.get('equipment')?.value)?.nombreGeneric,
          serialDto: this.equipmentForm.get('Serial')?.value,
          idMovement: this.equipmentForm.get('movement')?.value,
          movement: this.getMovement(this.equipmentForm.get('movement')?.value)
        };
        this.equipmentsArray?.push(equipment); //= [...[material], ...this.materialsArray];
        this.equipmentFormRef.resetForm();
        this.equipmentForm.reset();

        this.mapEquipments();
      }
    }
  }

  validateForm(): boolean {

    if (this.equipmentsArray?.find(f => f.idDto === this.equipmentForm.get('equipment')?.value && f.serialDto === this.equipmentForm.get('Serial')?.value)?.codeEquipmentDto) {
      this.presentAlertMultipleButton('Este equipo ya esta asociado');
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

  getEquipment(id: string) {
    return this.equipments.find(f => f.idParamGenericActividad === id);
  }

  getMovement(id: string) {
    return this.movements.find(f => f.idDto === id).descripcionDto;
  }

  deleteEquipment(id: string) {
    this.equipmentsArray = this.equipmentsArray?.filter(f => f.idDto !== id);
    this.mapEquipments();
  }

  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

  mapEquipments() {
    if (this.manageWorkOrder.supplies.length === 0) {
      this.manageWorkOrder.supplies = [{
        idActivityDto: this.variablesManageWorkOrder.idActivity,
        equipment: this.equipmentsArray,
        material: []
      }];
    } else if (!this.manageWorkOrder.supplies.find(f => f.idActivityDto === this.variablesManageWorkOrder.idActivity)?.idActivityDto) {
      this.manageWorkOrder.supplies.push({
        idActivityDto: this.variablesManageWorkOrder.idActivity,
        equipment: this.equipmentsArray,
        material: []
      });
    } else {
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivity) {
          f.equipment = this.equipmentsArray;
        }
      });
    }

    this.setManageWorkOrder();
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

  viewScanner() {
    console.log('algo');
  }

}
