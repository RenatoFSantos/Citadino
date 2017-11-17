import { Events } from 'ionic-angular';
import { GlobalVar } from './../../shared/global-var';
import { Injectable } from '@angular/core';

declare var firebase: any;

@Injectable()
export class FirebaseService {
  private dataBase: any;
  private storage:any;
  private storageRef: any;
  private connectionRef: any;
  private authRef: any;

  constructor(private globalVar: GlobalVar,
    private eventCtrl: Events) {
    var self = this;
    try {
      self.dataBase = firebase.database();
      self.connectionRef = self.dataBase.ref('.info/connected');
      self.storage = firebase.storage();
      self.storageRef = self.storage.ref();
      self.checkFirebaseConnection();
      self.authRef = firebase.auth;
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
          this.eventCtrl.publish('firebase:connected');
          self.globalVar.setIsFirebaseConnected(true);
          console.log("conectado");
        } else {
          this.eventCtrl.publish('firebase:desconectado');
          self.globalVar.setIsFirebaseConnected(false);
          console.log("desconectado");
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

  public getStorage() {
    return this.storage;
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

  public getAuthRef() {
    return this.authRef;
  }}
