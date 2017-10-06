import { NoticiaFullPage } from './../noticia-full/noticia-full';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { SmartSitePage } from './../smartSite/smartSite';
import { SmartsiteVO } from './../../model/smartSiteVO';
import { SmartSiteService } from './../../providers/service/smartSite-services';
import { EmpresaService } from './../../providers/service/empresa-service';
import { EmpresaVO } from './../../model/empresaVO';
import { MappingsService } from './../../providers/service/_mappings-service';
import { ItemsService } from './../../providers/service/_items-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { MinhaVitrineService } from './../../providers/service/minha-vitrine-service';
import { VitrineVO } from './../../model/vitrineVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-minha-vitrine',
  templateUrl: 'minha-vitrine.html',
})
export class MinhaVitrinePage {

  private vitrines: Array<VitrineVO> = [];
  private usuario: any;
  private toastAlert: any;

  constructor(private minhaVitrineSrv: MinhaVitrineService,
    private usuaSrv: UsuarioService,
    private events: Events,
    private itemsService: ItemsService,
    private mappingsService: MappingsService,
    public loadingCtrl: LoadingController,
    private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController) {

    this.usuario = this.usuaSrv.getLoggedInUser();
  }

  ionViewDidLoad() {
    this.excluirVitrineEvent();
    this.carregaMinhaVitrine();

  }

  private carregaMinhaVitrine() {
    let self = this;
    this.minhaVitrineSrv.getMinhaVitrinePorUsuario(this.usuario.uid).then((snapVitrines) => {
      if (snapVitrines != null) {
        snapVitrines.forEach(item => {
          var pkVitrine = item.val().vitr_sq_id;
          let newVitrine: VitrineVO = self.mappingsService.getVitrine(item.val(), pkVitrine);

          newVitrine.anun_nr_salvos = 1;
          this.vitrines.push(newVitrine);
        });
      }
    });
  }

  public excluirVitrineEvent() {
    let self = this;
    this.events.subscribe('excluirVitrine:true', (result) => {
      if (result != null) {
        self.itemsService.removeItemFromArray(self.vitrines, result);
      }
    });
  }

  openPage(vitrine: VitrineVO) {
    if (vitrine.anun_tx_urlslide1 != null && vitrine.anun_tx_urlslide1 != "") {
      this.openSlideNoticia(vitrine);
    }
    else {
      this.openSmartSite(vitrine);
    }
  }

  private openSmartSite(vitrine: VitrineVO) {
    if (vitrine.anun_in_smartsite == true) {
      let loader = this.loadingCtrl.create({
        content: 'Aguarde...',
        dismissOnPageChange: true
      });

      loader.present();
      this.emprSrv.getEmpresaPorKey(vitrine.empr_sq_id).then((snapEmpresa) => {
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
                this.createAlert("Ops!!! Não existe smartSite cadastrado.");
              }
            });
        }
      });
    }
  }

  private openSlideNoticia(vitrine: VitrineVO): void {
    this.navCtrl.push(AnuncioFullPage, { anuncio: vitrine });
  }

  openNoticia(vitrine: VitrineVO) {
    this.navCtrl.push(NoticiaFullPage, { vitrine: vitrine });
  }

  createAlert(errorMessage: string) {
    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 4000,
      position: 'top'
    });

    this.toastAlert.present();
  }

}
