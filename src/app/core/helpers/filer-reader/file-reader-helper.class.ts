import { Observable, Subject, throwError, merge } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { LoadMessageTypes } from './load-message-types.enum';
import { LoadMessage } from './interfaces/load-message.intreface';

export enum FileTypes {
  Any,
  Image
}

export const fileExtensions = {
  [FileTypes.Image]: ['image/png', 'image/jpg', 'image/jpeg', 'image/gif']
};

export class FileReaderHelper {
  get loading(): boolean {
    return !!this.isLoading;
  }

  private isLoading: boolean;

  private fileReader: FileReader;

  private generalObservable: Observable<LoadMessage>;

  private loadStartSubject: Subject<ProgressEvent>;

  private loadProgressSubject: Subject<ProgressEvent>;

  private loadAbortSubject: Subject<ProgressEvent>;

  private loadEndSubject: Subject<ProgressEvent>;

  private loadSuccessSubject: Subject<ProgressEvent>;

  private loadErrorSubject: Subject<ProgressEvent>;

  private eventHandlers = {
    loadstart: (ev: ProgressEvent) => {
      this.isLoading = true;

      this.loadStartSubject.next(ev);
      this.loadStartSubject.complete();
    },
    progress: (ev: ProgressEvent) => {
      this.loadProgressSubject.next(ev);
    },
    abort: (ev: ProgressEvent) => {
      this.loadAbortSubject.next(ev);
      this.loadAbortSubject.complete();
    },
    loadend: (ev: ProgressEvent) => {
      this.loadProgressSubject.complete();

      this.loadEndSubject.next(ev);
      this.loadEndSubject.complete();

      this.clear(ev.target as FileReader);
    },
    load: (ev: ProgressEvent) => {
      this.loadSuccessSubject.next(ev);
      this.loadSuccessSubject.complete();
    },
    error: (ev: ProgressEvent) => {
      this.loadErrorSubject.next(ev);
      this.loadErrorSubject.complete();
    }
  };

  checkType(file: File, fileType: FileTypes = FileTypes.Any): boolean {
    if (!file) {
      throw new Error('File is not specified.');
    }

    if (fileType === FileTypes.Any) {
      return true;
    }

    return fileExtensions[fileType].includes(file.type);
  }

  readImage(file: File): Observable<LoadMessage> {
    if (!file) {
      throw new Error('File is not specified.');
    }

    if (this.isLoading) {
      throw new Error('Loading is in progress.');
    }

    if (!this.checkType(file, FileTypes.Image)) {
      throw new Error('Not valid extension.');
    }

    this.setSubjects();
    this.setGeneralObservable();

    this.fileReader = new FileReader();
    this.addEventListeners(this.fileReader);

    this.fileReader.readAsDataURL(file);

    return this.generalObservable;
  }

  abort() {
    if (!this.isLoading) {
      throw new Error('Loading is not in progress.');
    }

    if (!this.fileReader) {
      throw new Error('File reader is not specified.');
    }

    this.fileReader.abort();
  }

  private addEventListeners(reader: FileReader) {
    if (!reader) {
      throw new Error('Reader is not specified.');
    }

    for (const eventName in this.eventHandlers) {
      if (this.eventHandlers.hasOwnProperty(eventName)) {
        reader.addEventListener(eventName, this.eventHandlers[eventName]);
      }
    }
  }

  private removeEventListeners(reader: FileReader) {
    if (!reader) {
      throw new Error('Reader is not specified.');
    }

    for (const eventName in this.eventHandlers) {
      if (this.eventHandlers.hasOwnProperty(eventName)) {
        reader.removeEventListener(eventName, this.eventHandlers[eventName]);
      }
    }
  }

  private setSubjects() {
    this.loadStartSubject = new Subject<ProgressEvent>();
    this.loadProgressSubject = new Subject<ProgressEvent>();
    this.loadAbortSubject = new Subject<ProgressEvent>();
    this.loadEndSubject = new Subject<ProgressEvent>();
    this.loadSuccessSubject = new Subject<ProgressEvent>();
    this.loadErrorSubject = new Subject<ProgressEvent>();
  }

  private setGeneralObservable() {
    this.generalObservable = merge(
      this.loadStartSubject.pipe(map(ev => ({ type: LoadMessageTypes.Start, fileReader: ev.target as FileReader }))),
      this.loadProgressSubject.pipe(
        map(ev => ({ type: LoadMessageTypes.Progress, fileReader: ev.target as FileReader, loaded: ev.loaded }))
      ),
      this.loadAbortSubject.pipe(map(ev => ({ type: LoadMessageTypes.Abort, fileReader: ev.target as FileReader }))),
      this.loadEndSubject.pipe(map(ev => ({ type: LoadMessageTypes.End, fileReader: ev.target as FileReader }))),
      this.loadSuccessSubject.pipe(
        map(ev => ({ type: LoadMessageTypes.Success, fileReader: ev.target as FileReader }))
      ),
      this.loadErrorSubject.pipe(
        mergeMap(ev => throwError({ type: LoadMessageTypes.Error, fileReader: ev.target as FileReader }))
      )
    );
  }

  private clear(fileReader: FileReader) {
    this.isLoading = false;
    this.fileReader = null;

    this.loadStartSubject = null;
    this.loadProgressSubject = null;
    this.loadAbortSubject = null;
    this.loadEndSubject = null;
    this.loadSuccessSubject = null;
    this.loadErrorSubject = null;

    this.generalObservable = null;

    this.removeEventListeners(fileReader);
  }
}
