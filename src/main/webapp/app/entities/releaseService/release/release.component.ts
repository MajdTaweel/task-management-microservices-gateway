import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { JhiEventManager } from 'ng-jhipster';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IRelease } from 'app/shared/model/releaseService/release.model';
import { ReleaseService } from './release.service';
import { ReleaseDeleteDialogComponent } from './release-delete-dialog.component';

@Component({
  selector: 'jhi-release',
  templateUrl: './release.component.html',
})
export class ReleaseComponent implements OnInit, OnDestroy {
  releases?: IRelease[];
  eventSubscriber?: Subscription;

  constructor(protected releaseService: ReleaseService, protected eventManager: JhiEventManager, protected modalService: NgbModal) {}

  loadAll(): void {
    this.releaseService.query().subscribe((res: HttpResponse<IRelease[]>) => (this.releases = res.body || []));
  }

  ngOnInit(): void {
    this.loadAll();
    this.registerChangeInReleases();
  }

  ngOnDestroy(): void {
    if (this.eventSubscriber) {
      this.eventManager.destroy(this.eventSubscriber);
    }
  }

  trackId(index: number, item: IRelease): string {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    return item.id!;
  }

  registerChangeInReleases(): void {
    this.eventSubscriber = this.eventManager.subscribe('releaseListModification', () => this.loadAll());
  }

  delete(release: IRelease): void {
    const modalRef = this.modalService.open(ReleaseDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.release = release;
  }
}
