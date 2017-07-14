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

  constructor(private usuaSrv: UsuarioService,
    private emprSrv: EmpresaService,
    private mdlCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private mensSrv: MensagemService) {
  }

  ionViewWillEnter() {
    this.loadMensagens();
  }

  ngOnInit() { }

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

    this.usuaSrv.getMensagens()
      .then((users) => {
        users.forEach(user => {
          let mensagem: MensagemVO = new MensagemVO();
          this.usuaSrv.getUserDetail(user.key).then((usuario) => {
            mensagem.usua_sq_id_from = this.usuaSrv.getLoggedInUser().uid;
            mensagem.usua_sq_id_to = usuario.val().usua_sq_id;
            mensagem.usua_nm_usuario_to = usuario.val().usua_nm_usuario
            mensagem.mens_nova = user.val();

            if (usuario.child('empresa').exists()) {
              usuario.child('empresa').forEach(itemEmpresa => {
                this.emprSrv.getEmpresaPorKey(
                  itemEmpresa.key).then((empresa) => {
                    mensagem.mens_nm_enviado = empresa.val().empr_nm_razaosocial;
                    mensagem.mens_tx_logo_enviado = empresa.val().empr_tx_logomarca;
                  });
              });
            }
            else {
              mensagem.mens_nm_enviado = usuario.val().usua_nm_usuario;
              mensagem.mens_tx_logo_enviado = usuario.val().usua_tx_urlprofile;
            }
            this.mensagens.push(mensagem);
          });
        });
        loader.dismiss();
      });
  }

  openMensagemPage(mensagem: MensagemVO) {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    let userCurrent = this.usuaSrv.getLoggedInUser();
    this.usuaSrv.getUserDetail(userCurrent.uid).then((snapUsuario) => {
      let usuario: UsuarioVO = snapUsuario.val();
      let mensParam = {
        usua_sq_logado: usuario.usua_sq_id,
        usua_sq_id_from: usuario.usua_sq_id,
        usua_nm_usuario_from: usuario.usua_nm_usuario,
        usua_sq_id_to: mensagem.usua_sq_id_to,
        usua_nm_usuario_to: mensagem.usua_nm_usuario_to,
        mens_nm_enviado: mensagem.mens_nm_enviado,
        mens_tx_logo_enviado: mensagem.mens_tx_logo_enviado != '' ? mensagem.mens_tx_logo_enviado : ''
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

}
