import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IServicio, Servicio } from '../servicio.model';

import { ServicioService } from './servicio.service';

describe('Service Tests', () => {
  describe('Servicio Service', () => {
    let service: ServicioService;
    let httpMock: HttpTestingController;
    let elemDefault: IServicio;
    let expectedResult: IServicio | IServicio[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(ServicioService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        servicioTitle: 'AAAAAAA',
        minSalary: 0,
        maxSalary: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('ABC').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Servicio()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            servicioTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Servicio', () => {
        const patchObject = Object.assign(
          {
            servicioTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
          },
          new Servicio()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Servicio', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            servicioTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Servicio', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addServicioToCollectionIfMissing', () => {
        it('should add a Servicio to an empty array', () => {
          const servicio: IServicio = { id: 'ABC' };
          expectedResult = service.addServicioToCollectionIfMissing([], servicio);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(servicio);
        });

        it('should not add a Servicio to an array that contains it', () => {
          const servicio: IServicio = { id: 'ABC' };
          const servicioCollection: IServicio[] = [
            {
              ...servicio,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Servicio to an array that doesn't contain it", () => {
          const servicio: IServicio = { id: 'ABC' };
          const servicioCollection: IServicio[] = [{ id: 'CBA' }];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, servicio);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(servicio);
        });

        it('should add only unique Servicio to an array', () => {
          const servicioArray: IServicio[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'f9208c0b-6492-462b-9da2-cf5e5d72869a' }];
          const servicioCollection: IServicio[] = [{ id: 'ABC' }];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, ...servicioArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const servicio: IServicio = { id: 'ABC' };
          const servicio2: IServicio = { id: 'CBA' };
          expectedResult = service.addServicioToCollectionIfMissing([], servicio, servicio2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(servicio);
          expect(expectedResult).toContain(servicio2);
        });

        it('should accept null and undefined values', () => {
          const servicio: IServicio = { id: 'ABC' };
          expectedResult = service.addServicioToCollectionIfMissing([], null, servicio, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(servicio);
        });

        it('should return initial array if no Servicio is added', () => {
          const servicioCollection: IServicio[] = [{ id: 'ABC' }];
          expectedResult = service.addServicioToCollectionIfMissing(servicioCollection, undefined, null);
          expect(expectedResult).toEqual(servicioCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
