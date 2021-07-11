import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IServicio, getServicioIdentifier } from '../servicio.model';

export type EntityResponseType = HttpResponse<IServicio>;
export type EntityArrayResponseType = HttpResponse<IServicio[]>;

@Injectable({ providedIn: 'root' })
export class ServicioService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/servicios');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(servicio: IServicio): Observable<EntityResponseType> {
    return this.http.post<IServicio>(this.resourceUrl, servicio, { observe: 'response' });
  }

  update(servicio: IServicio): Observable<EntityResponseType> {
    return this.http.put<IServicio>(`${this.resourceUrl}/${getServicioIdentifier(servicio) as string}`, servicio, { observe: 'response' });
  }

  partialUpdate(servicio: IServicio): Observable<EntityResponseType> {
    return this.http.patch<IServicio>(`${this.resourceUrl}/${getServicioIdentifier(servicio) as string}`, servicio, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IServicio>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IServicio[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addServicioToCollectionIfMissing(servicioCollection: IServicio[], ...serviciosToCheck: (IServicio | null | undefined)[]): IServicio[] {
    const servicios: IServicio[] = serviciosToCheck.filter(isPresent);
    if (servicios.length > 0) {
      const servicioCollectionIdentifiers = servicioCollection.map(servicioItem => getServicioIdentifier(servicioItem)!);
      const serviciosToAdd = servicios.filter(servicioItem => {
        const servicioIdentifier = getServicioIdentifier(servicioItem);
        if (servicioIdentifier == null || servicioCollectionIdentifiers.includes(servicioIdentifier)) {
          return false;
        }
        servicioCollectionIdentifiers.push(servicioIdentifier);
        return true;
      });
      return [...serviciosToAdd, ...servicioCollection];
    }
    return servicioCollection;
  }
}
