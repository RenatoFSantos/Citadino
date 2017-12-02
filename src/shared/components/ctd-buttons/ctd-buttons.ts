import { VitrineService } from './../../../providers/service/vitrine-service';
import { MinhasPublicacoesPage } from './../../../pages/minhas-publicacoes/minhas-publicacoes';
import { MeusMarcadosService } from './../../../providers/service/meus_marcados-service';
import { SlideVO } from './../../../model/slideVO';
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
  public vitrineSalva: number = 0;

  @Input()
  public usuarioVitrine: string = '';

  @Input()
  public isBtnRepublicar: Boolean = false;

  @Input()
  public isBtnNrVisita: Boolean = false;

  private usuarioLogado: string;
  private toastAlert: any;
  private confirmPublic: any;

  constructor(private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private usuaSrv: UsuarioService,
    private meusMarcadosSrv: MeusMarcadosService,
    private events: Events,
    private alertCtrl: AlertController,
    private vitrineSrv: VitrineService) {

    this.vitrine = null;
    this.usuarioLogado = this.usuaSrv.getLoggedInUser().uid;
  }

  openSlideNoticia(opcao: number, param: any): void {
    switch (opcao) {
      case 1:
        this.events.publish("atualizarNrVisita:true", (this.vitrine));
        this.navCtrl.push(AnuncioFullPage, { slideParam: this.retornaLisSlide(param), isExcluirImagem: false });
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
    this.emprSrv.getEmpresaPorKey(this.empresaKey).then((snapEmpresa) => {
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

  public marcarVitrine() {

    if (this.vitrineSalva == 0) {
      var uidUsuario: string = this.usuaSrv.getLoggedInUser().uid;
      this.meusMarcadosSrv.salvar(uidUsuario, this.vitrine);
      this.events.publish("marcarVitrine:true", (this.vitrine));
      this.createToast("Marcado com sucesso!");
    }
    else {
      this.desmarcarVitrine();
    }
  }

  public desmarcarVitrine() {
    let self = this;
    var uidUsuario: string = this.usuaSrv.getLoggedInUser().uid;
    var uidVitrine: string = this.vitrine.vitr_sq_id;

    this.meusMarcadosSrv.pesquisaPorUidVitrine(uidUsuario, uidVitrine).then((snapVitrine) => {
      if (snapVitrine != null && snapVitrine.numChildren() > 0) {
        var uid: string = Object.keys(snapVitrine.val()).toString();
        self.meusMarcadosSrv.excluir(uidUsuario, uid).then((excluido) => {
          if (excluido == true) {
            self.events.publish("desmarcarVitrine:true", (self.vitrine));
            self.createToast("Desmarcado com sucesso!");
          }
        }).catch(() => {
          self.createToast("Não foi possível excluir.");
        })
      }
    })
  }

  public showExclusao() {

    let confirm = this.alertCtrl.create({
      title: "Publicação",
      message: "Confirma a exclusão ?",
      buttons: [{
        text: "Sim",
        handler: () => {
          this.excluirPublicacao();
        }
      },
      {
        text: "Nao",
        handler: () => {
          // confirm.dismiss();
        }
      }
      ]
    })
    confirm.present();
  }


  public showPublicar() {

    this.confirmPublic = this.alertCtrl.create({
      title: "Publicação",
      message: "Confirma a publicação ?",
      buttons: [{
        text: "Sim",
        handler: () => {
          this.publicarVitrine();
        }
      },
      {
        text: "Nao",
        handler: () => {
          // confirm.dismiss();
        }
      }
      ]
    })

    this.confirmPublic.present();
  }

  private excluirPublicacao() {
    if (this.navCtrl.getActive().instance instanceof MinhasPublicacoesPage) {
      this.events.publish("excluirPublicacao:true", (this.vitrine));
    }
    else {
      this.events.publish("excluirVitrine:true", (this.vitrine));
    }
  }


  public publicarVitrine() {
    this.events.publish("publicarVitrine:true", (this.vitrine));
    this.vitrine = null;
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

  private retornaLisSlide(vitrine: VitrineVO): SlideVO[] {

    let slides: SlideVO[] = [];

    if (vitrine.anun_tx_urlslide1 != null && vitrine.anun_tx_urlslide1 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = vitrine.anun_tx_urlslide1;
      slides.push(slide);
    }

    if (vitrine.anun_tx_urlslide2 != null && vitrine.anun_tx_urlslide2 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = vitrine.anun_tx_urlslide2;
      slides.push(slide);
    }

    if (vitrine.anun_tx_urlslide3 != null && vitrine.anun_tx_urlslide3 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = vitrine.anun_tx_urlslide3;
      slides.push(slide);
    }

    if (vitrine.anun_tx_urlslide4 != null && vitrine.anun_tx_urlslide4 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = vitrine.anun_tx_urlslide4;
      slides.push(slide);
    }

    return slides;
  }


  public exibirBtnCrudVitrine(): Boolean {

    return this.usuarioVitrine == this.usuarioLogado;
  }

  public exibirBtnRepublicar(): Boolean {

    return this.isBtnRepublicar == true;
  }

  public exibirBtnVisitas(): Boolean {
    return this.isBtnNrVisita;
  }

}
