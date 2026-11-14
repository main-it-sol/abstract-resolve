import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { GridApi } from 'ag-grid-community';
import { AbstractClass } from '../../abstract-class';

@Component({
  selector: 'app-menu-component',
  imports: [MatButtonModule, MatIconModule],
  template: `
    @let api = gridApi();
    <div class="menu" role="group" [attr.aria-label]="concreteClass().moduleName + ' actions'">
      @for (item of menuItems(); track item.label) {
        <button matButton type="button" [disabled]="!api" (click)="api && item.execute(api)">
          <mat-icon aria-hidden="true">{{ item.icon }}</mat-icon>
          {{ item.label }}
        </button>
      }
    </div>
  `,
  styles: `
    .menu {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 16px;
    }
  `,
})
export class MenuComponent {
  readonly concreteClass = input.required<AbstractClass>();
  readonly gridApi = input<GridApi>();
  readonly menuItems = computed(() => this.concreteClass().getMenuItems());
}
