import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { DATE_TIME_FORMAT } from 'app/shared/constants/input.constants';

import { IRelease, Release } from 'app/shared/model/releaseService/release.model';
import { ReleaseService } from './release.service';

@Component({
  selector: 'jhi-release-update',
  templateUrl: './release-update.component.html',
})
export class ReleaseUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
    title: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
    type: [null, [Validators.required]],
    status: [null, [Validators.required]],
    deadline: [],
    tasks: [],
  });

  constructor(protected releaseService: ReleaseService, protected activatedRoute: ActivatedRoute, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ release }) => {
      if (!release.id) {
        const today = moment().startOf('day');
        release.deadline = today;
      }

      this.updateForm(release);
    });
  }

  updateForm(release: IRelease): void {
    this.editForm.patchValue({
      id: release.id,
      title: release.title,
      type: release.type,
      status: release.status,
      deadline: release.deadline ? release.deadline.format(DATE_TIME_FORMAT) : null,
      tasks: release.tasks,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const release = this.createFromForm();
    if (release.id !== undefined) {
      this.subscribeToSaveResponse(this.releaseService.update(release));
    } else {
      this.subscribeToSaveResponse(this.releaseService.create(release));
    }
  }

  private createFromForm(): IRelease {
    return {
      ...new Release(),
      id: this.editForm.get(['id'])!.value,
      title: this.editForm.get(['title'])!.value,
      type: this.editForm.get(['type'])!.value,
      status: this.editForm.get(['status'])!.value,
      deadline: this.editForm.get(['deadline'])!.value ? moment(this.editForm.get(['deadline'])!.value, DATE_TIME_FORMAT) : undefined,
      tasks: this.editForm.get(['tasks'])!.value,
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRelease>>): void {
    result.subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError(): void {
    this.isSaving = false;
  }
}
