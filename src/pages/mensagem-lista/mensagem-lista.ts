import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { MensagemPage } from './../mensagem/mensagem';
import { MensagemService } from './../../providers/service/mensagem-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { MensagemVO } from './../../model/mensagemVO';
import { EmpresaService } from './../../providers/service/empresa-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { Component, OnInit } from '@angular/core';
import { ModalController, LoadingController, Events } from 'ionic-angular';

@Component({
  selector: 'page-mensagem-lista',
  templateUrl: 'mensagem-lista.html'
})
export class MensagemListaPage implements OnInit {
  private mensagens: Array<MensagemVO> = [];
  public usuaSrvTest: any;

  constructor(public usuaSrv: UsuarioService,
    private emprSrv: EmpresaService,
    private mdlCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private mensSrv: MensagemService,
    private netService: NetworkService,
    private globalVar: GlobalVar) {
    this.usuaSrvTest = usuaSrv;
    
    this.eventoNovaMensagem();
  }

  ionViewWillEnter() {
    this.loadMensagens();
    // this.netService.getStatusConnection();
  }

  ngOnInit() { }

  ionViewDidLeave() {}

  public removeMensagem(usua_sq_id_to: string) {
    let userCurrent = this.usuaSrv.getLoggedInUser();
    this.usuaSrv.getUsersRef()
      .child(userCurrent.uid)
      .child("mensagem")
      .child(usua_sq_id_to).remove();
    this.loadMensagens();
  }

  private loadMensagens() {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    if (this.mensagens != null && this.mensagens.length > 0) {
      this.mensagens = [];
    }

    let self = this;
    this.firstMethod()
      .then(this.secondMethod)
      .then(this.thirdMethod)
      .then(() => {
        if (self.mensagens.length == 0) {
          let mensagem: MensagemVO = new MensagemVO();
          mensagem.usua_sq_id_from = '999999999999';
          mensagem.usua_sq_id_to = '';
          mensagem.usua_nm_usuario_to = '';
          mensagem.mens_nova = false;
          mensagem.mens_nm_enviado = 'Nenhuma conversa registrada'
          mensagem.mens_tx_logo_enviado = '';
          self.mensagens.push(mensagem);
        }
        loader.dismiss();
      });
  }

  //Retorna usuários que foram enviados mensagens
  firstMethod = function () {
    let self = this;
    var promise = new Promise(function (resolve, reject) {
      self.usuaSrv.getMensagens()
        .then(users => {
          resolve({ users, self });
        })
        .catch((error) => {
          reject(error)
        });
    });
    return promise;
  };

  //Retorna uma coleção de promisses com os dados completos dos usuarios
  secondMethod = function (firstPromise) {
    let self = firstPromise.self;
    let promises: any = [];
    let statusMensagem: any = [];
    self.mensagens = [];

    var promise = new Promise(function (resolve, reject) {
      firstPromise.users.forEach(user => {
        var promise = self.usuaSrvTest.getUserDetail(user.key);
        promises.push(promise);
      });
      resolve({ promises, statusMensagem, self });
    });

    return promise;
  };

  //Preenche a coleção de mensagens
  thirdMethod = function (secondPromise) {
    let promises = secondPromise.promises;
    let statusMensagem = secondPromise.statusMensagem;
    let self = secondPromise.self;

    var promAll = Promise.all(promises).then(values => {
      let mensagemNova: boolean = false;
      values.forEach((element: any) => {

        if (element != null && element.val() != null) {

          let mensagem: MensagemVO = new MensagemVO();

          if (self.globalVar.usuarioLogado.mensagem != null) {
            var keys = Object.keys(self.globalVar.usuarioLogado.mensagem);
            keys.forEach(itemKey => {
              if (itemKey == element.val().usua_sq_id) {
                mensagemNova = self.globalVar.usuarioLogado.mensagem[itemKey];
                return;
              }
            });
          }

          mensagem.usua_sq_id_from = self.usuaSrv.getLoggedInUser().uid;
          mensagem.usua_sq_id_to = element.val().usua_sq_id;
          mensagem.usua_nm_usuario_to = element.val().usua_nm_usuario
          mensagem.mens_nova = mensagemNova;

          if (element.child('empresa').exists()) {
            element.child('empresa').forEach(itemEmpresa => {
              self.emprSrv.getEmpresaPorKey(
                itemEmpresa.key).then((empresa) => {
                  mensagem.mens_nm_enviado = empresa.val().empr_nm_razaosocial;
                  mensagem.mens_tx_logo_enviado = empresa.val().empr_tx_logomarca;
                });
            });
          }
          else {
            mensagem.mens_nm_enviado = element.val().usua_nm_usuario;
            mensagem.mens_tx_logo_enviado = element.val().usua_tx_urlprofile;
          }

          self.mensagens.push(mensagem);
        }

      });
    });

    return promAll;
  };

  openMensagemPage(mensagem: MensagemVO) {
    let self = this;

    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    let userCurrent = this.usuaSrv.getLoggedInUser();
    this.usuaSrv.getUserDetail(userCurrent.uid).then((snapUsuario) => {
      let usuario: UsuarioVO = snapUsuario.val();
      let tokensUsuario: Array<string> = [];

      self.usuaSrv.getTokens(mensagem.usua_sq_id_to).then((snapToken) => {
        if (snapToken.val() != null) {
          snapToken.forEach((token: any) => {
            tokensUsuario.push(token.key);
          });
        }
      });


      let mensParam = {
        usua_sq_logado: usuario.usua_sq_id,
        usua_sq_id_from: usuario.usua_sq_id,
        usua_nm_usuario_from: usuario.usua_nm_usuario,
        usua_sq_id_to: mensagem.usua_sq_id_to,
        usua_nm_usuario_to: mensagem.usua_nm_usuario_to,
        mens_nm_enviado: mensagem.mens_nm_enviado,
        mens_tx_logo_enviado: mensagem.mens_tx_logo_enviado,
        usua_tokens: tokensUsuario
      };

      mensagem.mens_nova = false;

      let totalMensage: number = 0;
      this.usuaSrv.getMensagens().then((snapMsg) => {
        snapMsg.forEach(element => {

          if (element.val() == true) {
            totalMensage++;
          }
          this.events.publish('mensagem:nova', totalMensage - 1);
        });
      });

      loader.dismiss();
      let loginModal = this.mdlCtrl.create(MensagemPage, mensParam);
      loginModal.present();
    })
  }

  private eventoNovaMensagem() {
    var self = this;

    self.events.subscribe('mensagemLista:nova', (keyUsuario:any) => {
      if (self.mensagens != null && self.mensagens.length > 0) {
        self.mensagens.forEach(item => {

          if (item.usua_sq_id_to == keyUsuario) {
            item.mens_nova = true;

            return;
          }
        });
      }
    });
  }

}
