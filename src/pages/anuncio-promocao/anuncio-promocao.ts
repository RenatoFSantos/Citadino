import { VitrineService } from './../../providers/service/vitrine-service';
import { CupomService } from './../../providers/service/cupom-service';
import { MappingsService } from './../../providers/service/_mappings-service';
import { ItemsService } from './../../providers/service/_items-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { GlobalVar } from './../../shared/global-var';
import { CupomCriadoService } from './../../providers/service/cupom-criado-service';
import { Component } from '@angular/core';
import { NavController, NavParams, Events, ModalController, LoadingController } from 'ionic-angular';
import { AnuncioPromocaoCrudPage } from '../anuncio-promocao-crud/anuncio-promocao-crud';
import { Promise } from 'firebase/app';


@Component({
  selector: 'page-anuncio-promocao',
  templateUrl: 'anuncio-promocao.html',
})
export class AnuncioPromocaoPage {

  private cupons: any = [];
  private usuario: any;
  private toastAlert: any;

  public titulo: string = "Meus Anúncios"

  constructor(private events: Events, private navCtrl: NavController,
    private navParams: NavParams, private mdlCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private cupoCriaSrv: CupomCriadoService, private glbVar: GlobalVar,
    private itemsService: ItemsService, private mapSrv: MappingsService,
    private cupoSrv: CupomService, private vitrSrv:VitrineService) {

    this.usuario = this.glbVar.usuarioLogado;
  }

  ionViewDidLoad() {
    this.carregaPromocoesEvent();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('carregaPromocoes:true', null);
  }

  ionViewWillEnter() {
    this.carregaPromocoes();
  }

  public adicionarPromocao() {
    let promocaoCrud = this.mdlCtrl.create(AnuncioPromocaoCrudPage);
    promocaoCrud.present();
  }

  private carregaPromocoes() {
    let self = this;
    this.cupons = [];

    var loadCtrl = this.loadingCtrl.create({
      spinner: 'circles'
    });

    loadCtrl.present();

    this.cupoCriaSrv.getCupomRef().once("value").then((snapShot) => {
      if (snapShot.exists()) {
        this.cupoCriaSrv.getPromocoesPorUsuario(self.usuario.usua_sq_id).then((snapPublic) => {
          snapPublic.forEach(element => {
            var pkCupom = element.val().cupo_sq_id;
            let newCupom: CupomCriadoVO = self.mapSrv.getCupomCriado(element.val());
            // newCupom.cupo_nr_vlcomdesconto = self.getVlDesconto(newCupom);
            self.itemsService.addItemToStart(self.cupons, newCupom);
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

  private publicarPromocaoEvent() {
    let self = this;
    this.events.subscribe('publicarPromocao:true', (cupom) => {

    });
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

  private salvarVitrine = function (self, cupom) {
    let promise = new Promise(function (resolve, reject) {
      // let newKey = self.vitrSrv.
    });
  }
}
