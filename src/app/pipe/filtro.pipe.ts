import { Pipe, PipeTransform } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Masters } from '../interfaces/interfaces';

@Pipe({
  name: 'filtro'
})
export class FiltroPipe implements PipeTransform {

  public masters!: Masters;

  constructor(private storage: Storage) {
    this.storage.get('masters').then((val: Masters) => {
      if (val !== null) {
        this.masters = val;
      }
    });
  }

  transform(arreglo: any[], texto: string = '', origin: string, columna: string = 'descripcionDto'): any[] {

    if (texto === '') {
      return arreglo;
    }

    if (!arreglo) {
      return arreglo;
    }

    texto = texto.toLocaleLowerCase();

    let arryTemp: any[] = [];
    if (origin == 'A') {
      arryTemp = this.masters.activitys;
    }
    else if (origin == 'M') {
      arryTemp = this.masters.materials;
    }
    else if (origin == 'E') {
      arryTemp = this.masters.equipments;
    }

    return arryTemp.filter(
      item => item[columna].toLowerCase().includes(texto)
    );
  }

}
