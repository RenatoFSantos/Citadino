import { CupomCriadoItemVO } from './../../model/cupomCriadoItemVO';
import { SorteioCriadoService } from './../../providers/service/sorteio-criado-service';
import { DownloadImageService } from './../../providers/service/download-image-service';
import { Promise } from 'firebase/app';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { Events } from 'ionic-angular/util/events';
import { AnuncioPromocaoDetalhePage } from './../anuncio-promocao-detalhe/anuncio-promocao-detalhe';
import { CupomCriadoService } from './../../providers/service/cupom-criado-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { UsuarioSqlService } from './../../providers/database/usuario-sql-service';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { CupomService } from './../../providers/service/cupom-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { GlobalVar } from './../../shared/global-var';
import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { CupomVO } from './../../model/cupomVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, ModalController } from 'ionic-angular';
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
  private tipoCupom: number = 1;

  constructor(private emprSrv: EmpresaService,
    private mapSrv: MappingsService,
    private glbVar: GlobalVar,
    private loadingCtrl: LoadingController,
    private promSrv: PromocaoService,
    private toastCtrl: ToastController,
    private meuCupomSqlSrv: UsuarioSqlService,
    private cupoCriaSrv: CupomCriadoService,
    private mdlCtrl: ModalController,
    private events: Events,
    private cupomSrv: CupomService,
    private downSrv: DownloadImageService,
    private params: NavParams,
    private sorteioSrv: SorteioCriadoService) {

    var self = this;
    this.usuario = this.glbVar.usuarioLogado;
    this.cnpj = "28039364000102";
    this.tipoCupom = params.get("tipoCupom");

  }

  ionViewDidLoad() {

    var self = this;
    this.carregaMeuCupomEvent();
    this.sorteioValidadoSucessoEvent();

    var loader = this.loadingCtrl.create({
      content: 'Aguarde...'
    });

    loader.present();

    self.excluirCupomForaValidade()
      .then(self.carregaMeuCupom)
      // .then(self.carregaCupomPromocao)
      // .then(self.carregaCupomPromocaoDetalhe)
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
    var statusCupom: number = 1;
    var result: boolean = true;
    var query: string = "";

    var promise = new Promise(function (resolve, reject) {
      self.meusCupons = new Array<CupomCriadoVO>();


      if (self.tipoCupom == 1) {
        query = "SELECT * from meu_cupom ";
        query = query + "where tipoCupom = ? "
        query = query + "and cupo_in_status = ? "
        query = query + "order by cupo_dt_validade ";
      }
      else if (self.tipoCupom == 2) {
        query = "SELECT  co.cupo_sq_id,";
        query = query + "co.cupo_tx_titulo,";
        query = query + "co.cupo_tx_descricao,";
        query = query + "co.cupo_tx_regulamento,";
        query = query + "co.cupo_dt_validade,";
        query = query + "co.cupo_nr_desconto,";
        query = query + "co.cupo_tx_urlimagem,";
        query = query + "co.cupo_nr_vlatual,";
        query = query + "co.cupo_nr_vlcomdesconto,";
        query = query + "co.empr_sq_id,";
        query = query + "co.empr_nm_fantasia,";
        query = query + "co.empr_tx_endereco,";
        query = query + "co.empr_tx_bairro,";
        query = query + "co.empr_tx_cidade,";
        query = query + "co.empr_tx_telefone_1,";
        query = query + "co.empr_nr_documento,";
        query = query + "co.muni_sq_id,";
        query = query + "co.tipoCupom,";
        query = query + "co.cupo_in_status,";
        query = query + "co.sort_sq_id,";
        query = query + "coi.id as coi_id,";
        query = query + "coi.cupo_sq_id as coi_cupo_sq_id,";
        query = query + "coi.cupo_nr_cupom as coi_cupo_nr_cupom,";
        query = query + "coi.empr_sq_id as coi_empr_sq_id,";
        query = query + "coi.empr_nm_fantasia as coi_empr_nm_fantasia,";
        query = query + "coi.empr_nr_documento as coi_empr_nr_documento,";
        query = query + "coi.cupo_in_status as coi_cupo_in_status ";
        query = query + "from meu_cupom co ";
        query = query + "LEFT JOIN meu_cupom_item coi "
        query = query + "on co.cupo_sq_id = coi.cupo_sq_id "
        query = query + "where tipoCupom = ? "
        query = query + "and coi.cupo_in_status = ? "
        query = query + "order by co.cupo_dt_validade ";
        query = query + ", coi.cupo_nr_cupom asc ";
      }

      self.meuCupomSqlSrv.pesquisar(query, [self.tipoCupom, statusCupom])
        .then((result) => {
          if (result != null && result.rows.length > 0) {
            var count = 0;

            self.meusCupons = self.mapSrv.getCupomCriadoSQL(result);
            resolve({ self, result });

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

      if (self.glbVar.getIsFirebaseConnected()) {
        self.usuaCupSrv.getMeusCupons(self.glbVar.usuarioLogado.usua_sq_id)
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
              cupom.cupo_dt_validade = new Date('2018-01-18');
              cupom.tipoCupom = 2;
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


  public validarSorteio(sorteioItem: CupomCriadoItemVO) {
    var self = this;
    var statusConexao: boolean = false;

    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    statusConexao = self.glbVar.getIsFirebaseConnected();

    self.sorteioLocalId(sorteioItem.id)
      .then((result: any) => {
        self.sorteioUsarDesconto(result.sorteioLocal, statusConexao)
          .then((sorteioLocal: CupomCriadoVO) => {
            sorteioItem.cupo_nr_cupom = sorteioLocal.cupomItens[0].cupo_nr_cupom;
            loader.dismiss();
          })
          .catch((error) => {
            self.createAlert(error.message);
            loader.dismiss();
          });
      }).catch(error => {
        loader.dismiss();
      })
  }

  private sorteioUsarDesconto(sorteioLocal: CupomCriadoVO, statusConexao: boolean) {
    let self = this;
    var sorteioItens: Array<CupomCriadoItemVO> = new Array<CupomCriadoItemVO>();

    var promise = new Promise(function (resolve, reject) {
      if (statusConexao == true) {

        self.sorteioAtivoWeb()
          .then((sorteioWeb: CupomCriadoVO) => {
            self.sorteioSrv.gerarNumeroSorteio(sorteioLocal, 2);
            sorteioLocal.cupo_nr_qtdecupom = sorteioWeb.cupo_nr_qtdecupom;
            resolve(sorteioLocal);
          })
          .catch(error => {
            reject(error);
          })
      }
      else {
        reject(Error("Não foi possível validar sua participação. Tente mais tarde."));
      }
    });
    return promise;
  }

  public sorteioAtivoWeb = function () {
    var self = this;
    var sorteioWeb: CupomCriadoVO = null;

    var promise = new Promise(function (resolve, reject) {

      self.sorteioSrv.getSorteioAtivo()
        .then((snap) => {
          if (snap != null && snap.val() != null) {

            var sorteioObject: any = snap.val()[Object.keys(snap.val())[0]];
            sorteioWeb = self.mapSrv.getCupomCriado(sorteioObject);

            resolve(sorteioWeb);

          } else {
            reject(Error("Não existe sorteio ativo."));
          }
        })
        .catch((error) => {
          reject(error);
        })
    });

    return promise;
  }

  public sorteioLocalId = function (sorteioItemId: number) {
    var self = this;
    var nrQrcode = self.qrCode;
    var sorteioLocal: CupomCriadoVO = null;

    var promise = new Promise(function (resolve, reject) {

      self.sorteioSrv.pesquisarSorteioItemIdDevice(sorteioItemId)
        .then((result: any) => {

          if (result.sorteios.length > 0) {
            sorteioLocal = result.sorteios[0];
          }

          resolve({ self, sorteioLocal });

        })
    });

    return promise;
  }

  private sorteioValidadoSucessoEvent() {
    var self = this;
    self.events.subscribe("sorteiovalidadosucesso", (result) => {
      if (result == true) {

        var params: Object = {
          self: self
        }
        self.carregaMeuCupom(params);
      }
    })
  }


}
