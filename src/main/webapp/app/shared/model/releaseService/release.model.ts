import { Moment } from 'moment';
import { ReleaseStatus } from 'app/shared/model/enumerations/release-status.model';

export interface IRelease {
  id?: string;
  title?: string;
  type?: string;
  status?: ReleaseStatus;
  deadline?: Moment;
}

export class Release implements IRelease {
  constructor(public id?: string, public title?: string, public type?: string, public status?: ReleaseStatus, public deadline?: Moment) {}
}
