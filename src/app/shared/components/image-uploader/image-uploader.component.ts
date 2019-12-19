import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { FileReaderHelper } from 'src/app/core/helpers/filer-reader/file-reader-helper.class';

@Component({
  selector: 'rtg-image-uploader',
  templateUrl: './image-uploader.component.html'
})
export class ImageUploaderComponent implements AfterViewInit {
  @ViewChild('control', { static: true })
  controlElementRef: ElementRef<HTMLInputElement>;

  ngAfterViewInit() {}

  labelClickHandler() {
    this.controlElementRef.nativeElement.click();
  }

  controlChangeHandler(ev: Event) {
    const reader = new FileReaderHelper();
    reader.readImage(this.controlElementRef.nativeElement.files[0]).subscribe(i => console.log(i));
  }
}
