import { IEmpleado } from 'app/entities/empleado/empleado.model';
import { ILocation } from 'app/entities/location/location.model';
import { ISolicitante } from 'app/entities/solicitante/solicitante.model';
import { Language } from 'app/entities/enumerations/language.model';

export interface IHogar {
  id?: string;
  hogarName?: string;
  language?: Language | null;
  empleados?: IEmpleado[] | null;
  locations?: ILocation[] | null;
  solicitantes?: ISolicitante[] | null;
}

export class Hogar implements IHogar {
  constructor(
    public id?: string,
    public hogarName?: string,
    public language?: Language | null,
    public empleados?: IEmpleado[] | null,
    public locations?: ILocation[] | null,
    public solicitantes?: ISolicitante[] | null
  ) {}
}

export function getHogarIdentifier(hogar: IHogar): string | undefined {
  return hogar.id;
}
