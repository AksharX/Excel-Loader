import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import * as _ from 'lodash';

@Directive({
  selector: '[appExcelDrop]'
})
export class ExcelDropDirective {
  @Output() public filesDropped = new EventEmitter<FileList>();
  @Output() public filesHovered = new EventEmitter();

  private IsHovered = false;
  constructor() {}

  @HostListener('drop', ['$event'])
  onDrop($event: any) {
    $event.preventDefault();
    const transfer = $event.dataTransfer;
    this.filesDropped.emit(transfer.files);
    this.filesHovered.emit(false);
    this.IsHovered = false;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave($event: any) {
    $event.preventDefault();
    if (this.IsHovered) {
      this.filesHovered.emit(false);
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver($event: any) {
    $event.preventDefault();
    if (!this.IsHovered) {
      this.filesHovered.emit(true);
      this.IsHovered = true;
    }
  }
}
