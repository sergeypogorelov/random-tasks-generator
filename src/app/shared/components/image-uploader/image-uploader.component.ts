import { Component, ViewChild, ElementRef, OnDestroy, forwardRef, Input, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

import { LoadMessageTypes } from '../../../core/helpers/filer-reader/load-message-types.enum';

import { FileInfo } from '../../../core/interfaces/common/file-info.interface';
import { LoadMessage } from '../../../core/helpers/filer-reader/interfaces/load-message.intreface';
import { LoadProgressMessage } from '../../../core/helpers/filer-reader/interfaces/load-progress-message.interface';

import { FileReaderHelper, FileTypes } from '../../../core/helpers/filer-reader/file-reader-helper.class';

@Component({
  selector: 'rtg-image-uploader',
  styleUrls: ['./image-uploader.component.scss'],
  templateUrl: './image-uploader.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploaderComponent),
      multi: true
    }
  ]
})
export class ImageUploaderComponent implements ControlValueAccessor, OnDestroy {
  loading: boolean;

  error: boolean;

  value: FileInfo;

  fileName: string;

  fileType: string;

  fileSize: number;

  imgDataUrl: SafeUrl;

  imgDataUrlOrigin: string;

  @Input()
  @HostBinding('class.is-valid')
  valid: boolean;

  @Input()
  @HostBinding('class.is-invalid')
  invalid: boolean;

  @ViewChild('progressBar', { static: true })
  progressBarElementRef: ElementRef<HTMLDivElement>;

  @ViewChild('control', { static: true })
  controlElementRef: ElementRef<HTMLInputElement>;

  private touched: boolean;

  private fileReader: FileReaderHelper;

  private onChangeHandler: any;

  private onTouchedHandler: any;

  private subs: Subscription[] = [];

  private loadMessageHandlers: { [loadMessageType: number]: (loadMessage: LoadMessage) => void } = {};

  constructor(private domSanitizer: DomSanitizer) {
    this.setLoadMessageHandlers();
  }

  writeValue(obj: any) {
    this.setValue(obj);
  }

  registerOnChange(fn: any) {
    this.onChangeHandler = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedHandler = fn;
  }

  ngOnDestroy() {
    this.subs.forEach(i => i.unsubscribe());
  }

  rootClickOutsideHandler() {
    if (this.touched && this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  imgLoadHandler() {
    if (this.imgDataUrlOrigin) {
      URL.revokeObjectURL(this.imgDataUrlOrigin);
    }
  }

  buttonUploadClickHandler() {
    this.controlElementRef.nativeElement.click();

    if (!this.touched) {
      this.touched = true;
    }
  }

  buttonCancelClickHandler() {
    this.fileReader.abort();
  }

  errorButtonClickHandler() {
    this.error = false;
  }

  controlChangeHandler() {
    const file = this.controlElementRef.nativeElement.files[0];

    if (!file) {
      return;
    }

    this.fileReader = new FileReaderHelper();

    if (!this.fileReader.checkType(file, FileTypes.Image)) {
      return;
    }

    this.fileName = file.name;
    this.fileType = file.type;
    this.fileSize = file.size;

    this.subs.push(
      this.fileReader.readImage(file).subscribe(
        loadMessage => this.generalLoadMessageHandler(loadMessage),
        errorMessage => this.errorMessageHandler(errorMessage)
      )
    );
  }

  private generalLoadMessageHandler(loadMessage: LoadMessage) {
    const handler = this.loadMessageHandlers[loadMessage.type];
    if (handler) {
      handler.bind(this)(loadMessage);
    }
  }

  private errorMessageHandler(error: any) {
    this.error = true;
    console.error(error);
  }

  private setValue(fileInfo: FileInfo) {
    if (!fileInfo) {
      this.value = null;
      this.imgDataUrl = null;
      this.imgDataUrlOrigin = null;

      return;
    }

    this.value = fileInfo;
    this.imgDataUrlOrigin = FileReaderHelper.arrayBufferToDataUrl(fileInfo.arrayBuffer, fileInfo.type);
    this.imgDataUrl = this.domSanitizer.bypassSecurityTrustUrl(this.imgDataUrlOrigin);
  }

  private setLoadMessageHandlers() {
    this.loadMessageHandlers[LoadMessageTypes.Start] = () => {
      this.loading = true;
      this.setProgressBarWidth(0);
    };

    this.loadMessageHandlers[LoadMessageTypes.Progress] = loadMessage => {
      const loadProgressMessage = loadMessage as LoadProgressMessage;
      const loadedInPercent = (loadProgressMessage.loaded / this.fileSize) * 100;
      this.setProgressBarWidth(loadedInPercent);
    };

    this.loadMessageHandlers[LoadMessageTypes.Abort] = () => {
      this.setValue(null);
    };

    this.loadMessageHandlers[LoadMessageTypes.End] = () => {
      this.loading = false;
      this.setProgressBarWidth(100);
    };

    this.loadMessageHandlers[LoadMessageTypes.Success] = loadMessage => {
      const arrayBuffer = loadMessage.fileReader.result as ArrayBuffer;

      const value: FileInfo = {
        arrayBuffer,
        type: this.fileType
      };

      this.setValue(value);

      if (this.onChangeHandler) {
        this.onChangeHandler(this.value);
      }
    };
  }

  private setProgressBarWidth(width: number) {
    if (width < 0 || width > 100) {
      throw new Error('The specified width is out of range.');
    }

    this.progressBarElementRef.nativeElement.style.width = `${width}%`;
  }
}
