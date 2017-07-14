import { UsuarioService } from './../../providers/service/usuario-service';
import { FirebaseService } from './../../providers/database/firebase-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import * as enums from './../../model/dominio/ctdEnum';
import { MensagemService } from './../../providers/service/mensagem-service';
import { Component, ViewChild } from '@angular/core';
import { NavParams, Content } from 'ionic-angular';
import { FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-mensagem',
  templateUrl: 'mensagem.html'
})
export class MensagemPage {

  //Chave do usuario Logado
  usua_sq_logado: string

  usua_sq_id_to: string;
  usua_nm_usuario_to: string;
  usua_sq_id_from: string;
  usua_nm_usuario_from: string;
  mens_nm_enviado: string;
  mens_tx_logo_enviado: string;
  mens_txt_mensagem: string;
  mens_dt_data: string;

  mensagens: FirebaseListObservable<any>;

  @ViewChild(Content) content: Content;
  constructor(private params: NavParams,
    private mensSrv: MensagemService,
    private fbSrv: FirebaseService,
    private usuaSrv: UsuarioService) {

    this.usua_sq_logado = params.data.usua_sq_logado;
    this.usua_sq_id_to = params.data.usua_sq_id_to;
    this.usua_nm_usuario_to = params.data.usua_nm_usuario_to;
    this.usua_sq_id_from = params.data.usua_sq_id_from;
    this.usua_nm_usuario_from = params.data.usua_nm_usuario_from;
    this.mens_nm_enviado = params.data.mens_nm_enviado;
    this.mens_tx_logo_enviado = params.data.mens_tx_logo_enviado;
  }

  ionViewDidLoad() {
    this.mensSrv.getMensagens(this.usua_sq_id_from, this.usua_sq_id_to)
      .then((snapShot: any) => {

        this.usuaSrv.getUsersRef().child(this.usua_sq_id_from)
          .child('mensagem').child(this.usua_sq_id_to).once('value').then((snapNode) => {
            if (snapNode.exists()) {
              this.usuaSrv.getUsersRef().child(this.usua_sq_id_from)
                .child('mensagem')
                .child(this.usua_sq_id_to).set(false);
            }
          });
        this.mensagens = this.mensSrv.listMensagens(snapShot);
      });
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  enviarMensagem() {
    if (this.mens_txt_mensagem) {

      this.mens_dt_data = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.ptBR) + " - " + CtdFuncoes.convertTimeToStr(new Date());

      this.fbSrv.getDataBase().ref(`/usuario/${this.usua_sq_id_from}`)
        .once('value').then(snapShot => {

          if (!snapShot.child(`/mensagem/${this.usua_sq_id_to}`).exists()) {
            this.mensSrv.addMensagems(this.usua_sq_id_from, this.usua_sq_id_to);
          }
          else {
            this.fbSrv.getDataBase().ref(`/usuario/${this.usua_sq_id_to}/mensagem/${this.usua_sq_id_from}`).set(true);
          }

          let chat = {
            usua_sq_id_to: this.usua_sq_id_to,
            usua_nm_usuario_to: this.usua_nm_usuario_to,
            usua_sq_id_from: this.usua_sq_id_from,
            usua_nm_usuario_from: this.usua_nm_usuario_from,
            mens_nm_enviado: this.mens_nm_enviado,
            mens_txt_mensagem: this.mens_txt_mensagem,
            mens_tx_logo_enviado: this.mens_tx_logo_enviado,
            mens_dt_data: this.mens_dt_data,
            mens_in_mensagem: 'Mensagem'
          };

          this.mensagens.push(chat).then(() => {
            let update = {};

            update[`/usuario/${this.usua_sq_id_to}/mensagem/${this.usua_sq_id_from}`] = true;

            this.fbSrv.getDataBase().ref().update(update);

            this.mens_txt_mensagem = "";
            this.content.scrollToBottom();
          })
            .catch((error) => {
              console.log(error);
            });
        });

    }
  };

  statusMensagemEvent() {

  }
}
