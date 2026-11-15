import { TestBed } from '@angular/core/testing';
import { GridApi } from 'ag-grid-community';
import { GRID_ACTIONS, MenuAction, MenuComponent } from './menu-component';

describe('MenuComponent', () => {
  it('renders only supplied actions, disables them until ready, and dispatches them', () => {
    TestBed.configureTestingModule({ imports: [MenuComponent] });
    const fixture = TestBed.createComponent(MenuComponent);
    const api = jasmine.createSpyObj<GridApi>('GridApi', ['setFilterModel', 'onFilterChanged', 'exportDataAsCsv']);
    const exportUsers = jasmine.createSpy('exportUsers');
    const actions: MenuAction[] = [...GRID_ACTIONS, { label: 'Export users', icon: 'group', execute: exportUsers }];
    const buttons = (): HTMLButtonElement[] => Array.from(fixture.nativeElement.querySelectorAll('button'));
    const action = (label: string) => buttons().find(button => button.textContent?.includes(label))!;
    fixture.componentRef.setInput('actions', actions);
    fixture.detectChanges();
    expect(buttons().length).toBe(3);
    expect(buttons().every(button => button.disabled)).toBeTrue();
    action('Export users').click();
    expect(exportUsers).not.toHaveBeenCalled();

    fixture.componentRef.setInput('gridApi', api);
    fixture.detectChanges();
    expect(buttons().every(button => !button.disabled)).toBeTrue();
    action('Clear all filters').click();
    expect(api.setFilterModel).toHaveBeenCalledOnceWith(null);
    expect(api.onFilterChanged).toHaveBeenCalledTimes(1);
    action('Export to CSV').click();
    expect(api.exportDataAsCsv).toHaveBeenCalledWith();
    action('Export users').click();
    expect(exportUsers).toHaveBeenCalledOnceWith(api);

    fixture.componentRef.setInput('actions', GRID_ACTIONS);
    fixture.detectChanges();
    expect(buttons().length).toBe(2);
    expect(fixture.nativeElement.querySelector('mat-radio-group')).toBeNull();
    fixture.destroy();
  });
});
