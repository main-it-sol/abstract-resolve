import { ColDef, RowStyle } from 'ag-grid-community';
import { Observable } from 'rxjs';

export interface TableSource<T> {
  readonly columns: ColDef<T>[];
  readonly rowStyle: RowStyle;
  loadRows(): Observable<T[]>;
}
