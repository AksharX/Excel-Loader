import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import * as _ from 'lodash';

export class FileDropEvent {
  FileList: FileList;
  MouseCoordinates: { x: number; y: number };
}

@Directive({
  selector: '[appExcelDrop]'
})
export class ExcelDropDirective {
  @Output() public filesDropped = new EventEmitter<FileDropEvent>();
  @Output() public filesHovered = new EventEmitter();

  private IsHovered = false;
  constructor() {}

  @HostListener('drop', ['$event'])
  onDrop($event: any) {
    console.log($event.clientX);
    $event.preventDefault();
    const transfer = $event.dataTransfer;

    const dropEvent = new FileDropEvent();
    dropEvent.FileList = transfer.files;
    dropEvent.MouseCoordinates = { x: $event.clientX, y: $event.clientY };

    this.filesDropped.emit(dropEvent);
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
