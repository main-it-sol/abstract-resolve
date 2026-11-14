import { Component, DestroyRef, HostListener, inject, OnInit, signal, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defer, finalize, take } from 'rxjs';
import { AgGridAngular } from "ag-grid-angular";
import { AllCommunityModule, ColDef, GridApi, ModuleRegistry } from "ag-grid-community";
import { AbstractClass } from '../../abstract-class';
import { ActivatedRoute } from '@angular/router';
import { MenuComponent } from '../menu-component/menu-component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-base-component',
  imports: [AgGridAngular, MenuComponent],
  templateUrl: './base-component.html',
  styleUrl: './base-component.scss'
})
export class BaseComponent implements OnInit {

  private readonly destroyRef = inject(DestroyRef);
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  gridApi?: GridApi;
  rowData: any[] = [];
  concreteClass!: AbstractClass;
  colDefs: ColDef[] = [];
  @ViewChild('agGrid') agGrid: any;

  @HostListener('window:resize', ['$event'])
  onWindowResize(event: Event) {
    this.gridApi?.sizeColumnsToFit();
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
    
    this.loading.set(true);
    this.errorMessage.set('');
    defer(() => this.concreteClass.getData(params)).pipe(
      take(1),
      takeUntilDestroyed(this.destroyRef),
      finalize(() => this.loading.set(false)),
    ).subscribe({
      next: (data: any[]) => {
        this.rowData = data;
        this.gridApi?.sizeColumnsToFit();
      },
      error: () => {
        this.errorMessage.set('Unable to load data. Please try again.');
      },
    });
  }
  
}
