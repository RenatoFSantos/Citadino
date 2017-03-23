import { Injectable } from '@angular/core';
import firebase from 'firebase';

@Injectable()
export class DataService {
  public db: any;
  constructor() { }

  init() {
    const fbConf = {
      apiKey: "AIzaSyByJsiNAYX6741uxiw-TSokabtN64DeTMk",
      authDomain: "citadino-c0c79.firebaseapp.com",
      databaseURL: "https://citadino-c0c79.firebaseio.com",
      storageBucket: "citadino-c0c79.appspot.com",
      messagingSenderId: "75420061601"
    };

    firebase.initializeApp(fbConf);
    this.db = firebase.database().ref('/');
  }

  
  //Retorna um json do objeto
  public pesquisarPorId(tabela: string, uid: string) {
    return firebase.database().ref(tabela + uid).once('value').then(
      (dataSnapshot: any) => {
        return dataSnapshot.val();
      })
      .catch((error: any) => {
        console.log(error);
      });
  }

  public getConnect() {
    return firebase;
  }

}
