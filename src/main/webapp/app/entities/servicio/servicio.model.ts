import { IAccion } from 'app/entities/accion/accion.model';
import { ISolicitante } from 'app/entities/solicitante/solicitante.model';

export interface IServicio {
  id?: string;
  servicioTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  accions?: IAccion[] | null;
  solicitante?: ISolicitante | null;
}

export class Servicio implements IServicio {
  constructor(
    public id?: string,
    public servicioTitle?: string | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public accions?: IAccion[] | null,
    public solicitante?: ISolicitante | null
  ) {}
}

export function getServicioIdentifier(servicio: IServicio): string | undefined {
  return servicio.id;
}
