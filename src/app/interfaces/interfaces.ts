import { Material } from '../pages/materials/interfaces/interfaceMaterials';
import { Equipment } from '../pages/equipment/interfaces/interfaceEquipment';
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
  idActivity: string;
}


export class ManageWorkOrder {
  idWorkOrderDto: string;
  idfolderDto: string;
  codigoDto: string;
  supplies: Supplies[];

  constructor() {
    this.idWorkOrderDto = '';
    this.idfolderDto = '';
    this.codigoDto = '';
    this.supplies = [];
  }
}

export interface Supplies {

  idActivityDto: string,
  material?: Material[],
  equipment?: Equipment[]
}
