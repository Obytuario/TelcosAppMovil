import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ActionSheetController, IonContent, IonList, IonSlides, NavController } from '@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { Storage } from '@ionic/storage-angular';
import { VariablesManageWorkOrder, ManageWorkOrder } from '../../interfaces/interfaces';
import { ManageWorkOrderService } from './services/manageWorOrder.service';
import { Activity } from './interface/interfaceManageWorkOrder';


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
  public manageWorkOrder: ManageWorkOrder;
  public slidesIf: string = 'Actividad'

  constructor(private actionSheetCtrl: ActionSheetController,
    private navCtrl: NavController,
    private sanitizer: DomSanitizer,
    private router: Router,
    private route: ActivatedRoute,
    private storage: Storage,
    private storageService: StorageService,
    private manageWorkOrderService: ManageWorkOrderService) {
    this.route.queryParams.subscribe(params => {
      if (params['update'] || '')
        this.update = true;

      this.idFolder = (params['idCarpetaDto'] || '');

    });
    this.storage.get('variablesManageWorkOrder').then((val) => {
      console.log(val);
      this.variablesManageWorkOrder = val;

    });

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: [],
      activity: [],
      assistants: []
    }

    this.getManageWorkOrder();
  }

  ngOnInit() {
    this.setupForm();
    this.buildSlides();
    this.manageWorkOrderService.GetActivity().subscribe(resp => {
      this.activitys = resp.result;
    });

    this.manageWorkOrderService.GetPhotoType().subscribe(resp => {
      this.pictureType = resp.result;
    });

    this.manageWorkOrderService.GetAllUsersByRolCode('TECX').subscribe(resp => {
      this.assistants = resp.result;
    });



  }

  getManageWorkOrder() {
    this.storage.get('manageWorkOrder').then((val) => {
      this.manageWorkOrder = val;
      this.activityArray = this.manageWorkOrder.activity;
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

  goToSupplies(idActivity: string) {
    this.variablesManageWorkOrder.idActivity = idActivity;
    this.setVariablesManageWorkOrder();
    this.ionList.closeSlidingItems();
    this.router.navigate(['/supplies']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  addActivityt() {
    let ev: any = undefined;

    this.billingFormRef.onSubmit(ev);

    if (this.billingForm.valid) {
      const activity = {
        idDto: this.billingForm.get('activity')?.value,
        descripcionDto: this.getActivity(this.billingForm.get('activity')?.value)?.descripcionDto,
        codigoDto: this.getActivity(this.billingForm.get('activity')?.value)?.codigoDto
      }
      this.activityArray.push(activity);
      this.billingFormRef.resetForm();
      this.billingForm.reset();

      this.manageWorkOrder.activity = this.activityArray;
      this.setManageWorkOrder();
    }
  }

  getActivity(id: string) {
    return this.activitys.find(f => f.idDto === id);
  }

  deleteActivity(id: string) {
    this.activityArray = this.activityArray?.filter(f => f.idDto !== id);
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

      if (this.activityArray.length > 0 && this.manageWorkOrder.supplies.length > 0) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
        this.slidesIf = 'Shipping';
      }

    } else if (this.currentSlide === 'Shipping') {

      this.shippingFormRef.onSubmit(ev);

      if (this.shippingForm.valid) {
        this.ionSlides.slideNext();
        this.ionContent.scrollToTop();
        this.slidesIf = 'Cierre';
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

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder)
  }

}
