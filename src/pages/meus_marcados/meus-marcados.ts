import { MeusMarcadosService } from './../../providers/service/meus_marcados-service';
import { SlideVO } from './../../model/slideVO';
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
import { VitrineVO } from './../../model/vitrineVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, LoadingController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-meus-marcados',
  templateUrl: 'meus-marcados.html',
})
export class MeusMarcadosPage {

  private vitrines: Array<VitrineVO> = [];
  private usuario: any;
  private toastAlert: any;

  constructor(private meusMarcadosSrv: MeusMarcadosService,
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
    this.desmarcarVitrineEvent();
    this.carregaMinhaVitrine();

  }

  private carregaMinhaVitrine() {
    let self = this;
    this.meusMarcadosSrv.getMeusMarcadosPorUsuario(this.usuario.uid).then((snapVitrines) => {
      if (snapVitrines != null) {
        snapVitrines.forEach(item => {
          var pkVitrine = item.val().vitr_sq_id;
          let newVitrine: VitrineVO = self.mappingsService.getVitrine(item.val(), pkVitrine);

          newVitrine.anun_nr_salvos = 1;
          self.vitrines.push(newVitrine);
        });

        self.vitrines = self.itemsService.reversedItems<VitrineVO>(self.vitrines);
      }
    });
  }

  public desmarcarVitrineEvent() {
    let self = this;
    this.events.subscribe('desmarcarVitrine:true', (result) => {
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
    this.navCtrl.push(AnuncioFullPage, { slideParam: this.retornaLisSlide(vitrine), isExcluirImagem:false });
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

    return slides;
  }

}
