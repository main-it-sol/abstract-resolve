import { Observable } from "rxjs";
import { AbstractClass, MenuItem, MenuModeSelector } from "./abstract-class";
import { ColDef, GridApi } from "ag-grid-community";
import { UserService } from "./services/user.service";

export class ConcreteClassUsers extends AbstractClass {
    selectorDisabled = false;
    selectedMode: string = 'CTV';
    seasons = ['CTV', 'Mobile App'];

    override getModeSelector(): MenuModeSelector {
      return this;
    }

    onModeChange(): void {
      // ponytail: selection state only; add mode-specific loading here when its behavior is defined.
    }

    override getMenuItems(): MenuItem[] {
      return [
        ...super.getMenuItems(),
        {
          label: 'Export users',
          icon: 'group',
          execute: gridApi => this.exportUsers(gridApi),
        },
      ];
    }

    exportUsers(gridApi: GridApi): void {
      gridApi.exportDataAsCsv({ fileName: 'users.csv', allColumns: true });
    }

    override getTableDefinition(): ColDef<any, any>[] {
      let colDefs: ColDef[] = [
        { 
          field: "userName",
          headerName: 'Name',
          headerTooltip: 'Name',
        },
        { 
          field: "userEmail",
          headerName: "Email",
          headerTooltip: 'Email',
        },
        { 
          field: "userRole",
          headerName: "Role", 
          headerTooltip: "Role",
        },
        { 
          field: "numberOfSeats",
          headerName: "Number of Seats", 
          headerTooltip: "Number of Seats",
        },
      ];
      return colDefs;
    }
    override getData(params: any): Observable<any> {
      return this.userService.getAllUsersData();
    }

    override getRowStyle(params: any) {
      return { background: '#fff' };
    }

    override moduleName = 'Users';
  
    constructor(
      private userService: UserService,
      ) {
      super();
    }
  }