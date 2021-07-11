import { IPais } from 'app/entities/pais/pais.model';
import { ILocation } from 'app/entities/location/location.model';

export interface IRegion {
  id?: string;
  regionName?: string | null;
  pais?: IPais[] | null;
  location?: ILocation | null;
}

export class Region implements IRegion {
  constructor(public id?: string, public regionName?: string | null, public pais?: IPais[] | null, public location?: ILocation | null) {}
}

export function getRegionIdentifier(region: IRegion): string | undefined {
  return region.id;
}
