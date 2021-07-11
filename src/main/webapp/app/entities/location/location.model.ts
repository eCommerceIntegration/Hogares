import { IRegion } from 'app/entities/region/region.model';
import { IHogar } from 'app/entities/hogar/hogar.model';

export interface ILocation {
  id?: string;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
  regions?: IRegion[] | null;
  hogar?: IHogar | null;
}

export class Location implements ILocation {
  constructor(
    public id?: string,
    public streetAddress?: string | null,
    public postalCode?: string | null,
    public city?: string | null,
    public stateProvince?: string | null,
    public regions?: IRegion[] | null,
    public hogar?: IHogar | null
  ) {}
}

export function getLocationIdentifier(location: ILocation): string | undefined {
  return location.id;
}
