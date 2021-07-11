import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IHogar, getHogarIdentifier } from '../hogar.model';

export type EntityResponseType = HttpResponse<IHogar>;
export type EntityArrayResponseType = HttpResponse<IHogar[]>;

@Injectable({ providedIn: 'root' })
export class HogarService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/hogars');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(hogar: IHogar): Observable<EntityResponseType> {
    return this.http.post<IHogar>(this.resourceUrl, hogar, { observe: 'response' });
  }

  update(hogar: IHogar): Observable<EntityResponseType> {
    return this.http.put<IHogar>(`${this.resourceUrl}/${getHogarIdentifier(hogar) as string}`, hogar, { observe: 'response' });
  }

  partialUpdate(hogar: IHogar): Observable<EntityResponseType> {
    return this.http.patch<IHogar>(`${this.resourceUrl}/${getHogarIdentifier(hogar) as string}`, hogar, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IHogar>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IHogar[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addHogarToCollectionIfMissing(hogarCollection: IHogar[], ...hogarsToCheck: (IHogar | null | undefined)[]): IHogar[] {
    const hogars: IHogar[] = hogarsToCheck.filter(isPresent);
    if (hogars.length > 0) {
      const hogarCollectionIdentifiers = hogarCollection.map(hogarItem => getHogarIdentifier(hogarItem)!);
      const hogarsToAdd = hogars.filter(hogarItem => {
        const hogarIdentifier = getHogarIdentifier(hogarItem);
        if (hogarIdentifier == null || hogarCollectionIdentifiers.includes(hogarIdentifier)) {
          return false;
        }
        hogarCollectionIdentifiers.push(hogarIdentifier);
        return true;
      });
      return [...hogarsToAdd, ...hogarCollection];
    }
    return hogarCollection;
  }
}
