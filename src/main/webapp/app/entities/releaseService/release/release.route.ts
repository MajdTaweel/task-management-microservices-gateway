import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { flatMap } from 'rxjs/operators';

import { Authority } from 'app/shared/constants/authority.constants';
import { UserRouteAccessService } from 'app/core/auth/user-route-access-service';
import { IRelease, Release } from 'app/shared/model/releaseService/release.model';
import { ReleaseService } from './release.service';
import { ReleaseComponent } from './release.component';
import { ReleaseDetailComponent } from './release-detail.component';
import { ReleaseUpdateComponent } from './release-update.component';

@Injectable({ providedIn: 'root' })
export class ReleaseResolve implements Resolve<IRelease> {
  constructor(private service: ReleaseService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IRelease> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        flatMap((release: HttpResponse<Release>) => {
          if (release.body) {
            return of(release.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Release());
  }
}

export const releaseRoute: Routes = [
  {
    path: '',
    component: ReleaseComponent,
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Releases',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ReleaseDetailComponent,
    resolve: {
      release: ReleaseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Releases',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ReleaseUpdateComponent,
    resolve: {
      release: ReleaseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Releases',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ReleaseUpdateComponent,
    resolve: {
      release: ReleaseResolve,
    },
    data: {
      authorities: [Authority.USER],
      pageTitle: 'Releases',
    },
    canActivate: [UserRouteAccessService],
  },
];
