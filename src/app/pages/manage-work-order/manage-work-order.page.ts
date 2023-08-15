import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, AlertController, IonContent, IonList, IonSlides, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from '@ionic/storage-angular';
import { VariablesManageWorkOrder, ManageWorkOrder, Session, Masters } from '../../interfaces/interfaces';
import { ManageWorkOrderService } from './services/manageWorOrder.service';
import { Activity, Photo } from './interface/interfaceManageWorkOrder';
import { Camera, CameraResultType } from '@capacitor/camera';
import { ComponentsService } from '../../services/components.service';


@Component({
  selector: 'app-manage-work-order',
  templateUrl: './manage-work-order.page.html',
  styleUrls: ['./manage-work-order.page.scss'],
})
export class ManageWorkOrderPage implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: true }) ionContent!: IonContent;
  @ViewChild(IonSlides, { static: false }) ionSlides!: IonSlides;
  @ViewChild('billingFormRef', { static: false }) billingFormRef!: NgForm;
  @ViewChild('shippingFormRef', { static: false }) shippingFormRef!: NgForm;
  @ViewChild('paymentFormRef', { static: false }) paymentFormRef!: NgForm;
  @ViewChild(IonList) ionList!: IonList;

  public billingForm: FormGroup = new FormGroup({});
  public paymentForm: FormGroup = new FormGroup({});
  public shippingForm: FormGroup = new FormGroup({});

  public imagePath!: SafeResourceUrl;

  public activitys!: any[];

  public pictureType!: any[];

  public assistants!: any[];

  public slidesOpts = {
    allowTouchMove: false,
    autoHeight: true,
  };

  public slides: string[] = [];
  public currentSlide: string = '';
  public isBeginning: boolean = true;
  public isEnd: boolean = false;

  public idFolder: string = '';
  public update: boolean = false;

  public variablesManageWorkOrder!: VariablesManageWorkOrder;

  public activityArray: Activity[] = [];
  public assistantArray: any[] = [];
  public photoArray: Photo[] = [];
  public manageWorkOrder: ManageWorkOrder;
  public slidesIf: string = 'Actividad'
  public session!: Session;
  public imageUrls!: any;
  public selectMasters!: Masters;
  public masters!: Masters;


  constructor(private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private storageService: StorageService,
    private manageWorkOrderService: ManageWorkOrderService,
    private alertCtrl: AlertController, private comService: ComponentsService) {
    this.route.queryParams.subscribe(params => {
      if (params['update'] || '') {
        this.update = true;
      }

      this.idFolder = (params['idCarpetaDto'] || '');

    });

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

    this.storage.get('variablesManageWorkOrder').then((val) => {
      this.variablesManageWorkOrder = val;
    });

    this.storage.get('session').then((val) => {
      this.session = val;
    });

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: [],
      activity: [],
      photos: [],
      assistants: []
    }

    this.callManageWorkOrder();
  }

  ngOnInit() {
    this.setupForm();
    this.buildSlides();
    // if (this.masters?.activitys?.length > 0) {
    //   this.activitys = this.masters.activitys;
    // } else {
      this.manageWorkOrderService.GetActivity(this.idFolder).subscribe(resp => {
        this.activitys = resp.result;
        this.masters.activitys = this.activitys;
        this.setMasters();

      });
    //}


    this.manageWorkOrderService.GetPhotoType().subscribe(resp => {
      this.pictureType = resp.result;
    });

    this.manageWorkOrderService.GetAllUsersByRolCode('TECX').subscribe(resp => {
      this.assistants = resp.result;
    });

  }

  callManageWorkOrder() {
    this.getManageWorkOrder().then((val) => {
      this.manageWorkOrder = val;
      this.activityArray = this.manageWorkOrder.activity;
      this.photoArray = this.manageWorkOrder.photos;
      this.assistantArray = this.manageWorkOrder.assistants;
    });

  }

  get fBi() {
    return this.billingForm.controls;
  }

  get fSh() {
    return this.shippingForm.controls;
  }

  get fPay() {
    return this.paymentForm.controls;
  }


  ionViewDidEnter() {
    this.ionSlides.updateAutoHeight();
    this.storage.get('selectMasters').then((val: Masters) => {
      this.selectMasters = val;
      if (val.activitys.length > 0) {
        this.billingForm.patchValue({
          activity: val.activitys[0].descripcionDto
        });
      }
    });
  }

  buildSlides() {
    const slides = ['Actividad', 'Registro', 'Cierre'];
    this.currentSlide = slides[0];
    this.slides = slides;
  }

  setupForm() {
    this.billingForm = new FormGroup({
      activity: new FormControl(null, Validators.required)
    });

    this.shippingForm = new FormGroup({
      picture: new FormControl(null, Validators.required)
    });

    this.paymentForm = new FormGroup({
      assistant: new FormControl(null, Validators.required)
    });
  }

  async onSlidesChanged() {
    const index = await this.ionSlides.getActiveIndex();
    this.currentSlide = this.slides[index];
    this.isBeginning = await this.ionSlides.isBeginning();
    this.isEnd = await this.ionSlides.isEnd();
  }

  onSlidesDidChange() {
    this.ionContent.scrollToTop();
  }

  onBackButtonTouched() {
    this.ionSlides.slidePrev();
    this.ionContent.scrollToTop();
    if (this.currentSlide === 'Registro') {

      this.slidesIf = 'Actividad';

    } else if (this.currentSlide === 'Cierre') {

      this.slidesIf = 'Registro';

    }
  }

  goToSupplies(idActivity: string,idActivityTemp: string) {
    this.variablesManageWorkOrder.idActivityTemp = idActivityTemp;
    this.variablesManageWorkOrder.idActivity = idActivity;
    this.setVariablesManageWorkOrder();
    this.ionList.closeSlidingItems();
    this.router.navigate(['/supplies']);
  }

  goToSearch() {
    this.router.navigate(['/search'], { queryParams: { origin: 'A' } });
  }

  goToHome() {
    this.showLoading();
    this.getManageWorkOrder().then((val: ManageWorkOrder) => {
      const manageWorkOrder = val;

      let equiL: any[] = [];
      let matL: any[] = [];
      let photoL: any[] = [];

      if(manageWorkOrder.supplies.length > 0){
        manageWorkOrder.supplies[0].equipment?.forEach((e: any) => {
          let equi = {

            paramEquipoDto: e.idDto,
            serialDto: e.serialDto,
            idMovimientoDto: e.idMovement
          }
          equiL.push(equi);

        });

        manageWorkOrder.supplies[0].material?.forEach((e: any) => {
          const mat = {

            paramMaterialDto: e.idDto,
            cantidadDto: e.quantityDto
          }
          matL.push(mat);

        });
      }

      if(manageWorkOrder.photos.length > 0){
        manageWorkOrder.photos?.forEach((e: any) => {
          const photo = {

            photoBase64String: e.base64String,
            idTipoPhoto: e.idDto
          }
          photoL.push(photo);

        });
      }

      const updateManageWorkOrder = {
        idWorkOrder: manageWorkOrder.idWorkOrderDto,
        idAssitant: manageWorkOrder.assistants[0]?.idDto,
        idUser: this.session.userID,
        photos: photoL,
        supplies: {
          equiptments: equiL,
          materials: matL
        },
        activitys: manageWorkOrder.activity
      };

    //   this.manageWorkOrderService.UpdateManageWorkOrder(updateManageWorkOrder).subscribe(resp => {
    //     if (resp.isSuccessful) {
    //       this.ionSlides.slideTo(0, 100);
    //       this.clearStorage();
    //       this.manageWorkOrder = {
    //         idWorkOrderDto: '',
    //         idfolderDto: '',
    //         codigoDto: '',
    //         supplies: [],
    //         activity: [],
    //         photos: [],
    //         assistants: []
    //       }
           this.dismissLoading();
    //       this.router.navigate(['/home'], { queryParams: { refresh: true } });
    //     } else {
    //       this.dismissLoading();
    //       this.presentAlertMultipleButton('No se puede gestionar la orden');
    //     }
    //   });
    });
  }

  addActivityt() {
    let ev: any = undefined;

    this.billingFormRef.onSubmit(ev);

    if (this.billingForm.valid) {
      if (this.validateFormActivity()) {
        const activity = {
          id: crypto.randomUUID(),
          idDto: this.selectMasters.activitys[0].idDto,
          descripcionDto: this.selectMasters.activitys[0].descripcionDto,
          codigoDto: this.selectMasters.activitys[0].codigoDto
        }
        this.activityArray.push(activity);
        this.billingFormRef.resetForm();
        this.billingForm.reset();

        this.manageWorkOrder.activity = this.activityArray;
        this.setManageWorkOrder();

        this.selectMasters.activitys = [];
        this.setSelectMasters();
      }
    }
  }

  validateFormActivity(): boolean {
    //Se comenta la validación de actividad repetida
    // if (this.activityArray?.find(f => f.idDto === this.selectMasters.activitys[0].idDto)?.codigoDto) {
    //   this.presentAlertMultipleButton('Esta actividad ya esta asociada');
    //   return false;
    // }

    return true;
  }

  getActivity(id: string) {
    return this.activitys.find(f => f.idDto === id);
  }

  deleteActivity(id: string) {
    this.activityArray = this.activityArray?.filter(f => f.id !== id);
    this.manageWorkOrder.activity = this.activityArray;
    this.setManageWorkOrder();
  }

  addAssistant() {
    let ev: any = undefined;

    this.paymentFormRef.onSubmit(ev);

    if (this.paymentForm.valid) {
      if (this.assistantArray.length == 0) {
        const assistant = {
          idDto: this.paymentForm.get('assistant')?.value,
          descripcionDto: this.getAssistant(this.paymentForm.get('assistant')?.value)?.fName + ' ' + this.getAssistant(this.paymentForm.get('assistant')?.value)?.lName,
          codigoDto: this.getAssistant(this.paymentForm.get('assistant')?.value)?.numberDocument
        }
        this.assistantArray.push(assistant);
        this.paymentFormRef.resetForm();
        this.paymentForm.reset();

        this.manageWorkOrder.assistants = this.assistantArray;
        this.setManageWorkOrder();
      }
    }
  }

  getAssistant(id: string) {
    return this.assistants.find(f => f.id === id);
  }

  deleteAssistant(id: string) {
    this.assistantArray = this.assistantArray?.filter(f => f.idDto !== id);
    this.manageWorkOrder.assistants = this.assistantArray;
    this.setManageWorkOrder();
  }

  onNextButtonTouched() {

    let ev: any = undefined;

    if (this.currentSlide === 'Actividad') {

      if (this.validateForm()) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
        this.slidesIf = 'Registro';
      }

    } else if (this.currentSlide === 'Registro') {

      if (this.photoArray.length >= 1) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
        this.slidesIf = 'Cierre';
      } else {
        this.presentAlertMultipleButton('Debe asociar al menos un tipo de foto');
      }

    } else if (this.currentSlide === 'Payment') {

      this.paymentFormRef.onSubmit(ev);

      if (this.paymentForm.valid) {
        this.navCtrl.navigateRoot('/thanks', {
          animated: true,
          animationDirection: 'forward',
        });
      }

    } else {

      this.ionSlides.slideNext();
      this.ionContent.scrollToTop();
    }
  }

  validateForm(): boolean {
    if (this.activityArray.length == 0) {
      this.presentAlertMultipleButton('Debe asociar una actividad');
      return false;
    }
    // else if (this.validateSupplies()) {
    //   return false;
    // }

    return true;
  }

  validateSupplies(): boolean {
    let cont = 0;
    for (let index = 0; index < this.activityArray.length; index++) {
      const element = this.activityArray[index];

      const supplie = this.manageWorkOrder.supplies.find(f => f.idActivityDto === element.idDto);

      if (supplie === undefined) {
        this.presentAlertMultipleButton('La actividad: ' + element.descripcionDto + ' no contiene insumos');
        return true;
      }

      if (supplie.equipment === undefined && supplie.material === undefined) {
        this.presentAlertMultipleButton('La actividad: ' + element.descripcionDto + ' no contiene insumos');
        return true;
      }

      cont++;

    }

    if (this.activityArray.length === cont) {
      return false;
    }

    return false;
  }

  originalOrder = (): number => {
    return 0;
  }

  validateRegister() {

    let ev: any = undefined;

    this.shippingFormRef.onSubmit(ev);

    if (this.shippingForm.valid) {
      if (!this.photoArray?.find(f => f.idDto === this.shippingForm.get('picture')?.value)?.idDto) {
        this.getCamera();
      } else {
        this.presentAlertMultipleButton('Este tipo de foto ya se encuentra asociado');
      }

    }

  }

  async getCamera() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      promptLabelHeader: 'Fotos',
      promptLabelPhoto: 'Abrir Galeria',
      promptLabelPicture: 'Tomar Foto'
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    //console.log(image.base64String);
    //console.log(image);
    //var imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`data:image/${image.format};base64, ${image.base64String}`);
    var imageUrl = `data:image/${image.format};base64, ${image.base64String}`;

    // Can be set to the src of an image now
    //imageElement.src = imageUrl;
    //this.imageUrls = imageUrl;

    const photo = {
      idDto: this.shippingForm.get('picture')?.value,
      descripcionDto: this.getPhoto(this.shippingForm.get('picture')?.value)?.descripcionDto,
      base64String: image.base64String,
      imageUrl: imageUrl
    }

    this.photoArray.push(photo);

    this.shippingFormRef.resetForm();
    this.shippingForm.reset();

    this.manageWorkOrder.photos = this.photoArray;
    this.setManageWorkOrder();
  }

  getPhoto(id: string) {
    return this.pictureType.find(f => f.idDto === id);
  }

  deletePhoto(id: string) {
    this.photoArray = this.photoArray?.filter(f => f.idDto !== id);
    this.manageWorkOrder.photos = this.photoArray;
    this.setManageWorkOrder();
  }

  GetSanitizer(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }

  async setSelectMasters() {
    await this.storageService.loadSelectMasters(this.selectMasters);
  }

  async setMasters() {
    await this.storageService.loadMasters(this.masters);
  }

  async setVariablesManageWorkOrder() {
    await this.storageService.loadVariablesManageWorkOrder(this.variablesManageWorkOrder);
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

  async getManageWorkOrder() {
    return await this.storage.get('manageWorkOrder');
  }

  async clearStorage() {
    return await this.storage.remove('manageWorkOrder');
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

  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

  ngOnDestroy(): void {
  }

}
