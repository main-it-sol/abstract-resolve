import { ColDef } from 'ag-grid-community';
import { TableSource } from './table-source';
import { User, UserService } from './services/user.service';

export class UsersTableSource implements TableSource<User> {
  readonly columns: ColDef<User>[] = [
    { field: 'userName', headerName: 'Name', headerTooltip: 'Name' },
    { field: 'userEmail', headerName: 'Email', headerTooltip: 'Email' },
    { field: 'userRole', headerName: 'Role', headerTooltip: 'Role' },
    { field: 'numberOfSeats', headerName: 'Number of Seats', headerTooltip: 'Number of Seats' },
  ];
  readonly rowStyle = { background: '#fff' };

  constructor(private readonly userService: UserService) {}

  loadRows() { return this.userService.getAllUsersData(); }
}
