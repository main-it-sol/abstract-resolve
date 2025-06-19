import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AgGridAngular } from "ag-grid-angular";
import { AllCommunityModule, ColDef, GridApi, ModuleRegistry } from "ag-grid-community";
import { AbstractClass } from '../../abstract-class';
import { ActivatedRoute } from '@angular/router';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-base-component',
  imports: [ AgGridAngular],
  templateUrl: './base-component.html',
  styleUrl: './base-component.scss'
})
export class BaseComponent implements OnInit {

  private gridApi!: GridApi;
  rowData: any[] = [];
  concreteClass!: AbstractClass;
  colDefs: ColDef[] = [];
  @ViewChild('agGrid') agGrid: any;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.gridApi.sizeColumnsToFit();
  }

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.concreteClass = this.route.snapshot.data['concreteClass'];
    this.colDefs = this.concreteClass.getTableDefinition();
    this.concreteClass.getScreenSize();
  }

  onGridReady(params: any) {
    
    document.getElementById('agGrid')!.style.height = this.concreteClass.screenHeight - 240 + "px";
    this.gridApi = params.api;
    
    this.concreteClass.getData(params).subscribe((data: any[]) => {
      this.rowData = data;
      this.gridApi.sizeColumnsToFit();
    });
  }
  
}
