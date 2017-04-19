import { Injectable } from '@angular/core';
import firebase from 'firebase';

const fbConf = {
  apiKey: "AIzaSyByJsiNAYX6741uxiw-TSokabtN64DeTMk",
  authDomain: "citadino-c0c79.firebaseapp.com",
  databaseURL: "https://citadino-c0c79.firebaseio.com",
  storageBucket: "citadino-c0c79.appspot.com",
  messagingSenderId: "75420061601"
};

@Injectable()
export class FirebaseService {
  private dataBase: any;
  private storageRef: any;
  private connectionRef: any;
  private connected: boolean = false;


  constructor() {
    var self = this;
    try {

      firebase.initializeApp(fbConf);
      self.dataBase = firebase.database();
      self.connectionRef = self.dataBase.ref('.info/connected')
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
        console.log(snap.val());
        if (snap.val() === true) {
          // console.log('Firebase: Conectado:');
          self.connected = true;
        } else {
          // console.log('Firebase: Nao Conectato:');
          self.connected = false;
        }
      });
    } catch (error) {
      self.connected = false;
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

  public isFirebaseConnected() {
    return this.connected;
  }

  public getFireBase() {
    return firebase;
  }

  public getConnectionRef() {
    return this.connectionRef;
  }

  //Retorna um registro de uma tabela
  // public findByKey(tabela: string, uid: string) {
  //   return firebase.database().ref('/' + tabela + '/' + uid).once('value').then(
  //     (dataSnapshot: any) => {
  //       if (dataSnapshot.val() != null) {
  //         return dataSnapshot.val();
  //       }
  //       else {
  //         throw 'Usuário não encontrado';
  //       }
  //     })
  //     .catch((error: any) => {
  //       console.log(error);
  //     });
  // }

  // public returnRef(tabela: string, key?: string): firebase.database.Reference {
  //   if (key != "" || key! + null)
  //     return firebase.database().ref().child('/' + tabela + '/' + key);
  //   else
  //     return firebase.database().ref().child('/' + tabela);
  // }
}
