import { AnuncioSorteioCrudPage } from './../anuncio-sorteio-crud/anuncio-sorteio-crud';
import { SorteioCriadoService } from './../../providers/service/sorteio-criado-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { NotificacaoService } from './../../providers/service/notificacao-service';
import { TokenDeviceService } from './../../providers/service/token-device';
import { AnuncioPromocaoDetalhePage } from './../anuncio-promocao-detalhe/anuncio-promocao-detalhe';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { VitrineVO } from './../../model/vitrineVO';
import { UsuarioVO } from './../../model/usuarioVO';
import { CupomVO } from './../../model/cupomVO';
import { VitrineService } from './../../providers/service/vitrine-service';
import { CupomService } from './../../providers/service/cupom-service';
import { MappingsService } from './../../providers/service/_mappings-service';
import { ItemsService } from './../../providers/service/_items-service';
import { GlobalVar } from './../../shared/global-var';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { Promise } from 'firebase/app';
import * as enums from './../../model/dominio/ctdEnum';

@Component({
  selector: 'page-anuncio-sorteio',
  templateUrl: 'anuncio-sorteio.html',
})
export class AnuncioSorteioPage {

  private cupons: any = [];
  private usuario: UsuarioVO;
  private toastAlert: any;
  private loadCtrl: any = null;

  public titulo: string = "Meus Anúncios"

  constructor(private events: Events, private navCtrl: NavController,
    private navParams: NavParams, private mdlCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private cupoCriaSrv: SorteioCriadoService, private glbVar: GlobalVar,
    private itemsService: ItemsService, private mapSrv: MappingsService,
    private toastCtrl: ToastController, private tokenSrv: TokenDeviceService,
    private notifSrv: NotificacaoService) {

    this.usuario = this.glbVar.usuarioLogado;

  }

  ionViewDidLoad() {
    this.excluirCupomEvent();
    this.carregaPromocoesEvent();
    this.publicarPromocaoEvent();
    this.closeEvent();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('anuncio_close:true', null);
    this.events.unsubscribe('carregaPromocoes:true', null);
    this.events.unsubscribe('publicarCupom', null);
    this.events.unsubscribe('excluirCupom', null);
  }

  ionViewWillEnter() {

    this.loadCtrl = this.loadingCtrl.create({
      spinner: 'circles'
    });

    this.loadCtrl.present();

    this.carregaPromocoes();
  }

  public adicionarSorteio() {
    let promocaoCrud = this.mdlCtrl.create(AnuncioSorteioCrudPage);
    promocaoCrud.present();
  }

  private carregaPromocoes() {
    let self = this;
    this.cupons = [];

    this.cupoCriaSrv.getCupomRef().once("value").then((snapShot) => {
      if (snapShot.exists()) {
        this.cupoCriaSrv.getCupons().then((snapPublic) => {
          snapPublic.forEach(element => {
            var pkCupom = element.val().cupo_sq_id;
            let newCupom: CupomCriadoVO = self.mapSrv.getCupomCriado(element.val());
            self.itemsService.addItemToStart(self.cupons, newCupom);
          });
        }).catch((error) => {
          self.loadCtrl.dismiss();
        });
        self.loadCtrl.dismiss();
      }
      else {
        self.loadCtrl.dismiss();
      }
    }).catch((error) => {
      self.loadCtrl.dismiss();
    });
  }

  public carregaPromocoesEvent() {
    let self = this;
    this.events.subscribe('carregaPromocoes:true', () => {
      this.cupons = [];
      this.carregaPromocoes();
    });
  }

  // private salvarCupom = function (param) {
  //   let self = param.self;
  //   let cupom = param.cupom;

  //   let promise = new Promise(function (resolve, reject) {
  //     cupom.cupo_sq_ordem = String(new Date().getTime());
  //     self.cupoSrv.salvar(cupom).then(() => {
  //       resolve({ self, cupom });
  //     })
  //       .catch((error) => {
  //         reject(error);
  //       });
  //   })

  //   return promise;
  // }

  private publicarPromocaoEvent() {
    let self = this;
    var updates = {};

    this.events.subscribe('publicarCupom', (cupom: CupomCriadoVO) => {

      let loader = this.loadingCtrl.create({
        spinner: 'circles'
      });

      loader.present();

      var dtAtual = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
      var newOrder = String(new Date().getTime());
    
      cupom.cupo_dt_publicado = new Date;

      updates['/sorteiocriado/' + cupom.cupo_sq_id + '/cupo_dt_publicado'] = dtAtual;
      updates['/sorteioativo/' + cupom.cupo_sq_id] = true;

      self.cupoCriaSrv.getDataBaseRef().update(updates).then(() => {

        var msg: string = "";
        msg = '<h5>'
        msg = msg + 'Lançamos um novo sorteio para você ! <br><br>'
        msg = msg + 'Para participar consulte as regras em nossos canais de atendimento.' + '<br>'
        msg = msg + '</h5>'

        var dadosNotif = {
          titulo: 'Sorteio Citadino !!!',
          descricao: msg
        }

        self.enviarNotificacao(cupom.cupo_tx_titulo, dadosNotif);

        loader.dismiss();
        self.createAlert("Publicação realizada com sucesso.");
      })
        .catch((err) => {
          loader.dismiss();
          this.createAlert("Não foi possível publicar.");
        });
    });
  }

  public excluirCupomEvent() {

    let self = this;
    this.events.subscribe("excluirCupom", (cupom: CupomCriadoVO) => {

      if (cupom != null) {

        self.loadCtrl = this.loadingCtrl.create({
          spinner: 'circles'
        });

        self.loadCtrl.present();

        // var usuaKey: string = self.usuario.usua_sq_id;
        // var cupoKey: string = cupom.cupo_sq_id;

        self.excluirCupom(cupom)
          .then((result) => {
            self.carregaPromocoes();

            var urlImagem = cupom.cupo_tx_urlimagem;
            var httpsReference = self.cupoCriaSrv.getStorage().refFromURL(urlImagem);
            self.cupoCriaSrv.getStorageRef().child(httpsReference.fullPath).delete();
          })
          .catch((error) => {
            self.createAlert(error.message);
          });
      }
    });
  }

  private excluirCupom = function (cupom: CupomCriadoVO) {
    var self = this;

    var promise = new Promise(function (resolve, reject) {
      self.cupoCriaSrv.excluir(cupom.cupo_sq_id)
        .then(() => {
          resolve({ self, cupom });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
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

  public openPromocao(cupom: CupomCriadoVO) {
    let self = this;
    let loader = this.loadingCtrl.create({
      spinner: 'circles'
    });

    loader.present();

    self.cupoCriaSrv.pesquisarCupomPorId(cupom.cupo_sq_id)
      .then((cupomSnap) => {
        var cupom = self.mapSrv.getCupomCriado(cupomSnap.val());
        let promocaoModal = this.mdlCtrl.create(AnuncioPromocaoDetalhePage,
          { cupom: cupom, isBtnPegarCupom: false, isBtnUsarCupom: false, isControleManual: true });
        loader.dismiss();
        promocaoModal.present();
      });
  }

  public isExcluirCupom(cupom: CupomCriadoVO): boolean {
    var result: boolean = false;

    if (cupom.cupo_dt_publicado == null) {
      result = true
    }
    else {
      result = !this.verificarIsValidade(cupom.cupo_dt_validade);
    }

    return result;
  }


  private verificarIsValidade(dataValidade: any): boolean {
    var result: boolean = true;

    var dataAtual: any = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);

    if (dataAtual > dataValidade) {
      result = false;
    }

    return result;
  }

  private closeEvent() {
    this.events.subscribe("anuncio_close:true", (result) => {
      if (result) {
        this.navCtrl.pop();
      }
    });
  }

  private enviarNotificacao(titulo: string, dadosNotif) {
    var self = this;

    self.pesquisarTokensNotificacao()
      .then((result: any) => {

        var tokens: string[] = result.tokens;

        if (tokens.length > 0) {
          self.notifSrv.sendUidMensagem(tokens, titulo, "Esse prémio pode ser seu. Não deixe de pegar o seu cupom !!!", dadosNotif).then(() => {
            // this.createAlert("Notificação enviada com sucesso.");
          }).catch((error) => {
            // this.createAlert("Não foi possível enviar a notificação.");
          });
        }
      })
  }

  private pesquisarTokensNotificacao = function () {
    var self = this;
    var tokens: string[] = [];
    var count = 0;

    var promise = new Promise(function (resolve, reject) {

      self.tokenSrv.getTokenDeviceRef().once("value")
        .then((snapTokens) => {
          if (snapTokens != null) {
            var values: any = Object.keys(snapTokens.val());

            values.forEach(element => {
              tokens.push(element);
              count++;
            });

            if (count == values.length) {
              resolve({ self, tokens });
            }
          }
          else {

            resolve({ self, tokens });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

}
