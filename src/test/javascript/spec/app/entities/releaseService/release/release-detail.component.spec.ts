import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GatewayTestModule } from '../../../../test.module';
import { ReleaseDetailComponent } from 'app/entities/releaseService/release/release-detail.component';
import { Release } from 'app/shared/model/releaseService/release.model';

describe('Component Tests', () => {
  describe('Release Management Detail Component', () => {
    let comp: ReleaseDetailComponent;
    let fixture: ComponentFixture<ReleaseDetailComponent>;
    const route = ({ data: of({ release: new Release('123') }) } as any) as ActivatedRoute;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [ReleaseDetailComponent],
        providers: [{ provide: ActivatedRoute, useValue: route }],
      })
        .overrideTemplate(ReleaseDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ReleaseDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load release on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.release).toEqual(jasmine.objectContaining({ id: '123' }));
      });
    });
  });
});
