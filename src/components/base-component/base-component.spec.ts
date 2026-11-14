import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { ConcreteClassUsers } from '../../concrete-users';
import { UserService } from '../../services/user.service';
import { BaseComponent } from './base-component';

// Run: npm test -- --watch=false --browsers=ChromeHeadless --include=src/components/base-component/base-component.spec.ts
describe('BaseComponent async loading', () => {
  let component: BaseComponent;
  let fixture: ComponentFixture<BaseComponent>;
  let response: Subject<any[]>;
  let getData: jasmine.Spy;
  let api: jasmine.SpyObj<GridApi>;

  beforeEach(async () => {
    response = new Subject<any[]>();
    const users = new ConcreteClassUsers(new UserService());
    getData = spyOn(users, 'getData').and.returnValue(response);
    api = jasmine.createSpyObj<GridApi>('GridApi', ['sizeColumnsToFit']);
    await TestBed.configureTestingModule({
      imports: [BaseComponent],
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: { concreteClass: users } } } }],
    })
      .overrideComponent(BaseComponent, { set: { template: '<div id="agGrid"></div>' } })
      .compileComponents();
    fixture = TestBed.createComponent(BaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('shows loading while pending and hides it when rows arrive', () => {
    component.onGridReady({ api });
    expect(component.loading()).toBeTrue();
    expect(component.rowData).toEqual([]);
    expect(getData).toHaveBeenCalledOnceWith({ api });

    const rows = [{ userName: 'Alice' }];
    response.next(rows);
    expect(component.rowData).toEqual(rows);
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).toBe('');
    expect(api.sizeColumnsToFit).toHaveBeenCalledTimes(1);
    expect(response.observed).toBeFalse();
  });

  it('hides loading and exposes a safe message on backend errors', () => {
    component.onGridReady({ api });
    response.error(new Error('Private server details'));
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).toBe('Unable to load data. Please try again.');
    expect(component.rowData).toEqual([]);
  });

  it('also clears loading if getData throws or completes without rows', () => {
    getData.and.throwError('Request setup failed');
    component.onGridReady({ api });
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).not.toBe('');

    getData.and.returnValue(response);
    component.onGridReady({ api });
    expect(component.errorMessage()).toBe('');
    expect(component.loading()).toBeTrue();
    response.complete();
    expect(component.loading()).toBeFalse();
  });

  it('cancels a pending subscription when leaving the page', () => {
    component.onGridReady({ api });
    expect(response.observed).toBeTrue();
    fixture.destroy();
    expect(response.observed).toBeFalse();
    expect(component.loading()).toBeFalse();
    response.next([{ userName: 'Late response' }]);
    expect(component.rowData).toEqual([]);
    expect(api.sizeColumnsToFit).not.toHaveBeenCalled();
  });
});
