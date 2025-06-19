import { Observable } from "rxjs";
import { AbstractClass } from "./abstract-class";
import {  ColDef } from "ag-grid-community";
import { UserService } from "./services/user.service";

export class ConcreteClassHome extends AbstractClass {
    override getTableDefinition(): ColDef<any, any>[] {
      let colDefs: ColDef[] = [
        { 
          field: "seatName",
          headerName: 'Seat Name',
          headerTooltip: 'Seat Name',
        },
        { 
          field: "sourceId",
          headerName: "Source ID",
          headerTooltip: 'Source ID',
        },
        { 
          field: "sourceName",
          headerName: "Source Name", 
          headerTooltip: "Source Name",
        },
        { 
          field: "environmentName",
          headerName: "Environment Name",
          headerTooltip: "Environment Name",
        },
      ];
      return colDefs;
    }
    override getData(params: any): Observable<any> {
      return this.userService.getDashboardReport();
    }

    override getRowStyle(params: any) {
      return { background: '#FFFFED' };
    }

    override moduleName = 'Home';
  
    constructor(
      private userService: UserService,
      ) {
      super();
    }
  }