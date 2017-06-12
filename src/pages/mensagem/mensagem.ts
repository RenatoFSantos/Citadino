import { FirebaseService } from './../../providers/database/firebase-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import * as enums from './../../model/dominio/ctdEnum';
import { MensagemService } from './../../providers/service/mensagem-service';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-mensagem',
  templateUrl: 'mensagem.html'
})
export class MensagemPage {

  mensagem: string;
  uid: string;
  interlocutor: string;
  nameFrom: string;
  pathImage: string;
  dateTime: string;
  user: string;
  mensagens: FirebaseListObservable<any>;

  @ViewChild(Content) content: Content;
  constructor(public params: NavParams,
    public mensSrv: MensagemService,
    public fbSrv: FirebaseService) {

    this.uid = params.data.uid;
    this.interlocutor = params.data.interlocutor;
    this.nameFrom = params.data.nameFrom;
    this.pathImage = params.data.pathImage;
    this.user = params.data.user;


    mensSrv.getMensagens(this.uid, this.interlocutor)
      .then((snapShot: any) => {

        this.mensagens = this.mensSrv.listMensagens(snapShot);
      });
  }



  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  enviarMensagem() {
    if (this.mensagem) {

      this.dateTime = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.ptBR) + " - " +
        CtdFuncoes.convertTimeToStr(new Date());

      let chat = {
        from: this.uid,
        mensagem: this.mensagem,
        type: 'mensagem',
        dateTime: this.dateTime,
        user: this.user
      };

      this.fbSrv.getDataBase().ref(`/usuario/${this.uid}`).once('value').then(snapShot => {
        if (!snapShot.child(`/mensagem/${this.interlocutor}`).exists()) {
          this.mensSrv.addMensagems(this.uid, this.interlocutor);
        }
        else {
          this.fbSrv.getDataBase().ref(`/usuario/${this.interlocutor}/mensagem/${this.uid}`).set(new Date().getTime());
        }

        this.mensagens.push(chat).then(() => {
          // let user1 = this.fbSrv.getDataBase().ref(`/usuario/${this.interlocutor}/mensagem/${this.uid}`)
          // .set(new Date().getTime());

          this.mensagem = "";
          this.content.scrollToBottom();
        });

      });

    }
  };
}
