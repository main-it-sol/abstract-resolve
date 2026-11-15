import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GridApi } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { TableSource } from '../../table-source';
import { BaseComponent } from './base-component';

type Row = { name: string };

describe('BaseComponent async loading', () => {
  let component: BaseComponent<Row>;
  let fixture: ComponentFixture<BaseComponent<Row>>;
  let response: Subject<Row[]>;
  let source: TableSource<Row>;
  let loadRows: jasmine.Spy;
  let api: jasmine.SpyObj<GridApi<Row>>;
  const ready = () => component.onGridReady({ api, context: undefined, type: 'gridReady' });

  beforeEach(async () => {
    response = new Subject<Row[]>();
    loadRows = jasmine.createSpy('loadRows').and.returnValue(response);
    source = { columns: [{ field: 'name' }], rowStyle: { background: '#fff' }, loadRows };
    api = jasmine.createSpyObj<GridApi<Row>>('GridApi', ['sizeColumnsToFit']);
    await TestBed.configureTestingModule({ imports: [BaseComponent] })
      .overrideComponent(BaseComponent, { set: { template: '' } })
      .compileComponents();
    fixture = TestBed.createComponent(BaseComponent<Row>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('source', source);
    fixture.detectChanges();
  });

  it('loads through only the table contract and emits the grid API', () => {
    const emitted = jasmine.createSpy('ready');
    component.ready.subscribe(emitted);
    ready();
    expect(emitted).toHaveBeenCalledOnceWith(api);
    expect(component.loading()).toBeTrue();
    expect(component.rowData()).toEqual([]);
    expect(loadRows).toHaveBeenCalledOnceWith();

    const rows = [{ name: 'Alice' }];
    response.next(rows);
    expect(component.rowData()).toEqual(rows);
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).toBe('');
    expect(api.sizeColumnsToFit).toHaveBeenCalledTimes(1);
    expect(response.observed).toBeFalse();
  });

  it('handles errors safely and retries without exposing server details', () => {
    ready();
    response.error(new Error('Private server details'));
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).toBe('Unable to load data. Please try again.');
    expect(component.rowData()).toEqual([]);

    response = new Subject<Row[]>();
    loadRows.and.returnValue(response);
    component.reload();
    expect(component.errorMessage()).toBe('');
    expect(component.loading()).toBeTrue();
    response.next([{ name: 'Recovered' }]);
    expect(component.rowData()).toEqual([{ name: 'Recovered' }]);
  });

  it('clears loading if setup throws or the response completes without rows', () => {
    loadRows.and.throwError('Request setup failed');
    ready();
    expect(component.loading()).toBeFalse();
    expect(component.errorMessage()).not.toBe('');
    loadRows.and.returnValue(response);
    component.reload();
    expect(component.loading()).toBeTrue();
    response.complete();
    expect(component.loading()).toBeFalse();
  });

  it('cancels superseded and destroyed requests so late rows cannot overwrite data', () => {
    ready();
    const oldResponse = response;
    response = new Subject<Row[]>();
    loadRows.and.returnValue(response);
    component.reload();
    expect(oldResponse.observed).toBeFalse();
    oldResponse.next([{ name: 'Stale' }]);
    expect(component.rowData()).toEqual([]);
    expect(response.observed).toBeTrue();
    fixture.destroy();
    expect(response.observed).toBeFalse();
    expect(component.loading()).toBeFalse();
    response.next([{ name: 'Late' }]);
    expect(api.sizeColumnsToFit).not.toHaveBeenCalled();
  });

  it('owns grid defaults and keeps a usable height on resize', () => {
    expect(component.defaultColDef.floatingFilter).toBeTrue();
    expect(component.defaultColDef.filter).toBeTrue();
    ready();
    component.onWindowResize();
    expect(component.gridHeight()).toBe(Math.max(200, window.innerHeight - 240));
    expect(api.sizeColumnsToFit).toHaveBeenCalled();
  });
});
