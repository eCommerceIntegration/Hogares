import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPais, Pais } from '../pais.model';

import { PaisService } from './pais.service';

describe('Service Tests', () => {
  describe('Pais Service', () => {
    let service: PaisService;
    let httpMock: HttpTestingController;
    let elemDefault: IPais;
    let expectedResult: IPais | IPais[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(PaisService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        paisName: 'AAAAAAA',
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

      it('should create a Pais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Pais()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Pais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            paisName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Pais', () => {
        const patchObject = Object.assign({}, new Pais());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Pais', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            paisName: 'BBBBBB',
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

      it('should delete a Pais', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addPaisToCollectionIfMissing', () => {
        it('should add a Pais to an empty array', () => {
          const pais: IPais = { id: 'ABC' };
          expectedResult = service.addPaisToCollectionIfMissing([], pais);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pais);
        });

        it('should not add a Pais to an array that contains it', () => {
          const pais: IPais = { id: 'ABC' };
          const paisCollection: IPais[] = [
            {
              ...pais,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addPaisToCollectionIfMissing(paisCollection, pais);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Pais to an array that doesn't contain it", () => {
          const pais: IPais = { id: 'ABC' };
          const paisCollection: IPais[] = [{ id: 'CBA' }];
          expectedResult = service.addPaisToCollectionIfMissing(paisCollection, pais);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pais);
        });

        it('should add only unique Pais to an array', () => {
          const paisArray: IPais[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: 'dd1f271a-90cf-452c-b46f-356c64dccb8b' }];
          const paisCollection: IPais[] = [{ id: 'ABC' }];
          expectedResult = service.addPaisToCollectionIfMissing(paisCollection, ...paisArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const pais: IPais = { id: 'ABC' };
          const pais2: IPais = { id: 'CBA' };
          expectedResult = service.addPaisToCollectionIfMissing([], pais, pais2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(pais);
          expect(expectedResult).toContain(pais2);
        });

        it('should accept null and undefined values', () => {
          const pais: IPais = { id: 'ABC' };
          expectedResult = service.addPaisToCollectionIfMissing([], null, pais, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(pais);
        });

        it('should return initial array if no Pais is added', () => {
          const paisCollection: IPais[] = [{ id: 'ABC' }];
          expectedResult = service.addPaisToCollectionIfMissing(paisCollection, undefined, null);
          expect(expectedResult).toEqual(paisCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
