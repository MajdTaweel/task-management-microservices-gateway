import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'release',
        loadChildren: () => import('./releaseService/release/release.module').then(m => m.ReleaseServiceReleaseModule),
      },
      {
        path: 'task',
        loadChildren: () => import('./taskService/task/task.module').then(m => m.TaskServiceTaskModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class GatewayEntityModule {}
