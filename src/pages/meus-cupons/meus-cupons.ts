import { UsuarioCupomService } from './../../providers/service/usuario-cupom-service';
import { CupomService } from './../../providers/service/cupom-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { GlobalVar } from './../../shared/global-var';
import { CupomEmpresaVO } from './../../model/cupomEmpresaVO';
import { EmpresaCupomVO } from './../../model/empresaCupomVO';
import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { CupomVO } from './../../model/cupomVO';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { BarcodeScanner } from "@ionic-native/barcode-scanner";
import { usuarioCupomVO } from '../../model/usuarioCupomVO';
import { PromocaoService } from '../../providers/service/promocao-service';

@Component({
  selector: 'page-meus-cupons',
  templateUrl: 'meus-cupons.html',
})
export class MeusCuponsPage {

  public scannedText: string;
  public loading: boolean;
  public cupons: CupomVO[] = [];
  private usuario: UsuarioVO = null;
  private cnpj: string = "";
  private statusPromocao: boolean = false;
  private toastAlert: any;

  constructor(private barcodeScanner: BarcodeScanner,
    private emprSrv: EmpresaService,
    private mapSrv: MappingsService,
    private cupomSrv: CupomService,
    private usuaCupSrv: UsuarioCupomService,
    private glabalVar: GlobalVar,
    private loadingCtrl: LoadingController,
    private promSrv: PromocaoService,
    private toastCtrl: ToastController) {

    var self = this;
    this.usuario = this.glabalVar.usuarioLogado;
    this.cnpj = "28039364000102";

    this.promSrv.getPromocao().then((result) => {
      if (result.val() != null) {
        var keyProm: any = Object.keys(result.val());
        var objProm: any = result.val()[keyProm];

        if (objProm.prom_in_ativo == true) {
          self.statusPromocao = true;
        }
        else {
          self.statusPromocao = false;
        }
      }
    })
      .catch((error) => {

      })
  }

  ionViewDidLoad() {
    this.loading = true;
    this.carregaMeusCupons();
  }

  private carregaMeusCupons() {
    var self = this;

    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    this.getMeusCupons()
      .then(self.getCupomDetalhe)
      .then((result) => {
        console.log(result);

        if (self.cupons != null && self.cupons.length > 0) {
          self.loading = true;
        } else {

          if (self.statusPromocao == true) {
            self.loading = false;
          }
        }
        // loader.dismiss();
      })
      .catch((error) => {
        loader.dismiss()
        console.log(error);
      });
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


  public pegarCupom() {

    var self = this;
    this.loading = true;
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.cancelled) {
        self.loading = false;
        loader.dismiss();
        return false;
      }
      if (barcodeData.text != null) {
        var resultScan: string[] = barcodeData.text.split(",");

        if (resultScan[0] == this.cnpj) {
          self.salvarCupom(resultScan[1]).then((result) => {
            loader.dismiss();
          })
            .catch(() => {
              loader.dismiss();
            });
        } else {
          self.createAlert("Cupom inválido.");
          loader.dismiss();
        }
      }
      else {
        return false;
      }
    }, (err) => {
      loader.dismiss();
      console.log(err);
    });
  }

  private salvarCupom(barcodeData) {
    var self = this;
    var promise = new Promise(function (resolve, reject) {
      self.emprSrv.getEmpresaByCnpj(self.cnpj)
        .then((snapEmpr) => {

          var empresaKey: any = Object.keys(snapEmpr.val());
          var objEmpresa = snapEmpr.val()[empresaKey];

          var empresaVO = self.mapSrv.getEmpresa(objEmpresa);

          var objcupom: CupomVO = new CupomVO();
          objcupom.cupo_tx_desconto = "";
          objcupom.cupo_tx_urlimagem = barcodeData;
          objcupom.cupo_tx_regulamento = "";
          objcupom.cupo_tx_titulo = "";
          objcupom.cupo_tx_descricao = "";
          objcupom.cupo_nr_vlatual = 0;
          objcupom.cupo_nr_vlcomdesconto = 0;
          objcupom.cupo_dt_validade = new Date('2018/01/12');
          objcupom.tipoCupom = 1;

          var cupomEmpresaVO: CupomEmpresaVO = new CupomEmpresaVO();
          cupomEmpresaVO.empr_sq_id = empresaVO.empr_sq_id;
          cupomEmpresaVO.empr_nm_fantasia = empresaVO.empr_nm_razaosocial;
          cupomEmpresaVO.empr_tx_bairro = empresaVO.empr_tx_bairro;
          cupomEmpresaVO.empr_tx_endereco = empresaVO.empr_tx_endereco;
          cupomEmpresaVO.empr_tx_cidade = empresaVO.empr_tx_cidade;
          cupomEmpresaVO.empr_tx_telefone_1 = empresaVO.empr_tx_telefone_1;
          objcupom.cupoEmpresa = cupomEmpresaVO;

          objcupom.cupo_nr_qtdecupom = 0;
          objcupom.cupo_nr_qtdedisponivel = 0;

          self.cupons.push(objcupom);

          self.cupomSrv.salvar(objcupom).then((result) => {
            var keyCupom: any = result;

            var objUsuaCupom: usuarioCupomVO = new usuarioCupomVO();
            objUsuaCupom.cupo_sq_id = keyCupom;
            objUsuaCupom.usua_sq_id = self.usuario.usua_sq_id;
            objUsuaCupom.uscu_in_status = "";
            objUsuaCupom.uscu_tx_codigo = "";

            self.usuaCupSrv.salvar(objUsuaCupom).then((result) => {
              resolve(true);
            })
              .catch((error) => {
                reject(error);
              });
          })
            .catch(error => {
              reject(error);
            });

          self.loading = true;

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
}
