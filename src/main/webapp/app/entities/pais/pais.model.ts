import { IRegion } from 'app/entities/region/region.model';

export interface IPais {
  id?: string;
  paisName?: string | null;
  region?: IRegion | null;
}

export class Pais implements IPais {
  constructor(public id?: string, public paisName?: string | null, public region?: IRegion | null) {}
}

export function getPaisIdentifier(pais: IPais): string | undefined {
  return pais.id;
}
