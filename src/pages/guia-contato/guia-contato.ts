import { MensagemPage } from './../mensagem/mensagem';
import { UsuarioService } from './../../providers/service/usuario-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { MensagemService } from './../../providers/service/mensagem-service';
import { EmpresaVO } from './../../model/empresaVO';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events, LoadingController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-guia-contato',
  templateUrl: 'guia-contato.html'
})
export class GuiaContatoPage {

  public empresa: EmpresaVO = null;

  constructor(private navParams: NavParams,
    private viewCtrl: ViewController,
    private mensSrv: MensagemService,
    private events: Events,
    private loadingCtrl: LoadingController,
    private emprSrv: EmpresaService,
    private mdlCtrl: ModalController,
    private usuaSrv:UsuarioService) {

    this.empresa = navParams.get("empresa");
  }

  public discar(number: string) {
    CtdFuncoes.discarTelefone(number);
  }

  public openMensagem() {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    let self = this;
    let userCurrent = this.usuaSrv.getLoggedInUser();
    this.usuaSrv.getUserDetail(userCurrent.uid)
      .then((snapUserFrom) => {
        this.emprSrv.getUsuarioPorEmpresa(this.empresa.empr_sq_id)
          .then((snapKeyUserTo) => {
            let chaveKey: string = Object.keys(snapKeyUserTo.val())[0];
            this.usuaSrv.getUserDetail(chaveKey)
              .then((snapUserTo) => {

                let mensParam = {
                  usua_sq_logado: userCurrent.uid,
                  usua_sq_id_to: snapUserTo.key,
                  usua_nm_usuario_to: snapUserTo.val().usua_nm_usuario,
                  usua_sq_id_from: snapUserFrom.key,
                  usua_nm_usuario_from: snapUserFrom.val().usua_nm_usuario,
                  mens_nm_enviado: this.empresa.empr_nm_razaosocial,
                  mens_tx_logo_enviado: this.empresa.empr_tx_logomarca
                };
                // mensagem.mens_nova = false;

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

              });
          });
      });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


