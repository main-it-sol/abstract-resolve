import { ColDef } from 'ag-grid-community';
import { TableSource } from './table-source';
import { DashboardRow, UserService } from './services/user.service';

export class HomeTableSource implements TableSource<DashboardRow> {
  readonly columns: ColDef<DashboardRow>[] = [
    { field: 'seatName', headerName: 'Seat Name', headerTooltip: 'Seat Name' },
    { field: 'sourceId', headerName: 'Source ID', headerTooltip: 'Source ID' },
    { field: 'sourceName', headerName: 'Source Name', headerTooltip: 'Source Name' },
    { field: 'environmentName', headerName: 'Environment Name', headerTooltip: 'Environment Name' },
  ];
  readonly rowStyle = { background: '#FFFFED' };

  constructor(private readonly userService: UserService) {}

  loadRows() { return this.userService.getDashboardReport(); }
}
