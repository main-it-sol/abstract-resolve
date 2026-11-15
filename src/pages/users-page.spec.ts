import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { firstValueFrom } from 'rxjs';
import { routes } from '../app/app.routes';
import { BaseComponent } from '../components/base-component/base-component';
import { UsersTableSource } from '../concrete-users';
import { User, UserService } from '../services/user.service';
import { HomePage } from './home-page';
import { UsersPage } from './users-page';

describe('UsersPage', () => {
  let fixture: ComponentFixture<UsersPage>;
  let page: UsersPage;
  let table: BaseComponent<User>;
  let service: UserService;
  const root = (): HTMLElement => fixture.nativeElement;
  const addButton = () => root().querySelector<HTMLButtonElement>('.add-user')!;

  function startPage(): void {
    fixture = TestBed.createComponent(UsersPage);
    page = fixture.componentInstance;
    fixture.detectChanges();
    expect(addButton().disabled).toBeTrue();
    table = fixture.debugElement.query(By.directive(BaseComponent)).componentInstance;
    tick(2000);
    fixture.detectChanges();
  }

  function input(field: string, value: string): void {
    const element = root().querySelector<HTMLInputElement>(`[formControlName="${field}"]`)!;
    element.value = value;
    element.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  function submit(): void {
    root().querySelector('form')!.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    fixture.detectChanges();
  }

  beforeEach(async () => {
    service = new UserService();
    await TestBed.configureTestingModule({
      imports: [UsersPage],
      providers: [
        { provide: UserService, useValue: service },
        { provide: ActivatedRoute, useValue: { snapshot: { data: { tableSource: new UsersTableSource(service) } } } },
      ],
    }).compileComponents();
  });

  it('adds a trimmed user with role/seat defaults, refreshes rows, and manages focus', fakeAsync(() => {
    startPage();
    const initialCount = table.rowData().length;
    const tableElement = root().querySelector('app-base-component')!;
    expect(tableElement.compareDocumentPosition(addButton()) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    addButton().click();
    fixture.detectChanges();
    tick();
    expect(document.activeElement).toBe(root().querySelector('[formControlName="userName"]'));
    expect(page.form.controls.userRole.value).toBe('User');
    expect(page.form.controls.numberOfSeats.value).toBe(1);
    input('userName', '  New Person  ');
    input('userEmail', '  New.Person@example.com  ');
    submit();
    expect(page.adding()).toBeFalse();
    expect(root().querySelector('form')).toBeNull();
    expect(page.status()).toBe('User added.');
    expect(document.activeElement).toBe(addButton());
    tick(1000);
    expect(table.rowData().length).toBe(initialCount + 1);
    expect(table.rowData().at(-1)).toEqual({ userName: 'New Person', userEmail: 'New.Person@example.com', userRole: 'User', numberOfSeats: 1 });
    // A repeated submit after the form closes must not create another user.
    page.saveUser();
    expect(table.rowData().length).toBe(initialCount + 1);
  }));

  it('rejects missing fields, spaces-only names, invalid email, seats, and roles', fakeAsync(() => {
    startPage();
    addButton().click();
    fixture.detectChanges();
    submit();
    expect(page.form.controls.userName.hasError('required')).toBeTrue();
    expect(page.form.controls.userEmail.hasError('required')).toBeTrue();
    input('userName', '   ');
    input('userEmail', 'not-email');
    input('numberOfSeats', '-1');
    submit();
    expect(page.form.controls.userName.invalid).toBeTrue();
    expect(page.form.controls.userEmail.hasError('email')).toBeTrue();
    expect(page.form.controls.numberOfSeats.invalid).toBeTrue();
    input('numberOfSeats', '1.5');
    expect(page.form.controls.numberOfSeats.hasError('integer')).toBeTrue();
    page.form.controls.userRole.setValue('Unknown' as User['userRole']);
    expect(page.form.controls.userRole.invalid).toBeTrue();
    expect(page.adding()).toBeTrue();
    expect(table.rowData().length).toBe(10);
  }));

  it('rejects seeded duplicate emails case-insensitively and allows correction', fakeAsync(() => {
    startPage();
    addButton().click();
    fixture.detectChanges();
    input('userName', 'Other Alice');
    input('userEmail', '  ALICE.SMITH@example.com  ');
    submit();
    expect(page.form.controls.userEmail.hasError('duplicate')).toBeTrue();
    expect(root().textContent).toContain('A user with this email already exists.');
    expect(table.rowData().length).toBe(10);
    input('userEmail', 'other.alice@example.com');
    input('numberOfSeats', '0');
    const select = root().querySelector<HTMLSelectElement>('select')!;
    select.value = 'Manager';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    submit();
    tick(1000);
    expect(table.rowData().at(-1)?.userRole).toBe('Manager');
    expect(table.rowData().at(-1)?.numberOfSeats).toBe(0);
  }));

  it('cancels without changing users and clears the draft/validation state', fakeAsync(() => {
    startPage();
    addButton().click();
    fixture.detectChanges();
    input('userName', 'Discard me');
    input('userEmail', 'invalid');
    submit();
    root().querySelector<HTMLButtonElement>('.form-actions button[type="button"]')!.click();
    fixture.detectChanges();
    expect(table.rowData().length).toBe(10);
    expect(page.adding()).toBeFalse();
    expect(document.activeElement).toBe(addButton());
    addButton().click();
    fixture.detectChanges();
    expect(page.form.getRawValue()).toEqual({ userName: '', userEmail: '', userRole: 'User', numberOfSeats: 1 });
    expect(page.form.untouched).toBeTrue();
    expect(page.form.pristine).toBeTrue();
  }));

  it('preserves the Users-only mode selector and named CSV export', fakeAsync(() => {
    startPage();
    const radios = Array.from(root().querySelectorAll<HTMLInputElement>('input[type="radio"]'));
    expect(radios.map(radio => radio.value)).toEqual(['CTV', 'Mobile App']);
    expect(radios[0].checked).toBeTrue();
    radios[1].click();
    tick();
    fixture.detectChanges();
    expect(page.selectedMode).toBe('Mobile App');
    page.selectorDisabled = true;
    fixture.detectChanges();
    expect(radios.every(radio => radio.disabled)).toBeTrue();
    const exportUsers = Array.from(root().querySelectorAll('button')).find(button => button.textContent?.includes('Export users'))!;
    const exportCsv = spyOn(table.gridApi!, 'exportDataAsCsv');
    expect(exportUsers.disabled).toBeFalse();
    exportUsers.click();
    expect(exportCsv).toHaveBeenCalledOnceWith({ fileName: 'users.csv', allColumns: true });
  }));

  it('retains a draft and reports a safe error if creation fails', fakeAsync(() => {
    startPage();
    spyOn(service, 'addUser').and.throwError('Private details');
    addButton().click();
    fixture.detectChanges();
    input('userName', 'Retry Person');
    input('userEmail', 'retry@example.com');
    submit();
    expect(page.adding()).toBeTrue();
    expect(page.form.controls.userName.value).toBe('Retry Person');
    expect(root().querySelector('[role="alert"]')?.textContent).toContain('Unable to add user.');
    expect(root().textContent).not.toContain('Private details');
  }));
});

describe('Page composition and in-memory storage', () => {
  it('keeps additions across real route changes and limits controls to Users', async () => {
    TestBed.configureTestingModule({ providers: [provideRouter(routes)] });
    const harness = await RouterTestingHarness.create();
    const users = await harness.navigateByUrl('/users', UsersPage);
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('.ag-root')).not.toBeNull();
    const service = TestBed.inject(UserService);
    service.addUser({ userName: 'Persistent Demo', userEmail: 'persist@example.com', userRole: 'User', numberOfSeats: 1 });
    const home = await harness.navigateByUrl('/home', HomePage);
    await harness.fixture.whenStable();
    expect(home.actions.length).toBe(2);
    expect(harness.routeNativeElement?.querySelector('mat-radio-group')).toBeNull();
    expect(harness.routeNativeElement?.querySelector('.add-user')).toBeNull();
    const returned = await harness.navigateByUrl('/users', UsersPage);
    expect(returned).not.toBe(users);
    const rows = await firstValueFrom(returned.source.loadRows());
    expect(rows.some(user => user.userEmail === 'persist@example.com')).toBeTrue();
    expect(home.source.rowStyle['background']).toBe('#FFFFED');
    expect(returned.source.rowStyle['background']).toBe('#fff');
    expect(home.source.columns.length).toBe(4);
    expect(returned.source.columns.length).toBe(4);
  });

  it('validates the service boundary and does not expose its stored objects', fakeAsync(() => {
    const service = new UserService();
    const valid: User = { userName: ' New ', userEmail: ' NEW@example.com ', userRole: 'User', numberOfSeats: 0 };
    service.addUser(valid);
    expect(service.emailExists('new@EXAMPLE.com')).toBeTrue();
    expect(() => service.addUser(valid)).toThrowError('A user with this email already exists.');
    for (const invalid of [
      { userName: ' ' }, { userEmail: '' }, { userEmail: 'invalid' },
      { userRole: 'Unknown' as User['userRole'] }, { numberOfSeats: -1 }, { numberOfSeats: 0.5 }, { numberOfSeats: Infinity },
    ]) {
      expect(() => service.addUser({ ...valid, userEmail: 'unique@example.com', ...invalid })).toThrowError('Invalid user details.');
    }
    service.getAllUsersData().subscribe(rows => { rows[0].userName = 'Changed outside service'; rows.pop(); });
    tick(1000);
    service.getAllUsersData().subscribe(rows => {
      expect(rows[0].userName).toBe('Alice Smith');
      expect(rows.length).toBe(11);
      expect(rows.at(-1)?.userName).toBe('New');
    });
    tick(1000);
    expect(new UserService().emailExists('new@example.com')).toBeFalse();
  }));
});
