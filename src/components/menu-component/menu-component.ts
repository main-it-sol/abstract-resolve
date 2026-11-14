import { Component, computed, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';
import { GridApi } from 'ag-grid-community';
import { AbstractClass } from '../../abstract-class';

@Component({
  selector: 'app-menu-component',
  imports: [MatButtonModule, MatIconModule, MatRadioModule, FormsModule],
  template: `
    @let api = gridApi();
    <div class="menu" role="group" [attr.aria-label]="concreteClass().moduleName + ' actions'">
      @for (item of menuItems(); track item.label) {
        <button matButton type="button" [disabled]="!api" (click)="api && item.execute(api)">
          <mat-icon aria-hidden="true">{{ item.icon }}</mat-icon>
          {{ item.label }}
        </button>
      }
      @if (modeSelector(); as selector) {
        <mat-radio-group
          aria-label="User mode"
          [disabled]="selector.selectorDisabled"
          (change)="selector.onModeChange()"
          class="bndl-radio-group"
          [(ngModel)]="selector.selectedMode">
          @for (season of selector.seasons; track season) {
            <mat-radio-button class="bndl-radio-button" [value]="season">
              {{ season }}
            </mat-radio-button>
          }
        </mat-radio-group>
      }
    </div>
  `,
  styles: `
    .menu {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
    }

    .bndl-radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
  `,
})
export class MenuComponent {
  readonly concreteClass = input.required<AbstractClass>();
  readonly gridApi = input<GridApi>();
  readonly menuItems = computed(() => this.concreteClass().getMenuItems());
  readonly modeSelector = computed(() => this.concreteClass().getModeSelector());
}
