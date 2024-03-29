import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTable, MatTableDataSource, MatRowDef } from '@angular/material/table';
import * as _ from 'lodash';
import { ExcelService, ExcelImportResult } from './excelService/excel.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatRipple } from '@angular/material/core';
import { FormatTypes } from './table-cell/table-cell.component';
import { SelectionModel } from '@angular/cdk/collections';
import { FileDropEvent } from './excelDirective/excel-drop.directive';

@Component({
  selector: 'app-excel-table',
  templateUrl: './excel-table.component.html',
  styleUrls: ['./excel-table.component.scss']
})
export class ExcelTableComponent implements OnInit {
  @ViewChild(MatRipple, { static: true }) ripple: MatRipple;
  @ViewChild(MatTable, { static: true }) table: MatTable<any>;
  @ViewChild(MatRowDef, { static: true }) rowDef: MatRowDef<any>;
  @ViewChild(MatPaginator, { static: true }) pagination: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  public formatTypes = FormatTypes;

  public data: MatTableDataSource<any> = new MatTableDataSource();
  public columnsToDisplay: string[] = ['id', 'text'];
  public IsDataLoading = false;

  constructor(private excelService: ExcelService) {
    this.OnExcelLoaded = this.OnExcelLoaded.bind(this);
    this.excelService.OnExcelLoaded.subscribe(this.OnExcelLoaded);
  }

  ngOnInit() {
    this.SetupNewDataSource([], ['DROP EXCEL']);
  }

  public handleDrop(e: FileDropEvent) {
    this.ripple.launch(e.MouseCoordinates.x, e.MouseCoordinates.y, {});
    const excelResult = this.excelService.LoadExcel(e.FileList[0]);
    this.IsDataLoading = true;

    if (!excelResult.IsSuccessful) {
      this.IsDataLoading = false;
      console.log(excelResult.ErrorMessage);
    }
  }

  public handleHovered() {}

  public applyFilter(filterValue: string) {
    this.data.filter = filterValue.trim().toLowerCase();
  }

  private OnExcelLoaded(excelResult: ExcelImportResult): void {
    this.IsDataLoading = false;

    if (!excelResult.IsSuccessful) {
      console.log('Something went wrong with Excel Import');
      return;
    }
    this.SetupNewDataSource(excelResult.ExcelData.RowData, excelResult.ExcelData.Headers);
  }

  private SetupNewDataSource(newData: any[], columnData: any[]) {
    console.log(newData);
    this.columnsToDisplay = columnData;
    this.data = new MatTableDataSource(newData);
    this.data.paginator = this.pagination;
    this.data.sort = this.sort;
  }
}
export interface TableData {
  id: number;
  text: string;
  uploaded: boolean;
  classified: string;
}
