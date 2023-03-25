export interface SaveOrderWorkIN {
  numeroOrdenDto: string;
  usuarioRegistraDto: string;
  suscriptorDTO: SuscriptorDTO;
  folderDto: string;
  operationCenterDto?: string;
}

export interface SuscriptorDTO {
  nombreDTO: string;
  apellidoDTO: string;
  tipoSuscriptorDto: string;
  numeroCuentaDto: string;
}
