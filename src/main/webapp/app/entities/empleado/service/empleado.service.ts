import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as dayjs from 'dayjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEmpleado, getEmpleadoIdentifier } from '../empleado.model';

export type EntityResponseType = HttpResponse<IEmpleado>;
export type EntityArrayResponseType = HttpResponse<IEmpleado[]>;

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/empleados');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(empleado: IEmpleado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(empleado);
    return this.http
      .post<IEmpleado>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(empleado: IEmpleado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(empleado);
    return this.http
      .put<IEmpleado>(`${this.resourceUrl}/${getEmpleadoIdentifier(empleado) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(empleado: IEmpleado): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(empleado);
    return this.http
      .patch<IEmpleado>(`${this.resourceUrl}/${getEmpleadoIdentifier(empleado) as string}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IEmpleado>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IEmpleado[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEmpleadoToCollectionIfMissing(empleadoCollection: IEmpleado[], ...empleadosToCheck: (IEmpleado | null | undefined)[]): IEmpleado[] {
    const empleados: IEmpleado[] = empleadosToCheck.filter(isPresent);
    if (empleados.length > 0) {
      const empleadoCollectionIdentifiers = empleadoCollection.map(empleadoItem => getEmpleadoIdentifier(empleadoItem)!);
      const empleadosToAdd = empleados.filter(empleadoItem => {
        const empleadoIdentifier = getEmpleadoIdentifier(empleadoItem);
        if (empleadoIdentifier == null || empleadoCollectionIdentifiers.includes(empleadoIdentifier)) {
          return false;
        }
        empleadoCollectionIdentifiers.push(empleadoIdentifier);
        return true;
      });
      return [...empleadosToAdd, ...empleadoCollection];
    }
    return empleadoCollection;
  }

  protected convertDateFromClient(empleado: IEmpleado): IEmpleado {
    return Object.assign({}, empleado, {
      hireDate: empleado.hireDate?.isValid() ? empleado.hireDate.toJSON() : undefined,
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
      res.body.forEach((empleado: IEmpleado) => {
        empleado.hireDate = empleado.hireDate ? dayjs(empleado.hireDate) : undefined;
      });
    }
    return res;
  }
}
