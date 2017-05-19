import { GlobalVar } from './../../shared/global-var';
import { Injectable } from '@angular/core';
// import firebase from 'firebase';

// const fbConf = {
//   apiKey: "AIzaSyByJsiNAYX6741uxiw-TSokabtN64DeTMk",
//   authDomain: "citadino-c0c79.firebaseapp.com",
//   databaseURL: "https://citadino-c0c79.firebaseio.com",
//   storageBucket: "citadino-c0c79.appspot.com",
//   messagingSenderId: "75420061601"
// };

declare var firebase: any;

@Injectable()
export class FirebaseService {
  private dataBase: any;
  private storageRef: any;
  private connectionRef: any;

  constructor(public globalVar: GlobalVar) {
    var self = this;
    try {
      self.dataBase = firebase.database();
      self.connectionRef = self.dataBase.ref('.info/connected');
      self.storageRef = firebase.storage().ref();
      self.checkFirebaseConnection();
    }
    catch (error) {
      console.log('Erro ao iniciar o firebase: ' + error);
    }
  }

  checkFirebaseConnection() {
    try {
      var self = this;
      var connectedRef = self.getConnectionRef();
      connectedRef.on('value', (snap) => {
        if (snap.val() === true) {
          self.globalVar.setIsFirebaseConnected(true);
        } else {
          self.globalVar.setIsFirebaseConnected(false);
        }
      });
    } catch (error) {
      console.log(error);
      self.globalVar.setIsFirebaseConnected(false);
    }
  }

  public getDataBase() {
    return this.dataBase;
  }

  public getStorageRef() {
    return this.storageRef;
  }

  public goOnline() {
    this.dataBase.goOnline();
  }

  public goOffline() {
    this.dataBase.goOffline();
  }

  public getFireBase() {
    return firebase;
  }

  public getConnectionRef() {
    return this.connectionRef;
  }

  public getTimeStamp() {
    return firebase.database.ServerValue.TIMESTAMP;
  }

}
