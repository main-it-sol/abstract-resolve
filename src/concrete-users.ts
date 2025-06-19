import { Observable } from "rxjs";
import { AbstractClass } from "./abstract-class";
import {  ColDef } from "ag-grid-community";
import { UserService } from "./services/user.service";

export class ConcreteClassUsers extends AbstractClass {
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