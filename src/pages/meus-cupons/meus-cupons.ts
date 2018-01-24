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
    private events: Events) {

    var self = this;
    this.usuario = this.glabalVar.usuarioLogado;
    this.cnpj = "28039364000102";

    // this.promSrv.getPromocao().then((result) => {
    //   if (result.val() != null) {
    //     var keyProm: any = Object.keys(result.val());
    //     var objProm: any = result.val()[keyProm];

    //     if (objProm.prom_in_ativo == true) {
    //       self.statusPromocao = true;
    //     }
    //     else {
    //       self.statusPromocao = false;
    //     }
    //   }
    // })
    //   .catch((error) => {

    //   })
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
    var self =  params.self;

    // if (params.self != null) {
    //   self = params.self;
    // }
    // else {
    //   self = params;
    // }

    var result: boolean = true;

    var promise = new Promise(function (resolve, reject) {

      let query: string = "SELECT * from meu_cupom order by cupo_dt_validade";

      self.meuCupomSqlSrv.listarTodos(query)
        .then((result) => {
          if (result != null && result.length > 0) {
            var count = 1;
            self.meusCupons = new Array<CupomCriadoVO>();

            result.forEach(cupom => {
              self.meusCupons.push(self.mapSrv.getMeusCupon(cupom))
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

  private getMeusCupons = function () {
    let self = this;

    var promise = new Promise(function (resolve, reject) {

      self.usuaCupSrv.getMeusCupons(self.usuario.usua_sq_id)
        .then((cupons) => {
          resolve({ self, cupons });
        })
        .catch((error) => {
          reject(error);
        });
    })

    return promise;
  }



  private salvarCupom(barcodeData) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
      self.emprSrv.getEmpresaByCnpj(self.cnpj)
        .then((snapEmpr) => {

          // var empresaKey: any = Object.keys(snapEmpr.val());
          // var objEmpresa = snapEmpr.val()[empresaKey];

          // var empresaVO = self.mapSrv.getEmpresa(objEmpresa);

          // var objcupom: CupomVO = new CupomVO();
          // objcupom.cupo_nr_desconto = 0;
          // objcupom.cupo_tx_urlimagem = barcodeData;
          // objcupom.cupo_tx_regulamento = "";
          // objcupom.cupo_tx_titulo = "";
          // objcupom.cupo_tx_descricao = "";
          // objcupom.cupo_nr_vlatual = 0;
          // objcupom.cupo_nr_vlcomdesconto = 0;
          // objcupom.cupo_dt_validade = new Date('2018/01/12');
          // objcupom.tipoCupom = 1;

          // var cupomEmpresaVO: CupomEmpresaDTO = new CupomEmpresaDTO();
          // cupomEmpresaVO.empr_sq_id = empresaVO.empr_sq_id;
          // cupomEmpresaVO.empr_nm_fantasia = empresaVO.empr_nm_razaosocial;
          // cupomEmpresaVO.empr_tx_bairro = empresaVO.empr_tx_bairro;
          // cupomEmpresaVO.empr_tx_endereco = empresaVO.empr_tx_endereco;
          // cupomEmpresaVO.empr_tx_cidade = empresaVO.empr_tx_cidade;
          // cupomEmpresaVO.empr_tx_telefone_1 = empresaVO.empr_tx_telefone_1;
          // objcupom.empresa = cupomEmpresaVO;

          // objcupom.cupo_nr_qtdecupom = 0;
          // objcupom.cupo_nr_qtdedisponivel = 0;

          // self.cupons.push(objcupom);

          // self.cupomSrv.salvar(objcupom).then((result) => {
          //   var keyCupom: any = result;

          //   var objUsuaCupom: usuarioCupomVO = new usuarioCupomVO();
          //   objUsuaCupom.cupo_sq_id = keyCupom;
          //   objUsuaCupom.usua_sq_id = self.usuario.usua_sq_id;
          //   objUsuaCupom.uscu_in_status = "";
          //   objUsuaCupom.uscu_tx_codigo = "";

          //   self.usuaCupSrv.salvar(objUsuaCupom).then((result) => {
          //     resolve(true);
          //   })
          //     .catch((error) => {
          //       reject(error);
          //     });
          // })
          //   .catch(error => {
          //     reject(error);
          //   });

          // self.loading = true;

        })
        .catch((error) => {
          self.loading = false;
          reject(error);
        })
    })
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



  private getCupomDetalhe = function (param) {
    let self = param.self;
    var cupons: any = param.cupons;

    var promise = new Promise(function (resolve, reject) {

      if (cupons.val() != null) {
        cupons.forEach(resultCupom => {
          self.cupomSrv.pesquisarCupomPorId(resultCupom.val().cupo_sq_id)
            .then((snapCupom) => {
              var cupom: CupomVO = self.mapSrv.getCupom(snapCupom.val());
              self.cupons.push(cupom);
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

}
