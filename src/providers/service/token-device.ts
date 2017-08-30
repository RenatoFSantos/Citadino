import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class TokenDeviceService {

  private tokenDeviceRef: any;

  constructor(private fbService: FirebaseService) {

    this.tokenDeviceRef = fbService.getDataBase().ref("/tokendevice");

  }

  getTokenDeviceRef() {
    return this.tokenDeviceRef;
  }

  findTokenById(token: string) {
    return this.tokenDeviceRef.child(token).once('value');
  }

  saveToken(token: string, uid: string) {

    this.tokenDeviceRef.child(token).child(uid).set(true);

  }

}
