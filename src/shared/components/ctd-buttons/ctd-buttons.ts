import { MinhaVitrineService } from './../../../providers/service/minha-vitrine-service';
import { UsuarioService } from './../../../providers/service/usuario-service';
import { NoticiaFullPage } from './../../../pages/noticia-full/noticia-full';
import { AnuncioFullPage } from './../../../pages/anuncio-full/anuncio-full';
import { VitrineVO } from './../../../model/vitrineVO';
import { NavController, ToastController, LoadingController, Events, AlertController } from 'ionic-angular';
import { EmpresaVO } from './../../../model/empresaVO';
import { SmartSitePage } from './../../../pages/smartSite/smartSite';
import { SmartsiteVO } from './../../../model/smartSiteVO';
import { SmartSiteService } from './../../../providers/service/smartSite-services';
import { EmpresaService } from './../../../providers/service/empresa-service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-buttons',
  templateUrl: 'ctd-buttons.html'
})
export class CtdButtonsComponent {

  @Input()
  public urlSlide: string = '';

  @Input()
  public smartSite: boolean = false;

  @Input()
  public empresaKey: string = '';

  @Input()
  public vitrine: VitrineVO = null;

  @Input()
  public vitrineSalva:number = 0;

  private toastAlert: any;
  constructor(private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private usuaSrv: UsuarioService,
    private minhaVitrineSrv: MinhaVitrineService,
    private events: Events,
    private alertCtrl: AlertController) {
  }

  openSlideNoticia(opcao: number, param: any): void {
    switch (opcao) {
      case 1:
        this.navCtrl.push(AnuncioFullPage, { anuncio: param });
        break;
      case 2:
        this.navCtrl.push(NoticiaFullPage);
        break;
      default:
        break;
    }
  }

  public openSmartSite() {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();
    this.emprSrv.getEmpresaPorKey(this.empresaKey[0]).then((snapEmpresa) => {
      if (snapEmpresa != null) {
        let empresa: EmpresaVO = snapEmpresa.val();

        this.emprSrv.getSmartSitePorEmpresa(empresa.empr_sq_id)
          .then((snapSamrEmpr) => {
            if (snapSamrEmpr.exists()) {
              this.smartSrv.getSmartSiteByKey(Object.keys(snapSamrEmpr.val())[0])
                .then((snapSmart) => {
                  if (snapSmart.val() != null) {
                    let smartSite: SmartsiteVO;
                    smartSite = snapSmart.val();
                    this.navCtrl.push(SmartSitePage, { smartSite: smartSite, empresa: empresa });
                  }
                  loader.dismiss();
                });
            }
            else {
              loader.dismiss();
              this.createToast("Ops!!! Não existe smartSite cadastrado.");
            }
          });
      }
    });
  }

  public salvarVitrine() {

    if (this.vitrineSalva[0] == 0) {
      var uidUsuario: string = this.usuaSrv.getLoggedInUser().uid;
      this.minhaVitrineSrv.salvar(uidUsuario, this.vitrine);
      this.events.publish("salvarVitrine:true", (this.vitrine[0]));
      this.createToast("Marcado com sucesso!");
    }
    else {
      this.excluirVitrine();
    }
  }

  public excluirVitrine() {
    let self = this;
    var uidUsuario: string = this.usuaSrv.getLoggedInUser().uid;
    var uidVitrine: string = this.vitrine[0].vitr_sq_id;

    this.minhaVitrineSrv.pesquisaPorUidVitrine(uidUsuario, uidVitrine).then((snapVitrine) => {
      if (snapVitrine != null && snapVitrine.numChildren() > 0) {
        var uid: string = Object.keys(snapVitrine.val()).toString();
        self.minhaVitrineSrv.excluir(uidUsuario, uid).then((excluido) => {
          if (excluido == true) {
            self.events.publish("excluirVitrine:true", (self.vitrine[0]));
            self.createToast("Desmarcado com sucesso!");
          }
        }).catch(() => {
          self.createToast("Não foi possível excluir.");
        })
      }
    })
  }

  createToast(errorMessage: string) {
    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 2000,
      position: 'bottom'
    });

    this.toastAlert.present();
  }

  createAlert(mensagem: string) {
    const alert = this.alertCtrl.create({
      title: '',
      subTitle: mensagem
    });
    alert.present();

    setTimeout(() => {
      alert.dismiss();
    }, 1000);
  }

}
