import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { UsersTableSource } from '../concrete-users';
import { TableSource } from '../table-source';
import { User, UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class UsersResolver implements Resolve<TableSource<User>> {
  constructor(private readonly userService: UserService) {}

  resolve(): TableSource<User> { return new UsersTableSource(this.userService); }
}
