import * as dayjs from 'dayjs';
import { IServicio } from 'app/entities/servicio/servicio.model';
import { IHogar } from 'app/entities/hogar/hogar.model';

export interface ISolicitante {
  id?: string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  servicios?: IServicio[] | null;
  hogar?: IHogar | null;
}

export class Solicitante implements ISolicitante {
  constructor(
    public id?: string,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public salary?: number | null,
    public commissionPct?: number | null,
    public servicios?: IServicio[] | null,
    public hogar?: IHogar | null
  ) {}
}

export function getSolicitanteIdentifier(solicitante: ISolicitante): string | undefined {
  return solicitante.id;
}
