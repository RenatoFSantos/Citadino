import { MensagemPage } from './../mensagem/mensagem';
import { UsuarioService } from './../../providers/service/usuario-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { MensagemService } from './../../providers/service/mensagem-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { SmartsiteVO } from './../../model/smartSiteVO';
import { SmartSiteService } from './../../providers/service/smartSite-services';
import { EmpresaVO } from './../../model/empresaVO';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, LoadingController, ModalController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-smartSite',
  templateUrl: 'smartSite.html'
})
export class SmartSitePage {

  public smartSite: SmartsiteVO;
  public empresa: EmpresaVO;
  public enderecoCompleto: string;
  public exibirBtnEnviarMensagem: boolean = false;

  private options: InAppBrowserOptions = {
    location: 'yes',//Or 'no' 
    hidden: 'no', //Or  'yes'
    clearcache: 'yes',
    clearsessioncache: 'yes',
    zoom: 'yes',//Android only ,shows browser zoom controls 
    hardwareback: 'yes',
    mediaPlaybackRequiresUserAction: 'no',
    shouldPauseOnSuspend: 'no', //Android only 
    closebuttoncaption: 'Close', //iOS only
    disallowoverscroll: 'no', //iOS only 
    toolbar: 'yes', //iOS only 
    enableViewportScale: 'no', //iOS only 
    allowInlineMediaPlayback: 'no',//iOS only 
    presentationstyle: 'pagesheet',//iOS only 
    fullscreen: 'yes',//Windows only    
  };

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public smartSrv: SmartSiteService,
    public mensSrv: MensagemService,
    private events: Events,
    private loadingCtrl: LoadingController,
    private emprSrv: EmpresaService,
    private mdlCtrl: ModalController,
    private usuaSrv: UsuarioService,
    private iab: InAppBrowser) {

    this.smartSite = navParams.get("smartSite");
    this.empresa = navParams.get("empresa");
    this.verificarStatusBtnMensagem();
  }

  ionViewDidEnter() {
    this.retornaEnderecoEmpresa();
  }

  public openMensagem() {
    let self = this;
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'

    });

    loader.present();

    let userCurrent = this.usuaSrv.getLoggedInUser();
    this.usuaSrv.getUserDetail(userCurrent.uid)
      .then((snapUserFrom) => {
        this.emprSrv.getUsuarioPorEmpresa(self.empresa.empr_sq_id)
          .then((snapKeyUserTo) => {
            let chaveKey: string = Object.keys(snapKeyUserTo.val())[0];
            self.usuaSrv.getUserDetail(chaveKey)
              .then((snapUserTo) => {

                let mensParam = {
                  usua_sq_logado: userCurrent.uid,
                  usua_sq_id_to: snapUserTo.key,
                  usua_nm_usuario_to: snapUserTo.val().usua_nm_usuario,
                  usua_sq_id_from: snapUserFrom.key,
                  usua_nm_usuario_from: snapUserFrom.val().usua_nm_usuario,
                  mens_nm_enviado: self.empresa.empr_nm_razaosocial,
                  mens_tx_logo_enviado: self.empresa.empr_tx_logomarca != '' ? self.empresa.empr_tx_logomarca : ''
                };

                let totalMensage: number = 0;
                self.usuaSrv.getMensagens().then((snapMsg) => {
                  snapMsg.forEach(element => {

                    if (element.val() == true) {
                      totalMensage++;
                    }

                    self.events.publish('mensagem:nova', totalMensage - 1);
                  });
                });

                loader.dismiss();
                let loginModal = self.mdlCtrl.create(MensagemPage, mensParam);
                loginModal.present();

              });
          });
      });
  }

  public discar(number: string) {
    CtdFuncoes.discarTelefone(number);
  }

  private retornaEnderecoEmpresa() {
    this.enderecoCompleto = '';

    this.enderecoCompleto = this.empresa.empr_tx_endereco +
      " - " +
      this.empresa.empr_tx_cidade +
      "/" +
      this.empresa.empr_sg_uf;
  }

  public verificarStatusBtnMensagem() {
    let usuaEmprKey: string;
    let userCurrent = this.usuaSrv.getLoggedInUser();

    this.emprSrv.getUsuarioPorEmpresa(this.empresa.empr_sq_id)
      .then((snapKeyUserTo) => {
        if (snapKeyUserTo.exists()) {
          usuaEmprKey = Object.keys(snapKeyUserTo.val())[0];

          if (this.empresa.empr_in_mensagem == true
            && userCurrent.uid != usuaEmprKey) {
            this.exibirBtnEnviarMensagem = true;
          }
        }
      });
  }

  launch() {
    let target = "_system";
    var url:string = "http://" + this.empresa.empr_ds_site;
    const browser = this.iab.create(url, target, this.options);
  }
}
