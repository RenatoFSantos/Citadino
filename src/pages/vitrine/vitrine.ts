import { UsuarioVO } from './../../model/usuarioVO';
import { MinhasPublicacoesService } from './../../providers/service/minhas-publicacoes';
import { VitrinePromocaoPage } from './../vitrine-promocao/vitrine-promocao';
import { VitrinePublicacaoPage } from './../vitrine-publicacao/vitrine-publicacao';

import { MeusMarcadosService } from './../../providers/service/meus_marcados-service';
import { SlideVO } from './../../model/slideVO';
import { UsuarioService } from './../../providers/service/usuario-service';
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
import { VitrineCurtirService } from '../../providers/service/vitrine-curtir-service';
import { Promise } from 'firebase/app';


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
  tab1Root: any = VitrinePublicacaoPage;
  tab2Root: any = VitrinePromocaoPage;

  private vitrines: Array<VitrineVO> = [];
  private newVitrines: Array<VitrineVO> = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    public globalVar: GlobalVar,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private vitrineSrv: VitrineService,
    private netService: NetworkService,
    private mappingsService: MappingsService,
    private itemsService: ItemsService,
    private toastCtrl: ToastController,
    private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    public meusMarcadosSrv: MeusMarcadosService,
    private usuaSrv: UsuarioService,
    private minhaPubSrv: MinhasPublicacoesService,
    private vtrCut: VitrineCurtirService) {

    this.loadVitrines();

  }

  loadVitrines() {
    var self = this;
    self.startPk = "";
    self.rowCount = 0;
    self.rowCurrent = 0;
    self.vitrines = [];

    if (this.globalVar.getIsFirebaseConnected()) {

      this.loadCtrl = this.loadingCtrl.create({
        spinner: 'circles'
      });
      this.loadCtrl.present();

      this.vitrineSrv.getVitrineRef().once("value").then((snapShot) => {
        if (snapShot.exists()) {
          this.vitrineSrv.getVitrineRef().child(this.seqMunicipio).on('child_added', this.onVitrineAdded);

          this.vitrineSrv.getVitrineRef().child(this.seqMunicipio).on('child_removed', this.onVitrineRemove);

          this.vitrineSrv.getVitrineRef().child(this.seqMunicipio).on('child_changed', this.onVitrineChange);

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
        else {
          this.loadCtrl.dismiss();
        }
      })
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

  public onVitrineRemove = (childSnapshot) => {
    var self = this;

    if (childSnapshot.val() != null) {
      var pkVitrine = childSnapshot.val().vitr_sq_id;
      let removeVitrine: VitrineVO = self.mappingsService.getVitrine(childSnapshot.val(), pkVitrine);

      var objResult: any = self.itemsService.findElement(self.newVitrines, (v: any) => v.vitr_sq_id == pkVitrine);

      if (objResult != null) {
        self.itemsService.removeItemFromArray(self.newVitrines, removeVitrine);
        this.events.publish('thread:created', this.newVitrines);
      } else {
        self.itemsService.removeItemFromArray(self.vitrines, removeVitrine);
      }
    }
  }

  public onVitrineChange = (childSnapshot, prevChildKey) => {

    var self = this;
    var pkVitrine = childSnapshot.val().vitr_sq_id;

    let exist: boolean = this.newVitrines.some(campo =>
      campo.vitr_sq_id == pkVitrine
    );

    if (!exist) {

      let oldVitrine: any = self.itemsService.findElement(self.vitrines, (v: any) => v.vitr_sq_id == pkVitrine);

      let newVitrine: VitrineVO = self.mappingsService.getVitrine(childSnapshot.val(), pkVitrine);

      if ((oldVitrine.anun_nr_visitas != newVitrine.anun_nr_visitas) || (oldVitrine.anun_nr_curtidas != newVitrine.anun_nr_curtidas)) {
        oldVitrine = this.mappingsService.copyVitrine(oldVitrine, newVitrine);

        if (newVitrine.usua_sq_id != "") {
          this.minhaPubSrv.atualizarDadosVitrine(newVitrine);
        }
      }
      else {
        this.newVitrines.push(newVitrine);
        this.events.publish('thread:created', this.newVitrines);

        if (self.vitrines != null && self.vitrines.length > 0) {
          self.itemsService.removeItems(self.vitrines, (v: any) => v.vitr_sq_id == pkVitrine);
        }
      }
    }
  }

  ionViewDidLoad() {
    this.marcarVitrineEvent();
    this.desmarcarVitrineEvent();
    this.bancoDadosOnlineEvent();
    this.atualizarNrVisitaEvent();
    this.curtirVitrineEvent();
    this.chutarCurtirEvent();
  }

  ionViewWillUnload() {
    // this.events.subscribe('excluirVitrine:true', null);
    this.events.unsubscribe('marcarVitrine:true', null);
    this.events.unsubscribe('desmarcarVitrine:true', null);
    this.events.unsubscribe('atualizarNrVisita:true', null);
    this.events.unsubscribe('curtirVitrine:true', null);
  }

  ngOnInit() { }

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
      var usuario: UsuarioVO = self.globalVar.usuarioLogado;

      self.vitrineSrv.getVitrineMunicipio(self.seqMunicipio, self.limitPage, self.startPk)
        .then((snapshot: any) => {

          anuncios = self.itemsService.getPropertyValues(snapshot.val(), "vitr_sq_ordem");

          self.startPk = String(self.itemsService.getFirstElement(anuncios));

          var lstVitrineOld: VitrineVO[] = self.mappingsService.getVitrines(snapshot);

          var lstVitrine: VitrineVO[] = [];
          lstVitrine = self.itemsService.reversedItems<VitrineVO>(lstVitrineOld);

          lstVitrine.forEach(vitrine => {

            self.statusVitrineMarcada(self, vitrine, usuario)
              .then(self.statusVitrineCurtida)
              .then((result) => {
                var vitrine: VitrineVO = result.vitrine;

                let exist: boolean = self.vitrines.some(campo =>
                  campo.vitr_sq_id == vitrine.vitr_sq_id
                );

                if (!exist) {
                  self.vitrines.push(vitrine);
                }

              })
              .catch(error => {
                throw new Error(error.message);
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
    this.vitrineSrv.atualizarNrVisita(vitrine);
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
    this.navCtrl.push(AnuncioFullPage, { slideParam: this.retornaLisSlide(vitrine), isExcluirImagem: false });
  }

  public openNoticia(vitrine: VitrineVO) {
    this.navCtrl.push(NoticiaFullPage, { vitrine: vitrine, slideParam: this.retornaLisSlide(vitrine) });
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

  public marcarVitrineEvent() {
    let self = this;
    this.events.subscribe('marcarVitrine:true', (result: any) => {
      if (result != null) {
        var objResult: any = self.itemsService.findElement(self.vitrines, (v: any) => v.vitr_sq_id == result.vitr_sq_id);
        if (objResult != null) {
          objResult.anun_nr_salvos = 1;
        }
      }
    });
  }

  public desmarcarVitrineEvent() {
    let self = this;
    this.events.subscribe('desmarcarVitrine:true', (result: any) => {
      if (result != null) {
        var objResult: any = self.itemsService.findElement(self.vitrines, (v: any) => v.vitr_sq_id == result.vitr_sq_id);
        if (objResult != null) {
          objResult.anun_nr_salvos = 0;
        }
      }
    });
  }

  public excluirVitrineEvent() {
    let self = this;

    console.log("Excluir vitrine evento");
    this.events.subscribe('excluirVitrine:true', (vitrine: VitrineVO) => {

      if (vitrine != null) {

        let loader = this.loadingCtrl.create({
          content: 'Aguarde...',
          dismissOnPageChange: true
        });

        loader.present();

        this.vitrineSrv.excluir(vitrine).then(() => {
          this.carregaListaImagens(self, vitrine)
            .then(this.excluirImages)
            .then(() => {
              this.createAlert("Publicação excluída com sucesso.");
              this.loadVitrines();
              loader.dismiss();
            });
        });
      }
    });
  }

  // public adicionarVitrine() {
  //   this.navCtrl.push(VitrineCrudPage);
  // }

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

  public exibirTextoVitrine(vitrine: VitrineVO) {
    vitrine.vitr_in_buttonmore = false;
  }

  private carregaListaImagens = function (self: any, vitrine: VitrineVO) {
    let promises: any = [];

    let slides: SlideVO[] = self.retornaLisSlide(vitrine);

    var promise = new Promise(function (resolve, reject) {

      if (slides != null && slides.length > 0) {

        slides.forEach(item => {
          var httpsReference = self.usuaSrv.getStorage().refFromURL(item.imageUrl);
          promises.push(self.vitrineSrv.getStorageRef().child(httpsReference.fullPath).delete());
        });
      }
      resolve({ promises, self });
    });

    return promise;
  }

  private excluirImages = function (listaImagens) {
    let self = listaImagens.self;
    let vitrineId = self.vitrineId
    let promises = listaImagens.promises;

    self.pathImagens = [];

    var promAll = Promise.all(promises)
      .then((values) => { }
      )
      .catch((err) => {
        throw new Error(err.message);
      });

    return promAll;
  }

  public bancoDadosOnlineEvent() {
    let self = this;
    this.events.subscribe('firebase:connected', (result: any) => {
      if (result == true) {
        setTimeout(() => {
          if (this.vitrines == null || (this.vitrines != null && this.vitrines.length == 0)) {
            this.loadVitrines();
          }
        }, 2500);
      }
    });
  }

  public atualizarNrVisitaEvent() {
    let self = this;
    this.events.subscribe('atualizarNrVisita:true', (vitrine: VitrineVO) => {
      this.vitrineSrv.atualizarNrVisita(vitrine);
    });
  }


  public chutarCurtirEvent() {
    var self = this;
    this.events.subscribe('chutarCurtir:true', (vitrine: VitrineVO) => {
      self.vitrineSrv.curtirVitrien(vitrine);
    });
  }

  public curtirVitrineEvent() {
    let self = this;
    let usuario: UsuarioVO = this.globalVar.usuarioLogado;

    this.events.subscribe('curtirVitrine:true', (vitrine: VitrineVO) => {
      self.vtrCut.getVitrineCurtirByKey(vitrine.vitr_sq_id, usuario.usua_sq_id).then((result) => {
        if (result.val() == null) {
          self.vtrCut.salvar(vitrine.vitr_sq_id, usuario.usua_sq_id, true).then(() => {
            self.vitrineSrv.curtirVitrien(vitrine);
          });
        }
      });
    });
  }


  private statusVitrineMarcada = function (self: any, vitrine: VitrineVO, usuario: UsuarioVO) {

    var promise = new Promise(function (resolve, reject) {

      self.meusMarcadosSrv.pesquisaPorUidVitrine(usuario.usua_sq_id, vitrine.vitr_sq_id)
        .then((vitrineSalva) => {

          if (vitrineSalva.val() != null) {
            vitrine.anun_nr_salvos = 1;
          }
          else {
            vitrine.anun_nr_salvos = 0;
          }

          resolve({ self, vitrine, usuario });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise
  }

  private statusVitrineCurtida = function (param) {
    let self = param.self;
    let vitrine: VitrineVO = param.vitrine;
    let usuario: UsuarioVO = param.usuario;

    var promise = new Promise(function (resolve, reject) {

      self.vtrCut.getVitrineCurtirByKey(vitrine.vitr_sq_id, usuario.usua_sq_id)
        .then((result) => {
          if (result.val() != null) {
            vitrine.anun_in_curtida = true;
          }
          else {
            vitrine.anun_in_curtida = false;
          }

          resolve({ self, vitrine, usuario });

        }).catch((error) => {
          return false;
        })

    });

    return promise;
  }
}

