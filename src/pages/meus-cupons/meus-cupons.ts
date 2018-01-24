import { Promise } from 'firebase/app';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { Events } from 'ionic-angular/util/events';
import { AnuncioPromocaoDetalhePage } from './../anuncio-promocao-detalhe/anuncio-promocao-detalhe';
import { CupomCriadoService } from './../../providers/service/cupom-criado-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { UsuarioSqlService } from './../../providers/database/usuario-sql-service';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { UsuarioCupomService } from './../../providers/service/usuario-cupom-service';
import { CupomService } from './../../providers/service/cupom-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { GlobalVar } from './../../shared/global-var';
import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { CupomVO } from './../../model/cupomVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
import { usuarioCupomVO } from '../../model/usuarioCupomVO';
import { PromocaoService } from '../../providers/service/promocao-service';
import * as enums from './../../model/dominio/ctdEnum';

@Component({
  selector: 'page-meus-cupons',
  templateUrl: 'meus-cupons.html',
})
export class MeusCuponsPage {

  public scannedText: string;
  public loading: boolean;
  public meusCupons: Array<CupomCriadoVO>;
  private usuario: UsuarioVO = null;
  private cnpj: string = "";
  private statusPromocao: boolean = false;
  private toastAlert: any;

  constructor(private emprSrv: EmpresaService,
    private mapSrv: MappingsService,
    private usuaCupSrv: UsuarioCupomService,
    private glabalVar: GlobalVar,
    private loadingCtrl: LoadingController,
    private promSrv: PromocaoService,
    private toastCtrl: ToastController,
    private meuCupomSqlSrv: UsuarioSqlService,
    private cupoCriaSrv: CupomCriadoService,
    private mdlCtrl: ModalController,
    private events: Events,
    private cupomSrv: CupomService) {

    var self = this;
    this.usuario = this.glabalVar.usuarioLogado;
    this.cnpj = "28039364000102";

  }

  ionViewDidLoad() {

    var self = this;
    this.carregaMeuCupomEvent();

    var loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    loader.present();

    self.excluirCupomForaValidade()
      .then(self.carregaMeuCupom)
      .then(self.carregaCupomPromocao)
      .then(self.carregaCupomPromocaoDetalhe)
      .then((result) => {
        loader.dismiss();
      })
      .catch((error) => {
        loader.dismiss();
        self.createAlert(error.message)
      });
  }


  private excluirCupomForaValidade = function () {
    var self = this;
    var result: any;

    var dataAtual: string = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS)

    var promise = new Promise(function (resolve, reject) {
      var query = "delete from meu_cupom where cupo_dt_validade < ?";

      self.meuCupomSqlSrv.deletarParamentro(query, [dataAtual])
        .then((registro) => {
          if (registro.rowsAffected > 0) {
            result = registro.insertId;
          }
          resolve({ self, result });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }


  private carregaMeuCupom = function (params) {
    var self = params.self;

    var result: boolean = true;

    var promise = new Promise(function (resolve, reject) {
      self.meusCupons = new Array<CupomCriadoVO>();

      let query: string = "SELECT * from meu_cupom order by cupo_dt_validade";

      self.meuCupomSqlSrv.listarTodos(query)
        .then((result) => {
          if (result != null && result.length > 0) {
            var count = 1;
            result.forEach(cupom => {
              self.meusCupons.push(self.mapSrv.getMeuCupom(cupom))
              if (count == result.length) {
                resolve({ self, result });
              }
              count++;
            });
          } else {
            self.meusCupons = new Array<CupomCriadoVO>();
            result = false
            resolve({ self, result });
          }
        })
        .catch((error) => {
          reject(error);
        });
    })

    return promise;
  }


  private carregaMeuCupomEvent() {
    var self = this;
    self.events.subscribe("carregaMeuCupomEvent", (result) => {
      if (result == true) {

        var params: Object = {
          self: self
        }
        self.carregaMeuCupom(params);
      }
    })
  }

  public openPromocao(cupom: CupomCriadoVO) {
    let self = this;
    let loader = this.loadingCtrl.create({
      spinner: 'circles'
    });

    loader.present();

    let promocaoModal = this.mdlCtrl.create(AnuncioPromocaoDetalhePage,
      { cupom: cupom, isBtnPegarCupom: false, isBtnUsarCupom: true, isControleManual: false });
    loader.dismiss();
    promocaoModal.present();

  }

  private carregaCupomPromocao = function (params) {
    var self = params.self;
    var cupons: any = null;

    var promise = new Promise(function (resolve, reject) {

      if (self.glabalVar.getIsFirebaseConnected()) {
        self.usuaCupSrv.getMeusCupons(self.glabalVar.usuarioLogado.usua_sq_id)
          .then((snapCupons) => {
            cupons = snapCupons;
            resolve({ self, cupons });
          })
          .catch((error) => {
            reject(error);
          });
      }
      else {
        resolve({ self, cupons })
      }
    })

    return promise;
  }


  private carregaCupomPromocaoDetalhe = function (params) {
    let self = params.self;
    var cupons: any = params.cupons;

    var promise = new Promise(function (resolve, reject) {

      if (cupons != null && cupons.val() != null) {
        cupons.forEach(resultCupom => {
          self.cupomSrv.pesquisarCupomPorId(resultCupom.val().cupo_sq_id)
            .then((snapCupom) => {
              var cupom: CupomCriadoVO = self.mapSrv.getMeuCupom(snapCupom.val());
              cupom.cupo_dt_validade = new Date('2018-01-20');
              self.meusCupons.push(cupom);
              resolve(true);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        });
      } else {
        resolve(false);
      }
    });

    return promise;
  }



  private createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }

}
