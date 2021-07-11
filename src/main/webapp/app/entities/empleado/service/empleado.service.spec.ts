import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmpleado, Empleado } from '../empleado.model';

import { EmpleadoService } from './empleado.service';

describe('Service Tests', () => {
  describe('Empleado Service', () => {
    let service: EmpleadoService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmpleado;
    let expectedResult: IEmpleado | IEmpleado[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmpleadoService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        empleadoId: 'AAAAAAA',
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

      it('should create a Empleado', () => {
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

        service.create(new Empleado()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Empleado', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            empleadoId: 'BBBBBB',
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

      it('should partial update a Empleado', () => {
        const patchObject = Object.assign(
          {
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
          },
          new Empleado()
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

      it('should return a list of Empleado', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            empleadoId: 'BBBBBB',
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

      it('should delete a Empleado', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmpleadoToCollectionIfMissing', () => {
        it('should add a Empleado to an empty array', () => {
          const empleado: IEmpleado = { id: 'ABC' };
          expectedResult = service.addEmpleadoToCollectionIfMissing([], empleado);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(empleado);
        });

        it('should not add a Empleado to an array that contains it', () => {
          const empleado: IEmpleado = { id: 'ABC' };
          const empleadoCollection: IEmpleado[] = [
            {
              ...empleado,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addEmpleadoToCollectionIfMissing(empleadoCollection, empleado);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Empleado to an array that doesn't contain it", () => {
          const empleado: IEmpleado = { id: 'ABC' };
          const empleadoCollection: IEmpleado[] = [{ id: 'CBA' }];
          expectedResult = service.addEmpleadoToCollectionIfMissing(empleadoCollection, empleado);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(empleado);
        });

        it('should add only unique Empleado to an array', () => {
          const empleadoArray: IEmpleado[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '70a933f8-c029-4eed-aa91-78eb64d84af7' }];
          const empleadoCollection: IEmpleado[] = [{ id: 'ABC' }];
          expectedResult = service.addEmpleadoToCollectionIfMissing(empleadoCollection, ...empleadoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const empleado: IEmpleado = { id: 'ABC' };
          const empleado2: IEmpleado = { id: 'CBA' };
          expectedResult = service.addEmpleadoToCollectionIfMissing([], empleado, empleado2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(empleado);
          expect(expectedResult).toContain(empleado2);
        });

        it('should accept null and undefined values', () => {
          const empleado: IEmpleado = { id: 'ABC' };
          expectedResult = service.addEmpleadoToCollectionIfMissing([], null, empleado, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(empleado);
        });

        it('should return initial array if no Empleado is added', () => {
          const empleadoCollection: IEmpleado[] = [{ id: 'ABC' }];
          expectedResult = service.addEmpleadoToCollectionIfMissing(empleadoCollection, undefined, null);
          expect(expectedResult).toEqual(empleadoCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
