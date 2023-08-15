export interface SaveOrderWorkIN {
  numeroOrdenDto: string;
  usuarioRegistraDto: string;
  suscriptorDTO: SuscriptorDTO;
  folderDto: string;
  operationCenterDto?: string;
  latitude: string;
  longitude: string;
  nodo: string;
}

export interface SuscriptorDTO {
  nombreDTO: string;
  apellidoDTO: string;
  tipoSuscriptorDto: string;
  numeroCuentaDto: string;
  direccionDto: string;
}
