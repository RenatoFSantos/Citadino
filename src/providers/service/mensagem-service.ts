import { Events } from 'ionic-angular';
import { GlobalVar } from './../../shared/global-var';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseService } from './../database/firebase-service';
import { UsuarioService } from './usuario-service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MensagemService {

  private mensagemRef: any;
  constructor(private usuaSrv: UsuarioService,
    private db: AngularFireDatabase,
    private fbSrv: FirebaseService,
    private globalVar: GlobalVar,
    private event: Events) { }


  public addMensagems(uid, interlocutor) {
    // Primeiro Usuário
    let user1 = this.db.object(`/usuario/${uid}/mensagem/${interlocutor}`);
    user1.set(false);

    // Segundo Usuário
    let user2 = this.db.object(`/usuario/${interlocutor}/mensagem/${uid}`);
    user2.set(true);
  }

  public addMensagemEvent() {

    if (this.globalVar.getIsFirebaseConnected()) {

      let userCurrent = this.usuaSrv.getLoggedInUser();
      if (userCurrent != null) {
        
        this.fbSrv.getDataBase().ref(`/usuario/${userCurrent.uid}/mensagem/`).on('child_changed', this.onStatusMensagemEvent);

        this.fbSrv.getDataBase().ref(`/usuario/${userCurrent.uid}/mensagem/`).on('child_added', this.onStatusMensagemEvent);
      }

    }
  }

  private onStatusMensagemEvent = (childSnapshot, prevChildKey) => {
    this.event.publish('mensagem:alterada', childSnapshot, prevChildKey);
  }


  public listMensagens(value: string) {
    return this.db.list(value);
  }

  public getMensagens(uid: string, interlocutor: string) {
    let user1Ref = this.db.object(`/mensagem/${uid},${interlocutor}`, { preserveSnapshot: true });

    return new Promise((resolve, reject) => {
      user1Ref.subscribe((snapshot) => {
        if (snapshot.exists()) {
          resolve(`/mensagem/${uid},${interlocutor}`);
        }
        else {
          let user2Ref = this.db.object(`/mensagem/${interlocutor},${uid}`, { preserveSnapshot: true });
          user2Ref.subscribe(snapshot => {
            resolve(`/mensagem/${interlocutor},${uid}`);
          });
        }
      });
    });
  }


}


