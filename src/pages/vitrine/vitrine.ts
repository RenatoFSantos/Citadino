import { UsuarioService } from './../../providers/service/usuario-service';
import { MinhaVitrineService } from './../../providers/service/minha-vitrine-service';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { NoticiaFullPage } from './../noticia-full/noticia-full';
import { SmartSiteService } from './../../providers/service/smartSite-services';
import { SmartSitePage } from './../smartSite/smartSite';
import { SmartsiteVO } from './../../model/smartSiteVO';
import { EmpresaVO } from './../../model/empresaVO';
import { EmpresaService } from './../../providers/service/empresa-service';
import { ItemsService } from './../../providers/service/_items-service';
import { MappingsService } from './../../providers/service/_mappings-service';
import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { VitrineVO } from './../../model/vitrineVO';
import { VitrineService } from './../../providers/service/vitrine-service';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, AlertController, Events, LoadingController, ToastController } from 'ionic-angular';


@Component({
  selector: 'page-vitrine',
  templateUrl: 'vitrine.html'
})

export class VitrinePage implements OnInit {

  public seqMunicipio: string = "-KoJyCiR1SOOUrRGimAS";
  private startPk: string = "";
  private limitPage: number = 10;
  private rowCount: number = 0;
  private rowCurrent: number = 0;
  private loading: boolean = false;
  private loadCtrl: any;
  private toastAlert: any;

  private vitrines: Array<VitrineVO> = [];
  private newVitrines: Array<VitrineVO> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private globalVar: GlobalVar,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vitrineSrv: VitrineService,
    private netService: NetworkService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService,
    private toastCtrl: ToastController,
    private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    private minhaVitrineSrv: MinhaVitrineService,
    private usuaSrv: UsuarioService) {

    if (this.globalVar.getIsFirebaseConnected()) {

      this.loadCtrl = this.loadingCtrl.create({
        spinner: 'circles'
      });
      this.loadCtrl.present();

      this.vitrineSrv.getVitrineRef().once("value").then((snapShot) => {
        if (snapShot.exists()) {
          this.vitrineSrv.getVitrineRef().child(this.seqMunicipio).on('child_added', this.onVitrineAdded);
          this.loadVitrines();
          return true;
        }
        else {
          this.loadCtrl.dismiss();
          return false;
        }
      });

    } else {
      this.createAlert("Ops!!! Não estou conseguindo carregar a vitrine. Tente mais tarde!");
    }
  }

  public onVitrineAdded = (childSnapshot, prevChildKey) => {
    var self = this;
    var pkVitrine = childSnapshot.val().vitr_sq_id;

    if (this.vitrines != null && this.vitrines.length > 0) {
      let exist: boolean = this.vitrines.some(campo =>
        campo.vitr_sq_id == pkVitrine
      );

      if (!exist) {
        let newVitrine: VitrineVO = self.mappingsService.getVitrine(childSnapshot.val(), pkVitrine);
        this.newVitrines.push(newVitrine);
        this.events.publish('thread:created', this.newVitrines);
      }
    }
  }

  ionViewDidLoad() {
    this.excluirVitrineEvent();
    this.salvarVitrineEvent();
  }

  ionViewWillEnter() {
    // this.netService.getStatusConnection();
  }

  // ionViewDidLeave() {
  //   this.netService.closeStatusConnection();
  // }

  ngOnInit() {
  }

  loadVitrines() {
    var self = this;
    self.vitrines = [];
    self.vitrineSrv.getVitrineRefTotal(this.seqMunicipio).then((snapShot) => {
      self.rowCount = snapShot.numChildren();
      this.getVitrines().then(() => {
        this.loadCtrl.dismiss();
      });
    }).catch((error) => {
      this.loadCtrl.dismiss();
      console.log(error);
      self.rowCount = 0;
    })
  }

  getVitrines() {
    var self = this;

    if (self.limitPage > self.rowCount) {
      self.limitPage = self.rowCount;
    } else if (self.rowCurrent > 0 && self.limitPage > (self.rowCount - self.rowCurrent)) {
      self.limitPage = (self.rowCount - self.rowCurrent);
    } else if (self.rowCurrent > self.rowCount) {
      self.limitPage = self.rowCurrent - self.rowCount;
    } else if (self.rowCurrent > 0) {
      self.limitPage = self.limitPage + 1;
    }

    return new Promise((resolve) => {
      let anuncios: any = [];
      var uidUsuario: string = self.usuaSrv.getLoggedInUser().uid;

      self.vitrineSrv.getVitrineMunicipio(self.seqMunicipio, self.limitPage, self.startPk)
        .then((snapshot: any) => {

          anuncios = self.itemsService.getPropertyValues(snapshot.val(), "vitr_sq_ordem");

          self.startPk = String(self.itemsService.getFirstElement(anuncios));
          var lstVitrine: any = [];
          lstVitrine = self.itemsService.reversedItems<VitrineVO>(self.mappingsService.getVitrines(snapshot));

          lstVitrine.forEach(vitrine => {

            // });
            // .forEach(function (vitrine) {

            self.minhaVitrineSrv.pesquisaPorUidVitrine(uidUsuario, vitrine.vitr_sq_id)
              .then((vitrineSalva) => {

                if (vitrineSalva.val() != null) {
                  vitrine.anun_nr_salvos = 1;
                }
                else {
                  vitrine.anun_nr_salvos = 0;
                }

                let exist: boolean = self.vitrines.some(campo =>
                  campo.vitr_sq_id == vitrine.vitr_sq_id
                );

                if (!exist) {
                  self.vitrines.push(vitrine);
                }
              })
              .catch((error) => {
                console.log(error);
              });

            self.rowCurrent = self.vitrines.length;
          });
          resolve(true);
        });
    });
  }

  reloadVitrines(refresher) {

    if (this.newVitrines != null && this.newVitrines.length > 0) {
      this.loading = true;

      let addElement = new Promise((resolve) => {
        this.newVitrines.forEach(element => {
          this.vitrines.unshift(element);
        });

        this.loading = false;
        resolve(true);
      });

      addElement.then(() => {
        this.events.publish('threads:viewed');
        this.newVitrines = [];
        refresher.complete();
      });
    }
    else {
      this.loading = false;
      refresher.complete();
    }
  }

  doInfinite(infiniteScroll) {
    var self = this;
    if (self.rowCurrent < self.rowCount) {
      this.getVitrines().then(() => {
        infiniteScroll.complete();
      });
    }
    else {
      self.rowCurrent = self.rowCount;
      infiniteScroll.complete();
    }
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


  // showPromocao() {
  //   let confirm = this.alertCtrl.create({
  //     title: 'Parabéns!',
  //     message: 'Você ganhou este cupom de desconto!<br>Guarde este número para resgatar esta promoção!<br>CTDN943587220012',
  //     buttons: [
  //       {
  //         text: 'Obrigado!',
  //         handler: () => {
  //           console.log('Agree clicked');
  //         }
  //       }
  //     ]
  //   });
  //   confirm.present();
  // }


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


  private pesquisaUsuarioVitrineSalva = function (uidVitrine: string) {
    let self = this;
    var isSalvo: number = 0;

    var promise = new Promise(function (resolve, reject) {
      var uidUsuario: string = self.usuaSrv.getLoggedInUser().uid;

      self.minhaVitrineSrv.pesquisaPorUidVitrine(uidUsuario, uidVitrine).then((vitrineSalva) => {
        if (vitrineSalva.val() != null) {
          isSalvo = 1;
        }
        resolve(isSalvo);

      }).catch((error) => {
        reject(error);
      });
    });

    return promise;
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

  public salvarVitrineEvent() {
    let self = this;
    this.events.subscribe('salvarVitrine:true', (result: any) => {
      if (result != null) {
        var objResult: any = self.itemsService.findElement(self.vitrines, (v: any) => v.vitr_sq_id == result.vitr_sq_id);
        if (objResult != null) {
          objResult.anun_nr_salvos = 1;
        }
      }
    });
  }

  public excluirVitrineEvent() {
    let self = this;
    this.events.subscribe('excluirVitrine:true', (result: any) => {
      if (result != null) {
        var objResult: any = self.itemsService.findElement(self.vitrines, (v: any) => v.vitr_sq_id == result.vitr_sq_id);
        if (objResult != null) {
          objResult.anun_nr_salvos = 0;
        }
      }
    });
  }

}

