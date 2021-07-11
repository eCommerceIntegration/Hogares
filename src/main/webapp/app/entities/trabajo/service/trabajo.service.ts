import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ITrabajo, getTrabajoIdentifier } from '../trabajo.model';

export type EntityResponseType = HttpResponse<ITrabajo>;
export type EntityArrayResponseType = HttpResponse<ITrabajo[]>;

@Injectable({ providedIn: 'root' })
export class TrabajoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/trabajos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(trabajo: ITrabajo): Observable<EntityResponseType> {
    return this.http.post<ITrabajo>(this.resourceUrl, trabajo, { observe: 'response' });
  }

  update(trabajo: ITrabajo): Observable<EntityResponseType> {
    return this.http.put<ITrabajo>(`${this.resourceUrl}/${getTrabajoIdentifier(trabajo) as string}`, trabajo, { observe: 'response' });
  }

  partialUpdate(trabajo: ITrabajo): Observable<EntityResponseType> {
    return this.http.patch<ITrabajo>(`${this.resourceUrl}/${getTrabajoIdentifier(trabajo) as string}`, trabajo, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ITrabajo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ITrabajo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addTrabajoToCollectionIfMissing(trabajoCollection: ITrabajo[], ...trabajosToCheck: (ITrabajo | null | undefined)[]): ITrabajo[] {
    const trabajos: ITrabajo[] = trabajosToCheck.filter(isPresent);
    if (trabajos.length > 0) {
      const trabajoCollectionIdentifiers = trabajoCollection.map(trabajoItem => getTrabajoIdentifier(trabajoItem)!);
      const trabajosToAdd = trabajos.filter(trabajoItem => {
        const trabajoIdentifier = getTrabajoIdentifier(trabajoItem);
        if (trabajoIdentifier == null || trabajoCollectionIdentifiers.includes(trabajoIdentifier)) {
          return false;
        }
        trabajoCollectionIdentifiers.push(trabajoIdentifier);
        return true;
      });
      return [...trabajosToAdd, ...trabajoCollection];
    }
    return trabajoCollection;
  }
}
