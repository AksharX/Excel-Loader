import { Injectable, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
import * as xlsx from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  public readonly SupportedTypes: string[] = ['csv', 'xlsx', 'xls', 'txt', 'rtf'];
  public OnExcelLoaded = new EventEmitter<ExcelImportResult>();

  constructor() {
    this.ReadExcel = this.ReadExcel.bind(this);
  }

  public LoadExcel(file: File): ExcelImportResult {
    if (!this.IsSupportedFile(file)) {
      return ExcelImportResult.GetUnSuccessfulResult(`The file [${file.name}] is not a supported type`);
    }
    const reader = new FileReader();
    reader.onload = this.ReadExcel;
    try {
      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.log(`Could not read from file. [${file.name}]`, error);
      return ExcelImportResult.GetUnSuccessfulResult(`Something went wrong during parsing the file [${file.name}]`);
    }
    const successfullyLoaded = new ExcelImportResult();
    successfullyLoaded.IsSuccessful = true;
    return successfullyLoaded;
  }

  private IsSupportedFile(file: File): boolean {
    const ext = file.name.split('.').pop();
    return this.SupportedTypes.some(t => t === ext);
  }

  private IsValidTableFormat(): boolean {
    return true;
  }

  private ReadExcel(e: FileProgressEvent): void {
    const dataArray = new Uint8Array(e.target.result);
    const book = xlsx.read(dataArray, { type: 'array' });
    const sheetName = book.SheetNames[0];
    const sheet = book.Sheets[sheetName];

    const jsonData = xlsx.utils.sheet_to_json(sheet, { raw: true });

    if (jsonData.length === 0) {
      this.OnExcelLoaded.emit(
        ExcelImportResult.GetUnSuccessfulResult(`The excel sheet [${sheetName}] does not contain any headers`)
      );
    }
    const excelData = new ExcelData();
    excelData.Headers = Object.keys(jsonData[0]);
    excelData.RowData = jsonData;

    this.OnExcelLoaded.emit(ExcelImportResult.GetSuccessfulResult(excelData));
  }
}

export class ExcelImportResult {
  IsSuccessful: boolean;
  ErrorMessage: string;
  ExcelData: ExcelData;

  static GetSuccessfulResult(excelData: ExcelData): ExcelImportResult {
    const r = new ExcelImportResult();
    r.ErrorMessage = '';
    r.IsSuccessful = true;
    r.ExcelData = excelData;
    return r;
  }

  static GetUnSuccessfulResult(errorMsg: string): ExcelImportResult {
    const r = new ExcelImportResult();
    r.ErrorMessage = errorMsg;
    r.IsSuccessful = false;
    r.ExcelData = null;
    return r;
  }
}

export class ExcelData {
  public Headers: string[];
  public RowData: any[];
}

interface FileProgressEvent extends ProgressEvent {
  target: FileReaderEventTarget;
}

interface FileReaderEventTarget extends EventTarget {
  result: number[];
}
