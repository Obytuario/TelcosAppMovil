import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonList, IonPopover, LoadingController, PopoverController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { DataService } from '../../services/data.service';
import { PopoverInfoComponent } from '../../components/popover-info/popover-info.component';
import { Platform } from '@ionic/angular';
import { Session } from 'src/app/interfaces/interfaces';
import { Storage } from '@ionic/storage-angular';
import { HomeService } from './services/home.service';
import { ComponentsService } from '../../services/components.service';
import { StorageService } from 'src/app/services/storage.service';
import { ManageWorkOrder, VariablesManageWorkOrder } from '../../interfaces/interfaces';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild(IonList) ionList!: IonList;

  loading!: HTMLIonLoadingElement;
  workOrders: any[] = [];
  isOpen = false;
  validateLengthData: boolean = true;

  public manageWorkOrder: ManageWorkOrder;
  public variablesManageWorkOrder: VariablesManageWorkOrder;
  public session!: Session;

  constructor(private homeService: HomeService,
    private popoverCtrl: PopoverController,
    private router: Router,
    private platform: Platform,
    private storage: Storage,
    private route: ActivatedRoute,
    private comService: ComponentsService,
    private storageService: StorageService) {

    this.platform.backButton.subscribeWithPriority(10, () => {
      this.presentPopover();
    });

    this.route.queryParams.subscribe(params => {
      if (params['refresh'] || '')
        this.getWorkOrders(this.session.userID);

    })

    this.manageWorkOrder = {
      idWorkOrderDto: '',
      idfolderDto: '',
      codigoDto: '',
      supplies: [],
      activity: [],
      photos: [],
      assistants: []
    }

    this.variablesManageWorkOrder = {
      idFolder: '',
      idActivityTemp: '',
      idActivity: ''
    }
  }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.getSession();
  }

  getWorkOrders(userID: string) {
    this.showLoading()
    this.homeService.GetWorkOrderByUser(userID).subscribe(resp => {
      this.workOrders = resp.result;
      if ((this.workOrders || []).length > 0)
        this.validateLengthData = false;

      this.dismissLoading();
    });
  }

  getSession() {
    this.storage.get('session').then((val) => {
      this.session = val;
      this.getWorkOrders(this.session.userID);
    });
  }

  goToManageWorkOrder(workOrder: any) {
    this.variablesManageWorkOrder.idFolder = workOrder.idCarpetaDto;
    this.setVariablesManageWorkOrder();
    this.manageWorkOrder.idfolderDto = workOrder.idCarpetaDto;
    this.manageWorkOrder.idWorkOrderDto = workOrder.idDto;
    this.setManageWorkOrder();
    this.ionList.closeSlidingItems();
    this.router.navigate(['/manage-work-order'], {
      queryParams: {
        update: true,
        idCarpetaDto: workOrder.idCarpetaDto
      }
    });
  }

  viewWorkOrder(workOrder: any) {
    this.ionList.closeSlidingItems();
    this.router.navigate(['/work-order'], {
      queryParams: {
        update: true,
        idCentroOperacionDto: workOrder.idCentroOperacionDto,
        cuentaSuscriptorDto: workOrder.cuentaSuscriptorDto,
        idCarpetaDto: workOrder.idCarpetaDto,
        numeroOrdenDto: workOrder.numeroOrdenDto,
        estadoOrdenDTO: workOrder.estadoOrdenDTO,
        idTipoSuscriptorDto: workOrder.idTipoSuscriptorDto,
        nombreSuscriptorDto: workOrder.nombreSuscriptorDto,
        apellidoSuscriptorDto: workOrder.apellidoSuscriptorDto,
        idCodigoTipoSuscriptorDto: workOrder.idCodigoTipoSuscriptorDto,
        direccionSuscriptorDto: workOrder.direccionSuscriptorDto
      }
    });

  }

  async presentPopover(ev?: any) {

    const popover = await this.popoverCtrl.create({
      component: PopoverInfoComponent,
      event: ev,
      translucent: true,
      backdropDismiss: true
    });

    await popover.present();

    const { data } = await popover.onWillDismiss();

  }

  handleRefresh(event: any) {
    this.getWorkOrders(this.session.userID);
    // Any calls to load data go here
    event.target.complete();
  };

  showLoading() {
    this.comService.showLoading();
  }

  dismissLoading() {
    this.comService.dismissLoading();
  }

  async setVariablesManageWorkOrder() {
    await this.storageService.loadVariablesManageWorkOrder(this.variablesManageWorkOrder);
  }

  async setManageWorkOrder() {
    await this.storageService.loadManageWorkOrder(this.manageWorkOrder);
  }

}
