import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ManageWorkOrder, VariablesManageWorkOrder } from '../../interfaces/interfaces';
import { Equipment } from './interfaces/interfaceEquipment';
import { ComponentsService } from '../../services/components.service';
import { StorageService } from '../../services/storage.service';
import { EquipmentService } from './services/equipment.service';

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

  states: any[] = [{
    id: 1,
    name: 'Instalado',
    code: 'INS',
  },
  {
    id: 2,
    name: 'Retirado',
    code: 'RET',
  }];

  constructor(private storage: Storage, public equipmentService: EquipmentService,
    private comService: ComponentsService,
    private storageService: StorageService) {

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: []
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
          this.equipmentsArray = f.equipment;
        }
      });
    });
  }

  getVariablesManageWorkOrder() {
    this.storage.get('variablesManageWorkOrder').then((val) => {
      console.log(val);
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
      if (!this.equipmentsArray?.find(f => f.codeEquipmentDto === this.equipmentForm.get('equipment')?.value)?.codeEquipmentDto && this.equipmentForm.get('Serial')?.value > 0) {
        const equipment = {
          codeEquipmentDto: this.equipmentForm.get('equipment')?.value,
          decriptionEquipmentDto: this.getEquipment(this.equipmentForm.get('equipment')?.value),
          serialDto: this.equipmentForm.get('Serial')?.value,
          movement: this.getMovement(this.equipmentForm.get('movement')?.value)
        };
        this.equipmentsArray?.push(equipment); //= [...[material], ...this.materialsArray];
        this.equipmentFormRef.resetForm();
        this.equipmentForm.reset();

        this.mapEquipments();
      }
    }
  }

  getEquipment(id: string) {
    return this.equipments.find(f => f.idParamGenericActividad === id).nombreGeneric;
  }

  getMovement(id: string) {
    return this.states.find(f => f.id === +id).name;
  }

  deleteEquipment(id: string) {
    this.equipmentsArray = this.equipmentsArray?.filter(f => f.codeEquipmentDto !== id);
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
        equipment: this.equipmentsArray
      }];
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
