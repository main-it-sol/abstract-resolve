import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GridApi } from 'ag-grid-community';
import { BaseComponent } from '../components/base-component/base-component';
import { GRID_ACTIONS, MenuComponent } from '../components/menu-component/menu-component';
import { DashboardRow } from '../services/user.service';
import { TableSource } from '../table-source';

@Component({
  selector: 'app-home-page',
  imports: [BaseComponent, MenuComponent],
  template: `
    <h1>Home</h1>
    <app-menu-component [actions]="actions" [gridApi]="gridApi()" label="Home actions" />
    <app-base-component [source]="source" (ready)="gridApi.set($event)" />
  `,
})
export class HomePage {
  readonly source: TableSource<DashboardRow> = inject(ActivatedRoute).snapshot.data['tableSource'];
  readonly actions = GRID_ACTIONS;
  readonly gridApi = signal<GridApi<DashboardRow> | undefined>(undefined);
}
