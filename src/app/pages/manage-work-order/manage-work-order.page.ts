import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, IonList, IonSlides, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from '@ionic/storage-angular';
import { VariablesManageWorkOrder } from '../../interfaces/interfaces';


@Component({
  selector: 'app-manage-work-order',
  templateUrl: './manage-work-order.page.html',
  styleUrls: ['./manage-work-order.page.scss'],
})
export class ManageWorkOrderPage implements OnInit {

  @ViewChild(IonContent, { static: true }) ionContent!: IonContent;
  @ViewChild(IonSlides, { static: false }) ionSlides!: IonSlides;
  @ViewChild('billingFormRef', { static: false }) billingFormRef!: NgForm;
  @ViewChild('shippingFormRef', { static: false }) shippingFormRef!: NgForm;
  @ViewChild('paymentFormRef', { static: false }) paymentFormRef!: NgForm;
  @ViewChild(IonList) ionList!: IonList;

  public order: any = {
    id: 1,
    items: [{
      id: 1,
      name: 'Denim T-Shirt',
      amount: 15.00,
    }, {
      id: 1,
      name: 'Denim Pants',
      amount: 5.00,
    }, {
      id: 1,
      name: 'Black T-Shirt',
      amount: 5.00,
    }],
    subtotal: 25.00,
    shippingFee: 5.00,
    total: 30.00,
  };

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

  materials: any[] = [{
    id: 1,
    name: '1105-AV CAMBIOS DE EQUIPO',
    type: 'HERRAJE SUSPENSIÓN FIBRA OPTICA',
  },
  {
    id: 2,
    name: '1107-AV ARREGLO UNIDAD HCF BIDIRECCIONAL',
    type: 'CONECTOR I-STOP-42 REVERSE TEST TRTC',
  },
  {
    id: 3,
    name: '1178-AV CAMBIOS DE EQUIPO ZZT',
    type: 'CORREA PARA AJUSTAR CABLE COAXIAL BLANCA',
  }];

  constructor(private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private storageService: StorageService) {
      this.route.queryParams.subscribe(params => {
        if (params['update'] || '')
          this.update = true;

          this.idFolder = (params['idCarpetaDto'] || '');

      });
      this.storage.get('variablesManageWorkOrder').then((val) => {
        console.log(val);
        this.variablesManageWorkOrder = val;

      });
  }

  ngOnInit() {
    this.setupForm();
    this.buildSlides();
    this.activitys = ['1105-AV CAMBIOS DE EQUIPO',
      '1107-AV ARREGLO UNIDAD HCF BIDIRECCIONAL',
      '1178-AV CAMBIOS DE EQUIPO ZZT',
      '1185-AV CAMBIOS DE CABLES'];

    this.pictureType = ['FACHADA',
      'POTENCIA'];

    this.assistants = ['103052564-CAMILO ORTIZ',
      '11076987-CARLOS RESTREPO',
      '1028975648-MARCO PEREZ',
      '11855987634-MARIO ALBERTO MENDOZA'];

  }

  get fBi(){
    return this.billingForm.controls;
  }

  get fSh(){
    return this.shippingForm.controls;
  }

  get fPay(){
    return this.paymentForm.controls;
  }


  ionViewDidEnter() {
    this.ionSlides.updateAutoHeight();
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
  }

  goToSupplies(idActivity:  string) {
    this.variablesManageWorkOrder.idActivity = idActivity;
    this.setVariablesManageWorkOrder();
    this.ionList.closeSlidingItems();
    this.router.navigate(['/supplies']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  onNextButtonTouched() {

    let ev: any = undefined;

    if (this.currentSlide === 'Actividad') {

      this.billingFormRef.onSubmit(ev);

      if (this.billingForm.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
      }

    } else if (this.currentSlide === 'Shipping') {

      this.shippingFormRef.onSubmit(ev);

      if (this.shippingForm.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
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

  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(blob);
  });

  originalOrder = (): number => {
    return 0;
  }

  async setVariablesManageWorkOrder() {
    await this.storageService.loadVariablesManageWorkOrder(this.variablesManageWorkOrder);
  }

}
