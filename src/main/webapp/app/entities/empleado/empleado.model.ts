import * as dayjs from 'dayjs';
import { ITrabajo } from 'app/entities/trabajo/trabajo.model';
import { IHogar } from 'app/entities/hogar/hogar.model';

export interface IEmpleado {
  id?: string;
  empleadoId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
  trabajos?: ITrabajo[] | null;
  hogar?: IHogar | null;
}

export class Empleado implements IEmpleado {
  constructor(
    public id?: string,
    public empleadoId?: string | null,
    public firstName?: string | null,
    public lastName?: string | null,
    public email?: string | null,
    public phoneNumber?: string | null,
    public hireDate?: dayjs.Dayjs | null,
    public salary?: number | null,
    public commissionPct?: number | null,
    public trabajos?: ITrabajo[] | null,
    public hogar?: IHogar | null
  ) {}
}

export function getEmpleadoIdentifier(empleado: IEmpleado): string | undefined {
  return empleado.id;
}
