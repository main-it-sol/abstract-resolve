import { TestBed } from '@angular/core/testing';
import { GridApi } from 'ag-grid-community';
import { ConcreteClassHome } from '../../concrete-home';
import { ConcreteClassUsers } from '../../concrete-users';
import { UserService } from '../../services/user.service';
import { MenuComponent } from './menu-component';

// Run: npm test -- --watch=false --browsers=ChromeHeadless --include=src/components/menu-component/menu-component.spec.ts
describe('MenuComponent', () => {
  it('disables actions until ready, dispatches to the active class, and replaces actions on navigation', () => {
    TestBed.configureTestingModule({ imports: [MenuComponent] });
    const fixture = TestBed.createComponent(MenuComponent);
    const users = new ConcreteClassUsers(new UserService());
    const home = new ConcreteClassHome(new UserService());
    const api = jasmine.createSpyObj<GridApi>('GridApi', [
      'setFilterModel', 'onFilterChanged', 'exportDataAsCsv',
    ]);
    const buttons = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('button'));
    const action = (label: string): HTMLButtonElement => buttons().find(button => button.textContent?.includes(label))!;
    const exportUsers = spyOn(users, 'exportUsers').and.callThrough();
    const exportHome = spyOn(home, 'exportToCsv').and.callThrough();

    fixture.componentRef.setInput('concreteClass', users);
    fixture.detectChanges();
    expect(buttons().length).toBe(3);
    expect(buttons().every(button => button.disabled)).toBeTrue();
    action('Export users').click();
    expect(exportUsers).not.toHaveBeenCalled();

    fixture.componentRef.setInput('gridApi', api);
    fixture.detectChanges();
    expect(buttons().every(button => !button.disabled)).toBeTrue();
    expect(fixture.nativeElement.querySelectorAll('mat-icon').length).toBe(3);
    action('Clear all filters').click();
    expect(api.setFilterModel).toHaveBeenCalledOnceWith(null);
    expect(api.onFilterChanged).toHaveBeenCalledTimes(1);
    action('Export to CSV').click();
    expect(api.exportDataAsCsv).toHaveBeenCalledWith();
    action('Export users').click();
    expect(exportUsers).toHaveBeenCalledOnceWith(api);
    expect(api.exportDataAsCsv).toHaveBeenCalledWith({ fileName: 'users.csv', allColumns: true });

    fixture.componentRef.setInput('concreteClass', home);
    fixture.detectChanges();
    expect(buttons().length).toBe(2);
    expect(buttons().some(button => button.textContent?.includes('Export users'))).toBeFalse();
    action('Export to CSV').click();
    expect(exportHome).toHaveBeenCalledOnceWith(api);
    expect(exportUsers).toHaveBeenCalledTimes(1);
    fixture.destroy();
  });
});
