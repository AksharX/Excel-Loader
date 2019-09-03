import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { CoreModule } from '@app/core';
import { SharedModule } from '@app/shared';
import { MaterialModule } from '@app/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { ExcelTableComponent } from '@app/excel-table/excel-table.component';
import { ExcelDropDirective } from '../excel-table/excelDirective/excel-drop.directive';
import { TableCellComponent } from '../excel-table/table-cell/table-cell.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    SharedModule,
    FlexLayoutModule,
    MaterialModule,
    HomeRoutingModule
  ],
  declarations: [HomeComponent, ExcelTableComponent, ExcelDropDirective, TableCellComponent]
})
export class HomeModule {}
