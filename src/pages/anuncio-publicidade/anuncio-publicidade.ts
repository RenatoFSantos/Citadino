import { MunicipioVO } from './../../model/municipioVO';
import { UsuarioVO } from './../../model/usuarioVO';
import { VitrineCurtirService } from './../../providers/service/vitrine-curtir-service';
import { VitrineCrudPage } from './../vitrine-crud/vitrine-crud';
import { GlobalVar } from './../../shared/global-var';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { VitrineService } from './../../providers/service/vitrine-service';
import { MinhasPublicacoesService } from './../../providers/service/minhas-publicacoes';
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
import { IonicPage, NavController, NavParams, Events, LoadingController, ToastController, ModalController } from 'ionic-angular';
import * as enums from './../../model/dominio/ctdEnum';

@Component({
  selector: 'page-anuncio-publicidade',
  templateUrl: 'anuncio-publicidade.html',
})
export class AnuncioPublicidadePage {

  private vitrines: any = [];
  private usuario: any;
  private muniEmpr: MunicipioVO;
  private toastAlert: any;
  public titulo: string = "Meus Anúncios"

  constructor(private minhasPublicSrv: MinhasPublicacoesService,
    private usuaSrv: UsuarioService,
    private events: Events,
    private itemsService: ItemsService,
    private mapSrv: MappingsService,
    public loadingCtrl: LoadingController,
    private emprSrv: EmpresaService,
    private smartSrv: SmartSiteService,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private vitrineSrv: VitrineService,
    private globalVar: GlobalVar,
    private vtrCurt: VitrineCurtirService,
    private mdlCtrl: ModalController) {

    this.usuario = this.globalVar.usuarioLogado;
    this.getMunicipioEmpresa(this.usuario);
  }

  ionViewDidLoad() {
    this.publicarEvent();
    this.excluirVitrineEvent();
    this.carregaPublicacaoEvent();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('excluirPublicacao:true', null);
    this.events.unsubscribe('publicarVitrine:true', null);
    this.events.unsubscribe('carregaPublicacao:true', null);
  }

  ionViewWillEnter() {
    this.carregaMinhaVitrine();
  }

  private getMunicipioEmpresa(usuario: UsuarioVO) {
    let self = this;
    if (usuario.empresa != null) {
      this.emprSrv.getMunicipioEmpresaKey(usuario.empresa.empr_sq_id).then((snap) => {
        var emprKey:any = Object.keys(snap.val());
        self.muniEmpr = self.mapSrv.getMunicipio(snap.val()[emprKey]);
      })
    }
  }

  public adicionarVitrine() {
    let vitrineCrud = this.mdlCtrl.create(VitrineCrudPage);
    vitrineCrud.present();

    // this.navCtrl.push(VitrineCrudPage);
  }

  private carregaMinhaVitrine() {
    let self = this;
    this.vitrines = [];

    var loadCtrl = this.loadingCtrl.create({
      spinner: 'circles'
    });

    loadCtrl.present();

    this.minhasPublicSrv.getMinhasPublicacoesRef().once("value").then((snapShot) => {
      if (snapShot.exists()) {
        this.minhasPublicSrv.getMinhasPublicacoesPorUsuario(self.usuario.usua_sq_id)
          .once('value').then((snapPublic) => {
            snapPublic.forEach(element => {
              var pkVitrine = element.val().vitr_sq_id;
              let newVitrine: VitrineVO = self.mapSrv.getVitrine(element.val(), pkVitrine);
              self.itemsService.addItemToStart(self.vitrines, newVitrine);
            });
          }).catch((error) => {
            loadCtrl.dismiss();
          });
        loadCtrl.dismiss();
      }
      else {
        loadCtrl.dismiss();
      }
    }).catch((error) => {
      loadCtrl.dismiss();
    });
  }

  public onPublicacaoAdded = (childSnapshot, prevChildKey) => {
    var self = this;

    if (childSnapshot != null) {
      var pkVitrine = childSnapshot.val().vitr_sq_id;
      let newVitrine: VitrineVO = self.mapSrv.getVitrine(childSnapshot.val(), pkVitrine);
      self.itemsService.addItemToStart(self.vitrines, newVitrine);
    }
  }


  public openPage(vitrine: VitrineVO) {
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

    if (vitrine.anun_tx_urlslide4 != null && vitrine.anun_tx_urlslide4 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = vitrine.anun_tx_urlslide4;
      slides.push(slide);
    }


    return slides;
  }

  public publicarEvent() {
    let self = this;
    this.events.subscribe('publicarVitrine:true', (vitrine: VitrineVO) => {

      if (vitrine != null) {

        let loader = this.loadingCtrl.create({
          content: 'Aguarde...',
          dismissOnPageChange: true
        });

        var dtAtual = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
        var newOrder = String(new Date().getTime());
       
        self.vitrineSrv.getVitrineByKey(vitrine.muni_sq_id, vitrine.vitr_sq_id)
          .then((snapVitrine) => {
            let updates = {};

            vitrine.vitr_dt_agendada = dtAtual;
            vitrine.vitr_sq_ordem = newOrder;

            if (snapVitrine.val() != null) {

              updates['/minhaspublicacoes/' + self.usuario.usua_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_dt_agendada'] = dtAtual;
              updates['/minhaspublicacoes/' + self.usuario.usua_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_sq_ordem'] = newOrder;

              updates['/vitrine/' + vitrine.muni_sq_id+ '/' + vitrine.vitr_sq_id + '/vitr_dt_agendada'] = dtAtual;
              updates['/vitrine/' + vitrine.muni_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_sq_ordem'] = newOrder;

              self.minhasPublicSrv.getDataBaseRef().update(updates);

            }
            else {

              updates['/minhaspublicacoes/' + self.usuario.usua_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_dt_agendada'] = dtAtual;
              updates['/minhaspublicacoes/' + self.usuario.usua_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_sq_ordem'] = newOrder;
              updates['/vitrine/' + vitrine.muni_sq_id + '/' + vitrine.vitr_sq_id] = vitrine;

              self.minhasPublicSrv.getDataBaseRef().update(updates);
            }

            // self.vitrines = this.itemsService.orderBy(self.vitrines, ['vitr_sq_ordem'], ['desc'])

            loader.dismiss();
            self.createAlert("Publicação realizada com sucesso.");
            // self.navCtrl.pop();

          })
          .catch((err) => {
            loader.dismiss();
            this.createAlert("Não foi possível publicar.");
          });
      }
    });
  }

  public excluirVitrineEvent() {
    let self = this;
    this.events.subscribe('excluirPublicacao:true', (vitrine: VitrineVO) => {
      if (vitrine != null) {
        let loader = this.loadingCtrl.create({
          content: 'Aguarde...',
          dismissOnPageChange: true
        });

        loader.present();

        this.pesquisarVitrine(this, vitrine)
          .then(this.excluirVitrine)
          .then(() => {
            self.excluirPublicacao(self, vitrine)
              .then(() => {
                self.vtrCurt.excluir(vitrine.vitr_sq_id);
                self.vitrines = [];
                self.carregaMinhaVitrine();
                self.createAlert("Publicação excluída com sucesso.");
                loader.dismiss();
              });
          })
          .catch((err) => {
            console.log(err);
            loader.dismiss();
          });
      }
    });
  }

  private pesquisarVitrine = function (self: any, publicacao: VitrineVO) {

    let promise = new Promise(function (resolve, reject) {
      var vitrine: VitrineVO = null;

      self.vitrineSrv.getVitrineByKey(publicacao.muni_sq_id, publicacao.vitr_sq_id)
        .then((snapVtr) => {
          if (snapVtr.val() != null) {
            vitrine = self.mapSrv.getVitrine(snapVtr.val(), snapVtr.key);
            resolve({ self, publicacao, vitrine });
          }
          else {
            resolve({ self, publicacao, vitrine });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });

    return promise;
  }

  private excluirPublicacao = function (self: any, publicacao: VitrineVO) {
    var result: boolean = true;

    let promise = new Promise(function (resolve, reject) {

      if (publicacao != null) {
        self.carregaListaImagens(self, publicacao)
          .then(self.excluirImages)
          .then(() => {
            self.minhasPublicSrv.excluir(self.usuario.usua_sq_id, publicacao.vitr_sq_id).then(() => {
              resolve({ self, result });
            })
              .catch(err => {
                reject(err);
              });
          })
          .catch((err) => {
            reject(err);
          });
      }
      else {
        resolve([self, result]);
      }
    });

    return promise;
  }

  private excluirVitrine = function (param) {
    let self = param.self;
    let vitrine = param.vitrine;
    let publicacao = param.publicacao;

    var result: boolean = true;

    let promise = new Promise(function (resolve, reject) {

      if (vitrine != null) {
        self.vitrineSrv.excluir(vitrine).then(() => {
          resolve({ self, publicacao, result });
        })
          .catch(err => {
            reject(err);
          });

      }
      else {
        resolve({ self, publicacao, result });
      }
    });

    return promise;
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
    let promises = listaImagens.promises;

    self.pathImagens = [];

    var promAll = Promise.all(promises).then((values) => {
    })
      .catch(err => {
        throw new Error(err);
      });

    return promAll;
  }

  public carregaPublicacaoEvent() {
    let self = this;
    this.events.subscribe('carregaPublicacao:true', () => {
      this.vitrines = [];
      this.carregaMinhaVitrine();
    });
  }
}

 // private excluirVitrine = function (param) {
  //   let self = param.self;
  //   let vitrine = param.vitrine;
  //   let publicacao = param.publicacao;

  //   var result: boolean = true;

  //   let promise = new Promise(function (resolve, reject) {

  //     if (vitrine != null) {
  //       self.carregaListaImagens(self, vitrine)
  //         .then(self.excluirImages)
  //         .then(() => {
  //           self.vitrineSrv.excluir(vitrine).then(() => {
  //             resolve({ self, publicacao, result });
  //           })
  //             .catch(err => {
  //               reject(err);
  //             });
  //         })
  //         .catch((err) => {
  //           reject(err);
  //         }
  //         );
  //     }
  //     else {
  //       resolve({ self, publicacao, result });
  //     }
  //   });

  //   return promise;
  // }