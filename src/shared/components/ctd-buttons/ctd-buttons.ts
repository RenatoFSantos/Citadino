import { NoticiaFullPage } from './../../../pages/noticia-full/noticia-full';
import { AnuncioFullPage } from './../../../pages/anuncio-full/anuncio-full';
import { VitrineVO } from './../../../model/vitrineVO';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
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

  constructor(private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController) {
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
              this.createAlert("Ops!!! Não existe smartSite cadastrado.");
            }
          });
      }
    });
  }

  createAlert(errorMessage: string) {
    let toast = this.toastCtrl.create({
      message: errorMessage,
      duration: 4000,
      position: 'top'
    });

    toast.present();
  }
}
