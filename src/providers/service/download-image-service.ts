import { GlobalVar } from './../../shared/global-var';

import { Injectable } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';

@Injectable()
export class DownloadImageService {

  constructor(private transfer: FileTransfer, private file: File, private glbVar: GlobalVar) {
  }

  public donwload(url: string, cupomKey: string) {

    var urlImage: string = "";
    const fileTransfer: FileTransferObject = this.transfer.create();

    console.log("fileTransfer " + fileTransfer);
    console.log("url " + url);
    console.log("StorageDirectory " + this.glbVar.getStorageDirectory());

    
    return fileTransfer.download(url, this.glbVar.getStorageDirectory() + cupomKey + '.jpg');
  }

  public removeFile(url: string, fileName: string) {
    return this.file.removeFile(url, fileName);
  }

  public readFile(url: string, fileName: string) {
    return this.file.readAsText(url, fileName);
  }
}
