import { Component, DestroyRef, HostListener, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defer, finalize, Subscription, take } from 'rxjs';
import { AgGridAngular } from 'ag-grid-angular';
import { AllCommunityModule, ColDef, GridApi, GridReadyEvent, ModuleRegistry } from 'ag-grid-community';
import { TableSource } from '../../table-source';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-base-component',
  imports: [AgGridAngular],
  templateUrl: './base-component.html',
})
export class BaseComponent<T> {
  readonly source = input.required<TableSource<T>>();
  readonly ready = output<GridApi<T>>();
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly rowData = signal<T[]>([]);
  readonly gridHeight = signal(Math.max(200, window.innerHeight - 240));
  readonly defaultColDef: ColDef<T> = {
    flex: 1,
    minWidth: 150,
    filter: true,
    filterParams: { buttons: ['apply', 'reset'], closeOnApply: true },
    floatingFilter: true,
    menuTabs: ['filterMenuTab'],
  };
  gridApi?: GridApi<T>;
  private readonly destroyRef = inject(DestroyRef);
  private request?: Subscription;

  @HostListener('window:resize')
  onWindowResize(): void {
    this.gridHeight.set(Math.max(200, window.innerHeight - 240));
    this.gridApi?.sizeColumnsToFit();
  }

  onGridReady(event: GridReadyEvent<T>): void {
    this.gridApi = event.api;
    this.reload();
    this.ready.emit(event.api);
  }

  reload(): void {
    if (!this.gridApi) return;
    this.request?.unsubscribe();
    this.loading.set(true);
    this.errorMessage.set('');
    this.request = defer(() => this.source().loadRows()).pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: rows => {
        this.rowData.set(rows);
        this.gridApi?.sizeColumnsToFit();
      },
      error: () => this.errorMessage.set('Unable to load data. Please try again.'),
    });
  }
}
