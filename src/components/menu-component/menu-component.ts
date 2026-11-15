import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridApi } from 'ag-grid-community';

export interface MenuAction {
  label: string;
  icon: string;
  execute: (api: GridApi) => void;
}

export const GRID_ACTIONS: MenuAction[] = [
  {
    label: 'Clear all filters', icon: 'filter_alt_off',
    execute: api => { api.setFilterModel(null); api.onFilterChanged(); },
  },
  { label: 'Export to CSV', icon: 'download', execute: api => api.exportDataAsCsv() },
];

@Component({
  selector: 'app-menu-component',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @let api = gridApi();
    <div class="menu" role="group" [attr.aria-label]="label()">
      @for (item of actions(); track item.label) {
        <button matButton type="button" [disabled]="!api" (click)="api && item.execute(api)">
          <mat-icon aria-hidden="true">{{ item.icon }}</mat-icon>
          {{ item.label }}
        </button>
      }
    </div>
  `,
  styles: `.menu { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-bottom:16px; }`,
})
export class MenuComponent {
  readonly actions = input.required<readonly MenuAction[]>();
  readonly label = input('Table actions');
  readonly gridApi = input<GridApi>();
}
