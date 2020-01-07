import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FileInfo } from '../../interfaces/common/file-info.interface';
import { ImageInfo } from '../../interfaces/common/image-info.interface';

@Injectable()
export class ObjectUrlService {
  private urlsMap = new Map<string, string[]>();

  constructor(private domSanitizer: DomSanitizer) {}

  createImgUrl(tag: string, fileInfo: FileInfo): ImageInfo {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    if (!fileInfo) {
      throw new Error('File info is not specified.');
    }

    const blob = new Blob([fileInfo.arrayBuffer], { type: fileInfo.type });

    const dataUrl = URL.createObjectURL(blob);
    const safeUrl = this.domSanitizer.bypassSecurityTrustUrl(dataUrl);

    if (!this.urlsMap.has(tag)) {
      this.urlsMap.set(tag, []);
    }

    const currentUrls = this.urlsMap.get(tag);
    const newUrls = [...currentUrls, dataUrl];

    this.urlsMap.set(tag, newUrls);

    const result: ImageInfo = {
      dataUrl,
      safeUrl
    };

    return result;
  }

  revokeUrlsByTag(tag: string, delay = 50) {
    if (!tag) {
      throw new Error('Tag is not specified.');
    }

    if (!this.urlsMap.has(tag)) {
      return;
    }

    const urls = this.urlsMap.get(tag);
    const action = () => {
      urls.forEach(url => URL.revokeObjectURL(url));
    };

    this.urlsMap.delete(tag);

    setTimeout(action, delay);
  }
}
