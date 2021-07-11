import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITrabajo, Trabajo } from '../trabajo.model';

import { TrabajoService } from './trabajo.service';

describe('Service Tests', () => {
  describe('Trabajo Service', () => {
    let service: TrabajoService;
    let httpMock: HttpTestingController;
    let elemDefault: ITrabajo;
    let expectedResult: ITrabajo | ITrabajo[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TrabajoService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        trabajoTitle: 'AAAAAAA',
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

      it('should create a Trabajo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Trabajo()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Trabajo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            trabajoTitle: 'BBBBBB',
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

      it('should partial update a Trabajo', () => {
        const patchObject = Object.assign(
          {
            trabajoTitle: 'BBBBBB',
            minSalary: 1,
            maxSalary: 1,
          },
          new Trabajo()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Trabajo', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            trabajoTitle: 'BBBBBB',
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

      it('should delete a Trabajo', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTrabajoToCollectionIfMissing', () => {
        it('should add a Trabajo to an empty array', () => {
          const trabajo: ITrabajo = { id: 'ABC' };
          expectedResult = service.addTrabajoToCollectionIfMissing([], trabajo);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(trabajo);
        });

        it('should not add a Trabajo to an array that contains it', () => {
          const trabajo: ITrabajo = { id: 'ABC' };
          const trabajoCollection: ITrabajo[] = [
            {
              ...trabajo,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addTrabajoToCollectionIfMissing(trabajoCollection, trabajo);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Trabajo to an array that doesn't contain it", () => {
          const trabajo: ITrabajo = { id: 'ABC' };
          const trabajoCollection: ITrabajo[] = [{ id: 'CBA' }];
          expectedResult = service.addTrabajoToCollectionIfMissing(trabajoCollection, trabajo);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(trabajo);
        });

        it('should add only unique Trabajo to an array', () => {
          const trabajoArray: ITrabajo[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '167a783f-f8e3-4590-ac9a-2954c0877ac0' }];
          const trabajoCollection: ITrabajo[] = [{ id: 'ABC' }];
          expectedResult = service.addTrabajoToCollectionIfMissing(trabajoCollection, ...trabajoArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const trabajo: ITrabajo = { id: 'ABC' };
          const trabajo2: ITrabajo = { id: 'CBA' };
          expectedResult = service.addTrabajoToCollectionIfMissing([], trabajo, trabajo2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(trabajo);
          expect(expectedResult).toContain(trabajo2);
        });

        it('should accept null and undefined values', () => {
          const trabajo: ITrabajo = { id: 'ABC' };
          expectedResult = service.addTrabajoToCollectionIfMissing([], null, trabajo, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(trabajo);
        });

        it('should return initial array if no Trabajo is added', () => {
          const trabajoCollection: ITrabajo[] = [{ id: 'ABC' }];
          expectedResult = service.addTrabajoToCollectionIfMissing(trabajoCollection, undefined, null);
          expect(expectedResult).toEqual(trabajoCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
