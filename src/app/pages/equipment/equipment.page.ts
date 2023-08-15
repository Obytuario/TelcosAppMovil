import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, Validators, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage-angular';
import { ManageWorkOrder, VariablesManageWorkOrder, Masters } from '../../interfaces/interfaces';
import { Equipment } from './interfaces/interfaceEquipment';
import { ComponentsService } from '../../services/components.service';
import { StorageService } from '../../services/storage.service';
import { EquipmentService } from './services/equipment.service';
import { AlertController } from '@ionic/angular';

import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/services/global.service';

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

  qrCodeString = 'This is a secret qr code message';
  scannedResult: any;
  content_visibility = '';
  public masters!: Masters;
  public selectMasters!: Masters;

  scanActive: boolean = false;

  constructor(private storage: Storage,
    public equipmentService: EquipmentService,
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
          equipments: [],
          assistants: []
        };
      }

    });

  }

  ionViewDidLeave(){
    this.stopScan();
  }

  initializeApp() {
    this.globalService.getObservable().subscribe((data) => {
      this.selectMasters = data;
      if (data.equipments.length > 0) {
        this.equipmentForm.patchValue({
          equipment: data.equipments[0].nombreGeneric
        });
      }
    });
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
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp) {
          this.equipmentsArray = f.equipment;
        }
      });
    });
  }

  getVariablesManageWorkOrder() {
    this.storage.get('variablesManageWorkOrder').then((val) => {
      this.variablesManageWorkOrder = val;
      if (this.masters?.equipments?.length > 0) {
        this.equipments = this.masters.equipments;
      } else {
        this.equipmentService.GetEquipmentByActivity(val.idActivity).subscribe(resp => {
          this.equipments = resp.result;
          this.masters.equipments = this.equipments;
          this.getManageWorkOrder();
          this.setMasters();
        });
      }
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
          idDto: this.selectMasters.equipments[0]?.idParamGenericActividad,
          codeEquipmentDto: this.selectMasters.equipments[0]?.codigoDto,
          decriptionEquipmentDto: this.selectMasters.equipments[0]?.nombreGeneric,
          serialDto: this.equipmentForm.get('Serial')?.value,
          idMovement: this.equipmentForm.get('movement')?.value,
          movement: this.getMovement(this.equipmentForm.get('movement')?.value)
        };
        this.equipmentsArray?.push(equipment); //= [...[material], ...this.materialsArray];
        this.equipmentFormRef.resetForm();
        this.equipmentForm.reset();

        this.mapEquipments();

        this.selectMasters.equipments = [];
        this.setSelectMasters();

      }
    }
  }

  validateForm(): boolean {

    if (this.equipmentsArray?.find(f => f.idDto === this.selectMasters.equipments[0]?.idParamGenericActividad && f.serialDto === this.equipmentForm.get('Serial')?.value)?.codeEquipmentDto) {
      this.presentAlertMultipleButton('Este serializado ya esta asociado');
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
        idActivityDto: this.variablesManageWorkOrder.idActivityTemp,
        equipment: this.equipmentsArray,
        material: []
      }];
    } else if (!this.manageWorkOrder.supplies.find(f => f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp)?.idActivityDto) {
      this.manageWorkOrder.supplies.push({
        idActivityDto: this.variablesManageWorkOrder.idActivityTemp,
        equipment: this.equipmentsArray,
        material: []
      });
    } else {
      this.manageWorkOrder.supplies.map(f => {
        if (f.idActivityDto === this.variablesManageWorkOrder.idActivityTemp) {
          f.equipment = this.equipmentsArray;
        }
      });
    }

    this.setManageWorkOrder();
  }

  goToSearch() {
    this.router.navigate(['/search'], { queryParams: { origin: 'E' } });
  }

  async setSelectMasters() {
    await this.storageService.loadSelectMasters(this.selectMasters);
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

  async checkPermission() {
    try {
      // check or request permission
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        // the user granted permission
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }

  }

  async startScan() {
    try {
      const permission = await this.checkPermission();
      if (!permission) {
        return;
      }
      this.scanActive = true;
      await BarcodeScanner.hideBackground();
      document.querySelector('body')?.classList.add('scanner-active');
      this.content_visibility = 'hidden';
      const result = await BarcodeScanner.startScan();
      BarcodeScanner.showBackground();
      BarcodeScanner.stopScan();
      document.querySelector('body')?.classList.remove('scanner-active');
      this.content_visibility = '';
      this.scanActive = false;
      if (result?.hasContent) {
        this.equipmentForm.patchValue({
          Serial: result.content
        });
        this.scannedResult = result.content;
      }
    } catch (e) {
      this.stopScan();
    }
  }

  stopScan() {
    BarcodeScanner.showBackground();
    BarcodeScanner.stopScan();
    document.querySelector('body')?.classList.remove('scanner-active');
    this.content_visibility = '';
    this.scanActive = false;
  }

  async setMasters() {
    await this.storageService.loadMasters(this.masters);
  }

  ngOnDestroy(): void {
    this.stopScan();
  }

}
