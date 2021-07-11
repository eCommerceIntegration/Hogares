import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { Language } from 'app/entities/enumerations/language.model';
import { IHogar, Hogar } from '../hogar.model';

import { HogarService } from './hogar.service';

describe('Service Tests', () => {
  describe('Hogar Service', () => {
    let service: HogarService;
    let httpMock: HttpTestingController;
    let elemDefault: IHogar;
    let expectedResult: IHogar | IHogar[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(HogarService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        hogarName: 'AAAAAAA',
        language: Language.PORTUGUES,
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

      it('should create a Hogar', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Hogar()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Hogar', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            hogarName: 'BBBBBB',
            language: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Hogar', () => {
        const patchObject = Object.assign(
          {
            hogarName: 'BBBBBB',
            language: 'BBBBBB',
          },
          new Hogar()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Hogar', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            hogarName: 'BBBBBB',
            language: 'BBBBBB',
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

      it('should delete a Hogar', () => {
        service.delete('ABC').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addHogarToCollectionIfMissing', () => {
        it('should add a Hogar to an empty array', () => {
          const hogar: IHogar = { id: 'ABC' };
          expectedResult = service.addHogarToCollectionIfMissing([], hogar);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(hogar);
        });

        it('should not add a Hogar to an array that contains it', () => {
          const hogar: IHogar = { id: 'ABC' };
          const hogarCollection: IHogar[] = [
            {
              ...hogar,
            },
            { id: 'CBA' },
          ];
          expectedResult = service.addHogarToCollectionIfMissing(hogarCollection, hogar);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Hogar to an array that doesn't contain it", () => {
          const hogar: IHogar = { id: 'ABC' };
          const hogarCollection: IHogar[] = [{ id: 'CBA' }];
          expectedResult = service.addHogarToCollectionIfMissing(hogarCollection, hogar);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(hogar);
        });

        it('should add only unique Hogar to an array', () => {
          const hogarArray: IHogar[] = [{ id: 'ABC' }, { id: 'CBA' }, { id: '5a074a6b-29bd-4ea3-b4e5-d3d297e97c10' }];
          const hogarCollection: IHogar[] = [{ id: 'ABC' }];
          expectedResult = service.addHogarToCollectionIfMissing(hogarCollection, ...hogarArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const hogar: IHogar = { id: 'ABC' };
          const hogar2: IHogar = { id: 'CBA' };
          expectedResult = service.addHogarToCollectionIfMissing([], hogar, hogar2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(hogar);
          expect(expectedResult).toContain(hogar2);
        });

        it('should accept null and undefined values', () => {
          const hogar: IHogar = { id: 'ABC' };
          expectedResult = service.addHogarToCollectionIfMissing([], null, hogar, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(hogar);
        });

        it('should return initial array if no Hogar is added', () => {
          const hogarCollection: IHogar[] = [{ id: 'ABC' }];
          expectedResult = service.addHogarToCollectionIfMissing(hogarCollection, undefined, null);
          expect(expectedResult).toEqual(hogarCollection);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
