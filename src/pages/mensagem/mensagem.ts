import { NotificacaoService } from './../../providers/service/notificacao-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { FirebaseService } from './../../providers/database/firebase-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import * as enums from './../../model/dominio/ctdEnum';
import { MensagemService } from './../../providers/service/mensagem-service';
import { Component, ViewChild } from '@angular/core';
import { NavParams, Content, ViewController } from 'ionic-angular';
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
  usua_tokens: Array<string> = [];

  private mensagens: FirebaseListObservable<any>;

  @ViewChild(Content) content: Content;
  constructor(private params: NavParams,
    private mensSrv: MensagemService,
    private fbSrv: FirebaseService,
    private usuaSrv: UsuarioService,
    private notifSrv: NotificacaoService,
    private viewCtrl: ViewController) {

    this.usua_sq_logado = params.data.usua_sq_logado;
    this.usua_sq_id_to = params.data.usua_sq_id_to;
    this.usua_nm_usuario_to = params.data.usua_nm_usuario_to;
    this.usua_sq_id_from = params.data.usua_sq_id_from;
    this.usua_nm_usuario_from = params.data.usua_nm_usuario_from;
    this.mens_nm_enviado = params.data.mens_nm_enviado;
    this.mens_tx_logo_enviado = params.data.mens_tx_logo_enviado;
    this.usua_tokens = params.data.usua_tokens;
  }

  ionViewDidLoad() {
    let self = this;
    this.mensSrv.getMensagens(self.usua_sq_id_from, self.usua_sq_id_to)
      .then((snapShot: any) => {

        self.usuaSrv.getUsersRef().child(self.usua_sq_id_from)
          .child('mensagem').child(self.usua_sq_id_to).once('value')
          .then((snapNode) => {
            if (snapNode.exists()) {
              self.usuaSrv.getUsersRef().child(self.usua_sq_id_from)
                .child('mensagem')
                .child(self.usua_sq_id_to).set(false);
            }
          });

        self.mensagens = self.mensSrv.listMensagens(snapShot);
        self.content.scrollToBottom();
      });
  }

  public getMensagens() {
    this.content.scrollToBottom();
    return this.mensagens;
  }

  ionViewDidEnter() {
    this.content.scrollToBottom();
  }

  enviarMensagem() {
    let self = this;
    if (this.mens_txt_mensagem) {

      this.mens_dt_data = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.ptBR) + " - " + CtdFuncoes.convertTimeToStr(new Date());

      this.fbSrv.getDataBase().ref(`/usuario/${this.usua_sq_id_from}`)
        .once('value').then(snapShot => {

          if (!snapShot.child(`/mensagem/${self.usua_sq_id_to}`).exists()) {
            self.mensSrv.addMensagems(self.usua_sq_id_from, self.usua_sq_id_to);
          }
          else {
            self.fbSrv.getDataBase().ref(`/usuario/${self.usua_sq_id_to}/mensagem/${self.usua_sq_id_from}`).set(true);
          }

          let chat = {
            usua_sq_id_to: self.usua_sq_id_to,
            usua_nm_usuario_to: self.usua_nm_usuario_to,
            usua_sq_id_from: self.usua_sq_id_from,
            usua_nm_usuario_from: self.usua_nm_usuario_from,
            mens_nm_enviado: self.mens_nm_enviado,
            mens_txt_mensagem: self.mens_txt_mensagem,
            mens_tx_logo_enviado: self.mens_tx_logo_enviado,
            mens_dt_data: self.mens_dt_data,
            mens_in_mensagem: 'Mensagem'
          };

          self.mensagens.push(chat).then(() => {
            let update = {};

            update[`/usuario/${self.usua_sq_id_to}/mensagem/${self.usua_sq_id_from}`] = true;

            self.fbSrv.getDataBase().ref().update(update);
            self.content.scrollToBottom();
            self.mens_txt_mensagem = "";

            if (self.usua_tokens != null && self.usua_tokens.length > 0) {
              self.notifSrv.sendUidMensagem(self.usua_tokens, CtdFuncoes.ellipsis(chat.usua_nm_usuario_from, 20), CtdFuncoes.ellipsis(chat.mens_txt_mensagem, 50), enums.eventTypePush.mensagem);
            }
          });
        });
    }
  };

  public close() {
    this.viewCtrl.dismiss();
  }
}
