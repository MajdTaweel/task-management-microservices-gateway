import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpHeaders, HttpResponse } from '@angular/common/http';

import { GatewayTestModule } from '../../../../test.module';
import { ReleaseComponent } from 'app/entities/releaseService/release/release.component';
import { ReleaseService } from 'app/entities/releaseService/release/release.service';
import { Release } from 'app/shared/model/releaseService/release.model';

describe('Component Tests', () => {
  describe('Release Management Component', () => {
    let comp: ReleaseComponent;
    let fixture: ComponentFixture<ReleaseComponent>;
    let service: ReleaseService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [GatewayTestModule],
        declarations: [ReleaseComponent],
      })
        .overrideTemplate(ReleaseComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReleaseComponent);
      comp = fixture.componentInstance;
      service = fixture.debugElement.injector.get(ReleaseService);
    });

    it('Should call load all on init', () => {
      // GIVEN
      const headers = new HttpHeaders().append('link', 'link;link');
      spyOn(service, 'query').and.returnValue(
        of(
          new HttpResponse({
            body: [new Release('123')],
            headers,
          })
        )
      );

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.releases && comp.releases[0]).toEqual(jasmine.objectContaining({ id: '123' }));
    });
  });
});
