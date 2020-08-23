import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared/util/request-util';
import { IRelease } from 'app/shared/model/releaseService/release.model';

type EntityResponseType = HttpResponse<IRelease>;
type EntityArrayResponseType = HttpResponse<IRelease[]>;

@Injectable({ providedIn: 'root' })
export class ReleaseService {
  public resourceUrl = SERVER_API_URL + 'services/releaseservice/api/releases';

  constructor(protected http: HttpClient) {}

  create(release: IRelease): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(release);
    return this.http
      .post<IRelease>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(release: IRelease): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(release);
    return this.http
      .put<IRelease>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http
      .get<IRelease>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IRelease[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  protected convertDateFromClient(release: IRelease): IRelease {
    const copy: IRelease = Object.assign({}, release, {
      deadline: release.deadline && release.deadline.isValid() ? release.deadline.toJSON() : undefined,
    });
    return copy;
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.deadline = res.body.deadline ? moment(res.body.deadline) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((release: IRelease) => {
        release.deadline = release.deadline ? moment(release.deadline) : undefined;
      });
    }
    return res;
  }
}
