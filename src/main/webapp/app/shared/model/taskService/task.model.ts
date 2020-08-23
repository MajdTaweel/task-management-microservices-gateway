import { Moment } from 'moment';
import { TaskStatus } from 'app/shared/model/enumerations/task-status.model';

export interface ITask {
  id?: string;
  title?: string;
  status?: TaskStatus;
  description?: string;
  deadline?: Moment;
  releaseId?: string;
  assignees?: Set<string>;
}

export class Task implements ITask {
  constructor(
    public id?: string,
    public title?: string,
    public status?: TaskStatus,
    public description?: string,
    public deadline?: Moment,
    public releaseId?: string,
    public assignees?: Set<string>
  ) {}
}
