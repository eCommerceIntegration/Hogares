import { IServicio } from 'app/entities/servicio/servicio.model';

export interface IAccion {
  id?: string;
  title?: string | null;
  description?: string | null;
  servicio?: IServicio | null;
}

export class Accion implements IAccion {
  constructor(public id?: string, public title?: string | null, public description?: string | null, public servicio?: IServicio | null) {}
}

export function getAccionIdentifier(accion: IAccion): string | undefined {
  return accion.id;
}
