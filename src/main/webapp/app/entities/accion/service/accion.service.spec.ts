import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAccion, Accion } from '../accion.model';

import { AccionService } from './accion.service';

describe('Service Tests', () => {
  describe('Accion Service', () => {
    let service: AccionService;
    let httpMock: HttpTestingController;
    let elemDefault: IAccion;
    let expectedResult: IAccion | IAccion[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(AccionService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        title: 'AAAAAAA',
        description: 'AAAAAAA',
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

      it('should create a Accion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Accion()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Accion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Accion', () => {
        const patchObject = Object.assign(
          {
            description: 'BBBBBB',
          },
          new Accion()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Accion', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should delete a Accion', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addAccionToCollectionIfMissing', () => {
        it('should add a Accion to an empty array', () => {
          const accion: IAccion = { id: 'ABC' };
          expectedResult = service.addAccionToCollectionIfMissing([], accion);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accion);
        });

        it('should not add a Accion to an array that contains it', () => {
          const accion: IAccion = { id: 'ABC' };
          const accionCollection: IAccion[] = [
            {
              ...accion,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addAccionToCollectionIfMissing(accionCollection, accion);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Accion to an array that doesn't contain it", () => {
          const accion: IAccion = { id: 'ABC' };
          const accionCollection: IAccion[] = [{ id: 'CBA' }];
          expectedResult = service.addAccionToCollectionIfMissing(accionCollection, accion);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accion);
        });

        it('should add only unique Accion to an array', () => {
          const accionArray: IAccion[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '786f8852-60fc-4714-9179-881cd375130f' }];
          const accionCollection: IAccion[] = [{ id: 'ABC' }];
          expectedResult = service.addAccionToCollectionIfMissing(accionCollection, ...accionArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const accion: IAccion = { id: 'ABC' };
          const accion2: IAccion = { id: 'CBA' };
          expectedResult = service.addAccionToCollectionIfMissing([], accion, accion2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(accion);
          expect(expectedResult).toContain(accion2);
        });

        it('should accept null and undefined values', () => {
          const accion: IAccion = { id: 'ABC' };
          expectedResult = service.addAccionToCollectionIfMissing([], null, accion, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(accion);
        });

        it('should return initial array if no Accion is added', () => {
          const accionCollection: IAccion[] = [{ id: 'ABC' }];
          expectedResult = service.addAccionToCollectionIfMissing(accionCollection, undefined, null);
          expect(expectedResult).toEqual(accionCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
