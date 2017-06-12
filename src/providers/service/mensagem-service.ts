import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseService } from './../database/firebase-service';
import { UsuarioService } from './usuario-service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MensagemService {

  private mensagemRef: any;
  constructor(public usuaSrv: UsuarioService, public db: AngularFireDatabase) { }

  public addMensagems(uid, interlocutor) {
    // Primeiro Usuário
    let user1 = this.db.object(`/usuario/${uid}/mensagem/${interlocutor}`);
    user1.set(new Date().getTime());
  
    // Segundo Usuário
    let user2 = this.db.object(`/usuario/${interlocutor}/mensagem/${uid}`);
    user2.set(new Date().getTime());
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
            // if (!snapshot.exists()) {
            //   this.addMensagems(uid, interlocutor);
            // }             
            resolve(`/mensagem/${interlocutor},${uid}`);
          });
        }
      });
    });
  }
}


