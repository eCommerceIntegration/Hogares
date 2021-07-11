import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { ISolicitante, Solicitante } from '../solicitante.model';

import { SolicitanteService } from './solicitante.service';

describe('Service Tests', () => {
  describe('Solicitante Service', () => {
    let service: SolicitanteService;
    let httpMock: HttpTestingController;
    let elemDefault: ISolicitante;
    let expectedResult: ISolicitante | ISolicitante[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(SolicitanteService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        email: 'AAAAAAA',
        phoneNumber: 'AAAAAAA',
        hireDate: currentDate,
        salary: 0,
        commissionPct: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Solicitante', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Solicitante()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Solicitante', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Solicitante', () => {
        const patchObject = Object.assign(
          {
            firstName: 'BBBBBB',
            email: 'BBBBBB',
            salary: 1,
            commissionPct: 1,
          },
          new Solicitante()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Solicitante', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Solicitante', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addSolicitanteToCollectionIfMissing', () => {
        it('should add a Solicitante to an empty array', () => {
          const solicitante: ISolicitante = { id: 'ABC' };
          expectedResult = service.addSolicitanteToCollectionIfMissing([], solicitante);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(solicitante);
        });

        it('should not add a Solicitante to an array that contains it', () => {
          const solicitante: ISolicitante = { id: 'ABC' };
          const solicitanteCollection: ISolicitante[] = [
            {
              ...solicitante,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addSolicitanteToCollectionIfMissing(solicitanteCollection, solicitante);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Solicitante to an array that doesn't contain it", () => {
          const solicitante: ISolicitante = { id: 'ABC' };
          const solicitanteCollection: ISolicitante[] = [{ id: 'CBA' }];
          expectedResult = service.addSolicitanteToCollectionIfMissing(solicitanteCollection, solicitante);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(solicitante);
        });

        it('should add only unique Solicitante to an array', () => {
          const solicitanteArray: ISolicitante[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '774e3d8e-4dea-43d7-a0ec-da935f952f89' }];
          const solicitanteCollection: ISolicitante[] = [{ id: 'ABC' }];
          expectedResult = service.addSolicitanteToCollectionIfMissing(solicitanteCollection, ...solicitanteArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const solicitante: ISolicitante = { id: 'ABC' };
          const solicitante2: ISolicitante = { id: 'CBA' };
          expectedResult = service.addSolicitanteToCollectionIfMissing([], solicitante, solicitante2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(solicitante);
          expect(expectedResult).toContain(solicitante2);
        });

        it('should accept null and undefined values', () => {
          const solicitante: ISolicitante = { id: 'ABC' };
          expectedResult = service.addSolicitanteToCollectionIfMissing([], null, solicitante, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(solicitante);
        });

        it('should return initial array if no Solicitante is added', () => {
          const solicitanteCollection: ISolicitante[] = [{ id: 'ABC' }];
          expectedResult = service.addSolicitanteToCollectionIfMissing(solicitanteCollection, undefined, null);
          expect(expectedResult).toEqual(solicitanteCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
