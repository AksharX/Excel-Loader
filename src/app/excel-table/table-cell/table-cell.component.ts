import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'table-cell',
  templateUrl: './table-cell.component.html',
  styleUrls: ['./table-cell.component.scss']
})
export class TableCellComponent implements OnInit {
  public UseDefault = true;
  public UseCheckBox: boolean;
  public UseInput: boolean;
  public IsChecked: boolean;

  @Input() RawValue: string;
  @Input() FormatType: FormatTypes;
  CellValue: string;

  constructor() {}

  ngOnInit() {
    const toNum = Number(this.RawValue);
    const toDate = new Date(this.RawValue).toDateString();
    const toBool = this.RawValue && (this.RawValue === 'true' || Number.parseInt(this.RawValue, 10) === 1);
    const toPercent = `${toNum * 100}%`;
    const toDollar = `$${toNum.toFixed(2)}`;

    switch (this.FormatType) {
      case FormatTypes.String:
        this.CellValue = this.RawValue;
        break;
      case FormatTypes.Bool:
        this.UseCheckBox = true;
        this.UseDefault = false;
        this.IsChecked = toBool;
        break;
      case FormatTypes.Number:
        this.CellValue = toNum.toLocaleString('en');
        break;
      case FormatTypes.Percent:
        this.CellValue = toPercent;
        break;
      case FormatTypes.Currency:
        this.CellValue = toDollar;
        break;
      case FormatTypes.Date:
        this.CellValue = toDate;
        break;
      case FormatTypes.Input:
        this.CellValue = this.RawValue;
        this.UseInput = true;
        this.UseDefault = false;
      default:
        this.CellValue = this.RawValue;
        break;
    }

    if (!this.CellValue || (this.FormatType === FormatTypes.Number && isNaN(toNum))) {
      this.CellValue = this.RawValue;
    }
  }
}

export enum FormatTypes {
  Input,
  Currency,
  String,
  Date,
  Bool,
  Number,
  Percent
}
