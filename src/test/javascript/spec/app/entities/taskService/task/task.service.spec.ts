import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';
import { TaskService } from 'app/entities/taskService/task/task.service';
import { ITask, Task } from 'app/shared/model/taskService/task.model';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';

describe('Service Tests', () => {
  describe('Task Service', () => {
    let injector: TestBed;
    let service: TaskService;
    let httpMock: HttpTestingController;
    let elemDefault: ITask;
    let expectedResult: ITask | ITask[] | boolean | null;
    let currentDate: moment.Moment;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      injector = getTestBed();
      service = injector.get(TaskService);
      httpMock = injector.get(HttpTestingController);
      currentDate = moment();

      elemDefault = new Task('ID', 'AAAAAAA', TaskStatus.NEW, 'AAAAAAA', currentDate, 'AAAAAAA', new Set());
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

      it('should create a Task', () => {
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

        service.create(new Task()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Task', () => {
        const returnedFromService = Object.assign(
          {
            title: 'BBBBBB',
            status: 'BBBBBB',
            description: 'BBBBBB',
            deadline: currentDate.format(DATE_TIME_FORMAT),
            releaseId: 'BBBBBB',
            assignees: new Set(),
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

      it('should return a list of Task', () => {
        const returnedFromService = Object.assign(
          {
            title: 'BBBBBB',
            status: 'BBBBBB',
            description: 'BBBBBB',
            deadline: currentDate.format(DATE_TIME_FORMAT),
            releaseId: 'BBBBBB',
            assignees: new Set(),
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

      it('should delete a Task', () => {
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
