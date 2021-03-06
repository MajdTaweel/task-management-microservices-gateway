import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { ReleaseService } from 'app/entities/releaseService/release/release.service';
import { IRelease, Release } from 'app/shared/model/releaseService/release.model';
import { ReleaseStatus } from 'app/shared/model/enumerations/release-status.model';

describe('Service Tests', () => {
  describe('Release Service', () => {
    let injector: TestBed;
    let service: ReleaseService;
    let httpMock: HttpTestingController;
    let elemDefault: IRelease;
    let expectedResult: IRelease | IRelease[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(ReleaseService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Release('ID', 'AAAAAAA', 'AAAAAAA', ReleaseStatus.NEW, currentDate);
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            deadline: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('123').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Release', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            deadline: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.create(new Release()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Release', () => {
        const returnedFromService = Object.assign(
          {
            title: 'BBBBBB',
            type: 'BBBBBB',
            status: 'BBBBBB',
            deadline: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Release', () => {
        const returnedFromService = Object.assign(
          {
            title: 'BBBBBB',
            type: 'BBBBBB',
            status: 'BBBBBB',
            deadline: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            deadline: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Release', () => {
        service.delete('123').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
