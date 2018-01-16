import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { VitrineVO } from './../../model/vitrineVO';
import { UsuarioVO } from './../../model/usuarioVO';
import { CupomVO } from './../../model/cupomVO';
import { VitrineService } from './../../providers/service/vitrine-service';
import { CupomService } from './../../providers/service/cupom-service';
import { MappingsService } from './../../providers/service/_mappings-service';
import { ItemsService } from './../../providers/service/_items-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { GlobalVar } from './../../shared/global-var';
import { CupomCriadoService } from './../../providers/service/cupom-criado-service';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { AnuncioPromocaoCrudPage } from '../anuncio-promocao-crud/anuncio-promocao-crud';
import { Promise } from 'firebase/app';
import * as enums from './../../model/dominio/ctdEnum';


@Component({
  selector: 'page-anuncio-promocao',
  templateUrl: 'anuncio-promocao.html',
})
export class AnuncioPromocaoPage {

  private cupons: any = [];
  private usuario: UsuarioVO;
  private toastAlert: any;
  private loadCtrl: any = null;

  public titulo: string = "Meus Anúncios"

  constructor(private events: Events, private navCtrl: NavController,
    private navParams: NavParams, private mdlCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private cupoCriaSrv: CupomCriadoService, private glbVar: GlobalVar,
    private itemsService: ItemsService, private mapSrv: MappingsService,
    private cupoSrv: CupomService, private vitrSrv: VitrineService,
    private toastCtrl: ToastController) {

    this.usuario = this.glbVar.usuarioLogado;
  }

  ionViewDidLoad() {
    this.excluirCupomEvent();
    this.carregaPromocoesEvent();
    this.publicarPromocaoEvent();
  }

  ionViewWillUnload() {
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

  public adicionarPromocao() {
    let promocaoCrud = this.mdlCtrl.create(AnuncioPromocaoCrudPage);
    promocaoCrud.present();
  }

  private carregaPromocoes() {
    let self = this;
    this.cupons = [];

    this.cupoCriaSrv.getCupomRef().once("value").then((snapShot) => {
      if (snapShot.exists()) {
        this.cupoCriaSrv.getPromocoesPorUsuario(self.usuario.usua_sq_id).then((snapPublic) => {
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

  private getVlDesconto(cupom: CupomCriadoVO): number {
    var valorDesconto: number = 0.00;

    if (cupom.cupo_nr_desconto > 0 && cupom.cupo_nr_vlatual > 0) {
      valorDesconto = (cupom.cupo_nr_vlatual - (cupom.cupo_nr_vlatual * (cupom.cupo_nr_desconto / 100)));
    }
    return valorDesconto;
  }

  private salvarCupom = function (param) {
    let self = param.self;
    let cupom = param.cupom;

    let promise = new Promise(function (resolve, reject) {
      cupom.cupo_sq_ordem = String(new Date().getTime());
      self.cupoSrv.salvar(cupom).then(() => {
        resolve({ self, cupom });
      })
        .catch((error) => {
          reject(error);
        });
    })

    return promise;
  }

  private publicarPromocaoEvent() {
    let self = this;
    var vitrineKey: string = "";
    var vitrine: VitrineVO = null;
    var updates = {};

    this.events.subscribe('publicarCupom', (cupom: CupomCriadoVO) => {
      if (cupom != null) {

        let loader = this.loadingCtrl.create({
          content: 'Aguarde...',
          dismissOnPageChange: true
        });

        var dtAtual = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
        var newOrder = String(new Date().getTime());

        if (cupom.cupo_dt_publicado == null) {
          vitrine = self.mapSrv.copyCupomForVitrine(cupom);
          vitrineKey = self.vitrSrv.getNewUidVitrine(cupom.empresa.municipio.muni_sq_id)

          vitrine.vitr_sq_id = vitrineKey;
          vitrine.vitr_dt_agendada = dtAtual;
          vitrine.vitr_sq_ordem = newOrder;

          updates['/cupomcriado/' + self.usuario.usua_sq_id + '/' + cupom.cupo_sq_id + '/vitr_sq_id'] = vitrineKey;

          updates['/cupomcriado/' + self.usuario.usua_sq_id + '/' + cupom.cupo_sq_id + '/cupo_dt_publicado'] = dtAtual;

          updates['/vitrine/' + vitrine.muni_sq_id + '/' + vitrine.vitr_sq_id] = vitrine;

          self.cupoCriaSrv.getDataBaseRef().update(updates).then(() => {
            loader.dismiss();
            self.createAlert("Publicação realizada com sucesso.");
          })
            .catch((err) => {
              loader.dismiss();
              this.createAlert("Não foi possível publicar.");
            });

        } else {

          self.vitrSrv.getVitrineByKey(vitrine.muni_sq_id, vitrine.vitr_sq_id)
            .then((snapVitrine) => {

              if (snapVitrine.val() != null) {

                updates['/vitrine/' + vitrine.muni_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_dt_agendada'] = dtAtual;

                updates['/vitrine/' + vitrine.muni_sq_id + '/' + vitrine.vitr_sq_id + '/vitr_sq_ordem'] = newOrder;

                self.cupoCriaSrv.getDataBaseRef().update(updates);
              }

              loader.dismiss();
              self.createAlert("Publicação realizada com sucesso.");
            })
            .catch((err) => {
              loader.dismiss();
              this.createAlert("Não foi possível publicar.");
            });
        }
      }
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

        var usuaKey: string = self.usuario.usua_sq_id;
        var cupoKey: string = cupom.cupo_sq_id;

        self.cupoCriaSrv.excluir(usuaKey, cupoKey).then(() => {

          self.carregaPromocoes();

          var urlImagem = cupom.cupo_tx_urlimagem;
          var httpsReference = self.cupoCriaSrv.getStorage().refFromURL(urlImagem);
          self.cupoCriaSrv.getStorageRef().child(httpsReference.fullPath).delete();

        });
      }

    });
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
