import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISolicitante, getSolicitanteIdentifier } from '../solicitante.model';

export type EntityResponseType = HttpResponse<ISolicitante>;
export type EntityArrayResponseType = HttpResponse<ISolicitante[]>;

@Injectable({ providedIn: 'root' })
export class SolicitanteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/solicitantes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(solicitante: ISolicitante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(solicitante);
    return this.http
      .post<ISolicitante>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(solicitante: ISolicitante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(solicitante);
    return this.http
      .put<ISolicitante>(`${this.resourceUrl}/${getSolicitanteIdentifier(solicitante) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(solicitante: ISolicitante): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(solicitante);
    return this.http
      .patch<ISolicitante>(`${this.resourceUrl}/${getSolicitanteIdentifier(solicitante) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<ISolicitante>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<ISolicitante[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addSolicitanteToCollectionIfMissing(
    solicitanteCollection: ISolicitante[],
    ...solicitantesToCheck: (ISolicitante | null | undefined)[]
  ): ISolicitante[] {
    const solicitantes: ISolicitante[] = solicitantesToCheck.filter(isPresent);
    if (solicitantes.length > 0) {
      const solicitanteCollectionIdentifiers = solicitanteCollection.map(solicitanteItem => getSolicitanteIdentifier(solicitanteItem)!);
      const solicitantesToAdd = solicitantes.filter(solicitanteItem => {
        const solicitanteIdentifier = getSolicitanteIdentifier(solicitanteItem);
        if (solicitanteIdentifier == null || solicitanteCollectionIdentifiers.includes(solicitanteIdentifier)) {
          return false;
        }
        solicitanteCollectionIdentifiers.push(solicitanteIdentifier);
        return true;
      });
      return [...solicitantesToAdd, ...solicitanteCollection];
    }
    return solicitanteCollection;
  }

  protected convertDateFromClient(solicitante: ISolicitante): ISolicitante {
    return Object.assign({}, solicitante, {
      hireDate: solicitante.hireDate?.isValid() ? solicitante.hireDate.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.hireDate = res.body.hireDate ? dayjs(res.body.hireDate) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((solicitante: ISolicitante) => {
        solicitante.hireDate = solicitante.hireDate ? dayjs(solicitante.hireDate) : undefined;
      });
    }
    return res;
  }
}
