import { Component, ViewChild, ElementRef, OnDestroy, forwardRef, Input, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { LoadMessageTypes } from '../../../core/helpers/filer-reader/load-message-types.enum';

import { LoadMessage } from '../../..//core/helpers/filer-reader/interfaces/load-message.intreface';
import { LoadProgressMessage } from '../../../core/helpers/filer-reader/interfaces/load-progress-message.interface';

import { FileReaderHelper, FileTypes } from '../../../core/helpers/filer-reader/file-reader-helper.class';
import { Utils } from '../../../core/helpers/utils.class';

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

  value: string;

  error: boolean;

  fileName: string;

  fileSize: number;

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

  private fileReader: FileReaderHelper;

  private onChangeHandler: any;

  private onTouchedHandler: any;

  private subs: Subscription[] = [];

  private loadMessageHandlers: { [loadMessageType: number]: (loadMessage: LoadMessage) => void } = {};

  constructor() {
    this.setLoadMessageHandlers();
  }

  writeValue(obj: any) {
    this.value = obj || null;
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

  buttonUploadClickHandler() {
    this.controlElementRef.nativeElement.click();

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
  }

  buttonCancelClickHandler() {
    this.fileReader.abort();

    if (this.onTouchedHandler) {
      this.onTouchedHandler();
    }
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
      this.value = null;
    };

    this.loadMessageHandlers[LoadMessageTypes.End] = () => {
      this.loading = false;
      this.setProgressBarWidth(100);
    };

    this.loadMessageHandlers[LoadMessageTypes.Success] = loadMessage => {
      this.value = loadMessage.fileReader.result as string;

      if (this.onChangeHandler) {
        this.onChangeHandler(Utils.jsonCopy(this.value));
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
