import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ComponentsService } from '../../services/components.service';
import { GenericsService } from '../../services/generics.service';
import { Master, Session } from '../../interfaces/interfaces';
import { Observable } from 'rxjs';
import { SaveOrderWorkIN } from './interfaces/interfacesWorkOrder';
import { Storage } from '@ionic/storage-angular';
import { WorkOrderService } from './services/workOrder.service';
import { AlertController, ModalController } from '@ionic/angular';
import { Geolocation } from '@capacitor/geolocation';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@awesome-cordova-plugins/native-geocoder/ngx';
import { ModalInfoComponent } from 'src/app/components/modal-info/modal-info.component';

@Component({
  selector: 'app-work-order',
  templateUrl: './work-order.page.html',
  styleUrls: ['./work-order.page.scss'],
})
export class WorkOrderPage implements OnInit {

  @ViewChild('workOrderFormRef', { static: false }) workOrderFormRef!: NgForm;

  public workOrderForm: FormGroup = new FormGroup({});

  public operationCenters!: Observable<Master[]>;
  public subscriberTypes: Master[] = [];
  public folders!: Observable<Master[]>;

  public codSubscriberType: boolean = true;
  public saveOrderWorkIN!: SaveOrderWorkIN;
  public getOrderWorkIN!: SaveOrderWorkIN;

  public session!: Session;

  public update: boolean = false;
  public title: string = 'Crear orden de trabajo';

  public coordinates: any;
  public addressArray: string[] = [];

  constructor(private router: Router, private comService: ComponentsService,
    private genericService: GenericsService, private storage: Storage,
    private workOrderService: WorkOrderService, private alertCtrl: AlertController,
    private route: ActivatedRoute,
    private modalCtrl: ModalController,
    //private nativeGeocoder: NativeGeocoder
  ) {

    this.getLocation();

    this.route.queryParams.subscribe(params => {
      if (params['update'] || '') {
        this.update = true;

        this.title = 'Ver orden de trabajo'

        this.codSubscriberType = ((params['idCodigoTipoSuscriptorDto'] || '') == 'NATU');

        this.getOrderWorkIN = {
          numeroOrdenDto: (params['numeroOrdenDto'] || ''),
          usuarioRegistraDto: '',
          operationCenterDto: (params['idCentroOperacionDto'] || ''),
          latitude: '',
          longitude: '',
          nodo: (params['node'] || ''),
          folderDto: (params['idCarpetaDto'] || ''),
          suscriptorDTO: {
            nombreDTO: (params['nombreSuscriptorDto'] || ''),
            apellidoDTO: (params['apellidoSuscriptorDto'] || ''),
            tipoSuscriptorDto: (params['idTipoSuscriptorDto'] || ''),
            numeroCuentaDto: (params['cuentaSuscriptorDto'] || ''),
            direccionDto: (params['direccionSuscriptorDto'] || '')
          }

        }
      }

    });
  }

  async getLocation() {
    const permissions = await Geolocation.checkPermissions();

    if (permissions.coarseLocation === "denied") {
      const request = await Geolocation.requestPermissions();
    } else {
      this.coordinates = await Geolocation.getCurrentPosition();
    }
  }

  getGeocode() {

    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.addressArray = [];

    // this.nativeGeocoder.reverseGeocode(this.coordinates.coords.latitude, this.coordinates.coords.longitude, options)
    //   .then((result: NativeGeocoderResult[]) => {

    //     let resultGeo = result;
    //     resultGeo.forEach((e: any) => {
    //       this.addressArray.push(e.addressLines[0].split(",")[0])
    //     });
    //   })
    //   .catch((error: any) => console.log(error));

    this.mostrarModal();
  }

  async mostrarModal() {
    const modal = await this.modalCtrl.create({
      component: ModalInfoComponent,
      componentProps: {
        dinamycArry: this.addressArray
      }
    });

    await modal.present();

    const { data } = await modal.onDidDismiss();

    this.workOrderForm.patchValue({
      address: data.address
    });
  }

  ngOnInit() {
    this.getSession();
    this.setupForm();
    this.operationCenters = this.genericService.getOperationCenter();
    this.folders = this.genericService.getFolders();
    this.genericService.getAllSubscriberType().subscribe(resp => {
      this.subscriberTypes = resp;
    });

    if (this.update) {
      this.setValuesForm();
    }
  }

  get f() {
    return this.workOrderForm.controls;
  }

  setupForm() {
    this.workOrderForm = new FormGroup({
      operationCenter: new FormControl(null, Validators.required),
      subscriberType: new FormControl(null, Validators.required),
      businessName: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      address: new FormControl(null, Validators.required),
      account: new FormControl(null, Validators.required),
      workOrder: new FormControl(null, Validators.required),
      folder: new FormControl(null, Validators.required),
      nodo: new FormControl(null, Validators.required)
    });
  }

  setValuesForm() {
    this.workOrderForm.patchValue({
      workOrder: this.getOrderWorkIN.numeroOrdenDto,
      operationCenter: this.getOrderWorkIN.operationCenterDto,
      folder: this.getOrderWorkIN.folderDto,
      account: this.getOrderWorkIN.suscriptorDTO.numeroCuentaDto,
      subscriberType: this.getOrderWorkIN.suscriptorDTO.tipoSuscriptorDto,
      businessName: this.getOrderWorkIN.suscriptorDTO.nombreDTO,
      name: this.getOrderWorkIN.suscriptorDTO.nombreDTO,
      lastName: this.getOrderWorkIN.suscriptorDTO.apellidoDTO,
      address: this.getOrderWorkIN.suscriptorDTO.direccionDto,
      nodo: this.getOrderWorkIN.nodo
    });
    this.workOrderForm.disable();
  }

  getSession() {
    this.storage.get('session').then((val) => {
      this.session = val;
    });
  }

  onSubmit() {

    let ev: any = undefined;

    this.workOrderFormRef.onSubmit(ev);

    if (this.workOrderForm.valid) {
      this.showLoading();
      this.saveOrderWorkIN = {
        numeroOrdenDto: this.workOrderForm.get('workOrder')?.value,
        usuarioRegistraDto: this.session.userID,
        operationCenterDto: this.workOrderForm.get('operationCenter')?.value,
        folderDto: this.workOrderForm.get('folder')?.value,
        latitude: this.coordinates.coords.latitude,
        longitude: this.coordinates.coords.longitude,
        nodo: this.workOrderForm.get('nodo')?.value,
        suscriptorDTO: {
          nombreDTO: (this.codSubscriberType) ? this.workOrderForm.get('name')?.value : this.workOrderForm.get('businessName')?.value,
          apellidoDTO: this.workOrderForm.get('lastName')?.value,
          tipoSuscriptorDto: this.workOrderForm.get('subscriberType')?.value,
          numeroCuentaDto: this.workOrderForm.get('account')?.value,
          direccionDto: this.workOrderForm.get('address')?.value
        }
      };
      this.workOrderService.SaveOrderWork(this.saveOrderWorkIN)
        .subscribe(resp => {
          if (resp.isSuccessful) {
            this.dismissLoading();
            this.presentAlertMultipleButton('ORDEN CREADA', true);
          } else {
            this.dismissLoading();
            this.presentAlertMultipleButton(resp.messages[0], false);
          }
        });
    }
  }

  async presentAlertMultipleButton(message: string, buttons: boolean) {

    const buttonOK = (buttons) ? [
      {
        text: 'Ok',
        role: 'confirm',
        handler: () => {
          this.router.navigate(['/home'], { queryParams: { refresh: true } });
        },
      },
    ] : [];

    const alert = await this.alertCtrl.create({
      header: message,
      buttons: buttonOK,
    });

    await alert.present();
  }

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  changeSubscriberType() {
    this.codSubscriberType = (this.subscriberTypes.find(f => f.idDto === this.workOrderForm.get('subscriberType')?.value)?.codigoDto === 'NATU');
    this.validateFields();
  }

  validateFields() {
    if (this.codSubscriberType) {
      this.workOrderForm.controls['businessName'].setValidators([]);
      this.workOrderForm.controls['businessName'].updateValueAndValidity();

      this.workOrderForm.controls['name'].setValidators([Validators.required]);
      this.workOrderForm.controls['name'].updateValueAndValidity();

      this.workOrderForm.controls['lastName'].setValidators([Validators.required]);
      this.workOrderForm.controls['lastName'].updateValueAndValidity();
    } else {
      this.workOrderForm.controls['name'].setValidators([]);
      this.workOrderForm.controls['name'].updateValueAndValidity();

      this.workOrderForm.controls['lastName'].setValidators([]);
      this.workOrderForm.controls['lastName'].updateValueAndValidity();

      this.workOrderForm.controls['businessName'].setValidators([Validators.required]);
      this.workOrderForm.controls['businessName'].updateValueAndValidity();
    }
    this.workOrderForm.controls['businessName'].setValue('');
    this.workOrderForm.controls['name'].setValue('');
    this.workOrderForm.controls['lastName'].setValue('');
  }


  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }



}
