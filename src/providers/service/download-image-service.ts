import { GlobalVar } from './../../shared/global-var';

import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()
export class DownloadImageService {

  constructor(private transfer: FileTransfer, private file: File, private glbVar: GlobalVar) {
  }

  public donwload(urlFrom: string, urlTo: string) {

    var urlImage: string = "";
    const fileTransfer: FileTransferObject = this.transfer.create();

    return fileTransfer.download(urlFrom, urlTo);
  }

  public removeFile(url: string, fileName: string) {
    return this.file.removeFile(url, fileName);
  }

  public readFile(url: string, fileName: string) {
    return this.file.readAsText(url, fileName);
  }

  public listDir(url: string, dirName: string) {
    return this.file.listDir(url, dirName);
  }

  public resolveDirectoryUrl(url: string) {
    return this.file.resolveDirectoryUrl(url);
  }
}
