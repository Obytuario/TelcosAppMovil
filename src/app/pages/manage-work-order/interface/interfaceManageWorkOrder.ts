import { SafeResourceUrl } from '@angular/platform-browser';
export interface Activity {
  id: string,
  idDto: string,
  descripcionDto: string,
  codigoDto: string
}
export interface Photo {
  idDto: string,
  descripcionDto: string,
  base64String?: string,
  imageUrl: string
}
