import { Material } from '../pages/materials/interfaces/interfaceMaterials';
import { Equipment } from '../pages/equipment/interfaces/interfaceEquipment';
import { Activity } from '../pages/manage-work-order/interface/interfaceManageWorkOrder';
export interface Menu {
  icon: string;
  name: string;
  redirectTo: string;
}

export class RequestResult<T> {
  isSuccessful: boolean;
  isError: boolean;
  errorMessage: string;
  messages: string[];
  result!: T;

  constructor() {
    this.isSuccessful = false;
    this.isError = false;
    this.errorMessage = '';
    this.messages = [];
  }
}

export interface Login {
  user: string;
  password: string;
  latitude: number;
  longitude:number;
}

export interface SaveLocationUser {
  idUser: string;
  latitude: number;
  longitude:number;
}

export interface Session {
  token: string;
  userID: string;
}

export interface Master {
  idDto: string;
  descripcionDto: string;
  codigoDto: string;
}

export interface VariablesManageWorkOrder {
  idFolder: string;
  idActivityTemp: string;
  idActivity: string;
}


export class ManageWorkOrder {
  idWorkOrderDto: string;
  idfolderDto: string;
  codigoDto: string;
  supplies: Supplies[];
  activity: Activity[];
  photos: any[];
  assistants: any[];

  constructor() {
    this.idWorkOrderDto = '';
    this.idfolderDto = '';
    this.codigoDto = '';
    this.supplies = [];
    this.activity = [];
    this.photos = [];
    this.assistants = [];
  }
}

export interface Supplies {

  idActivityDto: string,
  material?: Material[],
  equipment?: Equipment[]
}

export class Masters {

  activitys: any[];
  materials: any[];
  equipments: any[];
  assistants: any[];

  constructor() {
    this.activitys = [];
    this.materials = [];
    this.equipments = [];
    this.assistants = [];
  }
}

