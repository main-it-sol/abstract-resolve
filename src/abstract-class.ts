import { ColDef, GridApi} from 'ag-grid-community';
import { Observable } from 'rxjs';

export interface MenuItem {
    label: string;
    icon: string;
    execute: (gridApi: GridApi) => void;
}

export interface MenuModeSelector {
    selectorDisabled: boolean;
    selectedMode: string;
    seasons: string[];
    onModeChange(): void;
}

export abstract class AbstractClass {
    /**
     * The template method defines the skeleton of an algorithm.
     */
    public defaultColDef: ColDef = {
        flex: 1,
        minWidth: 150,
        filter: true,
        filterParams: {
          buttons: ['apply', 'reset'],
          closeOnApply: true,
        },
        floatingFilter: true,
        menuTabs: ['filterMenuTab'],
    };

    public rowHeight = 50;
    public moduleName = 'AbstractClass';

    public style: any = {
        height: '300px',
        width: '100%',
    };

    public currentRoute: string = '';
    public selectedRouteId: string = '';
    
    public screenHeight: number = 0;
    public screenWidth: number = 0;

    public getScreenSize() {
        this.screenHeight = window.innerHeight;
        this.screenWidth = window.innerWidth;
    }

    

    public getModeSelector(): MenuModeSelector | undefined {
        return undefined;
    }

    public getMenuItems(): MenuItem[] {
        return [
            {
                label: 'Clear all filters',
                icon: 'filter_alt_off',
                execute: gridApi => this.resetAllFilters(gridApi),
            },
            {
                label: 'Export to CSV',
                icon: 'download',
                execute: gridApi => this.exportToCsv(gridApi),
            },
        ];
    }

    public resetAllFilters(gridApi:GridApi) {
        gridApi.setFilterModel(null);
        gridApi.onFilterChanged();
    }

    public exportToCsv(gridApi:GridApi) {
        gridApi.exportDataAsCsv();
    }

    

    public exportToExcel(gridApi:GridApi) {
        gridApi.exportDataAsExcel();
    }
    

    /**
     * These operations have to be implemented in subclasses.
     */
    abstract getTableDefinition(): ColDef[];
    abstract getData(params: any): Observable<any>;
    abstract getRowStyle(params: any): any;

    /**
     * These are "hooks." Subclasses may override them, but it's not mandatory
     * since the hooks already have default (but empty) implementation. Hooks
     * provide additional extension points in some crucial places of the
     * algorithm.
     */
    protected hook1(): void { }

    protected hook2(): void { }
}