import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { HomeTableSource } from '../concrete-home';
import { TableSource } from '../table-source';
import { DashboardRow, UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class HomeResolver implements Resolve<TableSource<DashboardRow>> {
  constructor(private readonly userService: UserService) {}

  resolve(): TableSource<DashboardRow> { return new HomeTableSource(this.userService); }
}
