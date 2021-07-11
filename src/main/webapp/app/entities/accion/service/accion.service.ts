import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAccion, getAccionIdentifier } from '../accion.model';

export type EntityResponseType = HttpResponse<IAccion>;
export type EntityArrayResponseType = HttpResponse<IAccion[]>;

@Injectable({ providedIn: 'root' })
export class AccionService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/accions');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(accion: IAccion): Observable<EntityResponseType> {
    return this.http.post<IAccion>(this.resourceUrl, accion, { observe: 'response' });
  }

  update(accion: IAccion): Observable<EntityResponseType> {
    return this.http.put<IAccion>(`${this.resourceUrl}/${getAccionIdentifier(accion) as string}`, accion, { observe: 'response' });
  }

  partialUpdate(accion: IAccion): Observable<EntityResponseType> {
    return this.http.patch<IAccion>(`${this.resourceUrl}/${getAccionIdentifier(accion) as string}`, accion, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IAccion>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAccion[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAccionToCollectionIfMissing(accionCollection: IAccion[], ...accionsToCheck: (IAccion | null | undefined)[]): IAccion[] {
    const accions: IAccion[] = accionsToCheck.filter(isPresent);
    if (accions.length > 0) {
      const accionCollectionIdentifiers = accionCollection.map(accionItem => getAccionIdentifier(accionItem)!);
      const accionsToAdd = accions.filter(accionItem => {
        const accionIdentifier = getAccionIdentifier(accionItem);
        if (accionIdentifier == null || accionCollectionIdentifiers.includes(accionIdentifier)) {
          return false;
        }
        accionCollectionIdentifiers.push(accionIdentifier);
        return true;
      });
      return [...accionsToAdd, ...accionCollection];
    }
    return accionCollection;
  }
}
