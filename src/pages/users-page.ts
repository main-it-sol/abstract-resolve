import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { GridApi } from 'ag-grid-community';
import { BaseComponent } from '../components/base-component/base-component';
import { GRID_ACTIONS, MenuAction, MenuComponent } from '../components/menu-component/menu-component';
import { User, USER_ROLES, UserRole, UserService } from '../services/user.service';
import { TableSource } from '../table-source';

@Component({
  selector: 'app-users-page',
  imports: [BaseComponent, MenuComponent, FormsModule, ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatIconModule, MatInputModule, MatRadioModule],
  templateUrl: './users-page.html',
  styles: `
    .users-controls, .mode-selector, .form-actions { display:flex; flex-wrap:wrap; align-items:center; gap:8px; }
    .mode-selector { margin-bottom:16px; }
    .add-user { margin-top:16px; }
    form { display:flex; flex-wrap:wrap; gap:16px; padding:16px; margin-top:16px; border:1px solid #c4c6d0; border-radius:6px; }
    h2, .form-actions, .form-error { width:100%; }
    h2 { margin:0; font-size:20px; }
    mat-form-field { flex:1 1 220px; min-width:0; padding-bottom:8px; }
  `,
})
export class UsersPage {
  private readonly userService = inject(UserService);
  readonly source: TableSource<User> = inject(ActivatedRoute).snapshot.data['tableSource'];
  readonly gridApi = signal<GridApi<User> | undefined>(undefined);
  readonly actions: MenuAction[] = [
    ...GRID_ACTIONS,
    { label: 'Export users', icon: 'group', execute: api => api.exportDataAsCsv({ fileName: 'users.csv', allColumns: true }) },
  ];
  readonly roles = USER_ROLES;
  readonly modes = ['CTV', 'Mobile App'];
  // ponytail: mode selection is state-only until mode-specific loading is defined.
  selectedMode = 'CTV';
  selectorDisabled = false;
  readonly adding = signal(false);
  readonly status = signal('');
  readonly formError = signal('');
  readonly form = new FormGroup({
    userName: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/\S/)] }),
    userEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, control => this.userService.emailExists(control.value) ? { duplicate: true } : null],
    }),
    userRole: new FormControl<UserRole>('User', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^(Admin|User|Manager)$/)] }),
    numberOfSeats: new FormControl(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0), control => Number.isSafeInteger(control.value) ? null : { integer: true }],
    }),
  });

  @ViewChild(BaseComponent) table?: BaseComponent<User>;
  @ViewChild('addUserButton', { read: ElementRef }) private addUserButton?: ElementRef<HTMLButtonElement>;
  @ViewChild('nameInput') set nameInput(input: ElementRef<HTMLInputElement> | undefined) {
    // Wait until Material has initialized the newly rendered form field.
    if (input) queueMicrotask(() => input.nativeElement.focus());
  }

  openForm(): void {
    if (!this.gridApi() || this.adding()) return;
    this.form.reset();
    this.status.set('');
    this.formError.set('');
    this.adding.set(true);
  }

  cancel(): void {
    this.adding.set(false);
    this.form.reset();
    this.formError.set('');
    this.addUserButton?.nativeElement.focus();
  }

  saveUser(): void {
    if (!this.adding()) return;
    const { userName, userEmail } = this.form.controls;
    userName.setValue(userName.value.trim());
    userEmail.setValue(userEmail.value.trim());
    this.form.markAllAsTouched();
    if (this.form.invalid) return;
    try {
      this.userService.addUser(this.form.getRawValue());
    } catch {
      this.formError.set('Unable to add user. Check the fields and try again.');
      return;
    }
    this.cancel();
    this.status.set('User added.');
    this.table?.reload();
  }
}
