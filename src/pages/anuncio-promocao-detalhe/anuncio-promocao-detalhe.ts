import { GlobalVar } from './../../shared/global-var';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UsuarioSqlService } from './../../providers/database/usuario-sql-service';
import { ExceptionDTO } from './../../model/dominio/exceptionDTO';
import { Promise } from 'firebase/app';
import { DownloadImageService } from './../../providers/service/download-image-service';
import { VitrineService } from './../../providers/service/vitrine-service';
import { MappingsService } from './../../providers/service/_mappings-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { CupomCriadoService } from './../../providers/service/cupom-criado-service';
import { Events } from 'ionic-angular/util/events';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { VitrineVO } from './../../model/vitrineVO';
import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ModalController, ToastController } from 'ionic-angular';
import * as enums from './../../model/dominio/ctdEnum';

declare var window: any;

@Component({
  selector: 'page-anuncio-promocao-detalhe',
  templateUrl: 'anuncio-promocao-detalhe.html',
})

export class AnuncioPromocaoDetalhePage {

  public cupom: CupomCriadoVO;
  public isBtnPegarCupom: boolean = false;
  public isBtnUsarCupom: boolean = false;
  public isControleManual: boolean = false;
  private toastAlert: any;
  private meuCupom: CupomCriadoVO;

  constructor(private navCtrl: NavController, private params: NavParams,
    private compCriadoSrv: CupomCriadoService, private events: Events,
    private mapSrv: MappingsService, private vtrSrv: VitrineService,
    private downSrv: DownloadImageService, private meuCupomSqlSrv: UsuarioSqlService,
    private loadingCtrl: LoadingController, private mdlCtrl: ModalController,
    private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController,
    private glbVar: GlobalVar) {

    var self = this;
    self.cupom = params.get("cupom");
    self.isBtnPegarCupom = params.get("isBtnPegarCupom");
    self.isBtnUsarCupom = params.get("isBtnUsarCupom");
    self.isControleManual = params.get("isControleManual");

    if (self.glbVar.getIsCordova()) {
      self.pesquisarCupomPego()
        .then((result: any) => {

          if (this.verificarIsValidade() == true) {
            if (self.isControleManual == false) {
              if (result.meuCupom != null) {
                self.isBtnPegarCupom = false;
                self.isBtnUsarCupom = true;
              }
              else {
                self.isBtnPegarCupom = true;
                self.isBtnUsarCupom = false;
              }
            }
          }
          else {
            self.isBtnPegarCupom = false;
            self.isBtnUsarCupom = false;
          }

        });
    } else {
      self.isBtnPegarCupom = false;
      self.isBtnUsarCupom = false;
    }
  }

  public onCupomAdded = (childSnapshot, prevChildKey) => {
  }

  ionViewDidLoad() {
    if (this.cupom.usuario != null && this.cupom.usuario.usua_sq_id != null) {
      this.compCriadoSrv.getCupomRef().child(this.cupom.usuario.usua_sq_id).child(this.cupom.cupo_sq_id).on('child_added', this.onCupomAdded);
    }

    this.closeEvent();
  }

  ionViewWillUnload() {

    if (this.cupom.usuario != null && this.cupom.usuario.usua_sq_id != null) {
      this.compCriadoSrv.getCupomRef().child(this.cupom.usuario.usua_sq_id).child(this.cupom.cupo_sq_id).off('child_added');
    }
  }

  public discar(number: string) {
    CtdFuncoes.discarTelefone(number);
  }

  private getCupom(vitrine: VitrineVO) {
    let self = this;
    this.compCriadoSrv.pesquisarCupomPorId(vitrine.usua_sq_id, vitrine.cupo_sq_id)
      .then((cupomSnap) => {
        self.cupom = self.mapSrv.getCupomCriado(cupomSnap.val());
        console.log(self.cupom);
      });
  }

  public pegarCupoEvent() {
    let self = this;
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    self.pegarCupom(self)
      .then(this.salvarMeuCupomDevice)
      .then(() => {
        self.createAlert("Cupom pego com sucesso.")
        self.isBtnPegarCupom = false;
        self.isBtnUsarCupom = true;
        loader.dismiss();
      })
      .catch((error) => {
        loader.dismiss();
        console.error;
      });
  }

  private pegarCupom = function (self) {
    let exception: ExceptionDTO = new ExceptionDTO();
    let urlImage: string = "";

    let promise = new Promise(function (resolve, reject) {

      let nrDisponivelRef = self.compCriadoSrv.baixarCupomTransacion(self.cupom.usuario.usua_sq_id, self.cupom.cupo_sq_id);

      nrDisponivelRef.transaction(function (cupo_nr_qtdedisponivel) {
        if (cupo_nr_qtdedisponivel > 0) {
          return cupo_nr_qtdedisponivel - 1;
        }
        else {
          return;
        }
      }, function (error, committed, snapshot) {
        if (error) {
          exception.stack = "0";
          exception.message = error.message;
          reject(exception);
        } else if (!committed) {
          exception.stack = "1";
          exception.message = "Quantidade indisponível";
          reject(exception);
        } else {

          self.downSrv.listDir(self.globalVar.getStorageDirectory(), "Library/Image/")
            .then((result: any) => {
              result.forEach(element => {
                console.log(element);
              });
            })
            .catch((error) => {
              console.log("Deu error nessa porra " + error);
            })

          // self.downSrv.donwload(self.cupom.cupo_tx_urlimagem, self.cupom.cupo_sq_id)
          //   .then((value) => {
          //     console.log("toURL " + value.toURL());
          //     urlImage = value.toURL();
          //     resolve({ self, urlImage });
          //   })
          //   .catch((error) => {
          //     console.log("Deu error nessa porra " + error);
          //     exception.stack = "0";
          //     exception.message = error.message;
          //     reject(exception);
          //   });
        }
      });
    });

    return promise;
  }

  private salvarMeuCupomDevice = function (params) {
    let self = params.self;
    let urlImage: string = params.urlImage;
    let result: any;

    let promise = new Promise(function (resolve, reject) {

      let query: string = "INSERT INTO meu_cupom (";
      query = query + "cupo_sq_id,cupo_tx_titulo,";
      query = query + "cupo_tx_descricao,cupo_tx_regulamento,";
      query = query + "cupo_dt_validade,cupo_nr_desconto,";
      query = query + "cupo_tx_urlimagem,cupo_nr_vlatual,";
      query = query + "cupo_nr_vlcomdesconto,empr_sq_id,";
      query = query + "empr_nm_fantasia,empr_tx_endereco,";
      query = query + "empr_tx_bairro,empr_tx_cidade,";
      query = query + "empr_tx_telefone_1,empr_nr_documento,muni_sq_id) ";
      query = query + "Values (?, ?, ?, ?, ?, ?, ?, ?,";
      query = query + "?, ?, ?, ?, ?, ?, ?, ?, ?)";

      self.meuCupomSqlSrv.inserir(query, [
        self.cupom.cupo_sq_id, self.cupom.cupo_tx_titulo,
        self.cupom.cupo_tx_descricao, self.cupom.cupo_tx_regulamento,
        self.cupom.cupo_dt_validade, self.cupom.cupo_nr_desconto,
        urlImage, self.cupom.cupo_nr_vlatual,
        self.cupom.cupo_nr_vlcomdesconto, self.cupom.empresa.empr_sq_id,
        self.cupom.empresa.empr_nm_fantasia, self.cupom.empresa.empr_tx_endereco,
        self.cupom.empresa.empr_tx_bairro, self.cupom.empresa.empr_tx_cidade,
        self.cupom.empresa.empr_tx_telefone_1, self.cupom.empresa.empr_nr_documento,
        self.cupom.empresa.municipiomuni_sq_id])
        .then((registro) => {

          if (registro.rowsAffected > 0) {
            result = registro.insertId;
          }
          resolve(result);
        })
        .catch((error) => {
          var exception: ExceptionDTO = new ExceptionDTO();
          exception.stack = "2";
          exception.message = error.message;
        });
    });

    return promise;
  }

  public usarCupom() {
    var self = this;
    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    this.barcodeScanner.scan().then((barcodeData) => {
      if (barcodeData.cancelled) {
        loader.dismiss();
        return false;
      }
      if (barcodeData.text != null) {
        var resultScan: string[] = barcodeData.text.split(",");

        if (resultScan[0].trim() == CtdFuncoes.removeMaskNrDocumento(self.cupom.empresa.empr_nr_documento)) {
          self.pesquisarCupomPego()
            .then(self.deletarCupom)
            .then(self.deletarImage)
            .then(() => {
              self.createAlert("Cupom utilizado com sucesso.");
              loader.dismiss();
              self.events.publish("carregaMeuCupomEvent", true);
              this.navCtrl.pop();
            })
            .catch((error) => {
              self.createAlert("Cupom inválido.");
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

  private deletarCupom = function (params) {
    var self = params.self;
    var meuCupom: CupomCriadoVO = params.meuCupom;
    var query: string = "";
    var result: any;

    var promise = new Promise(function (resolve, reject) {

      if (meuCupom != null) {
        query = "DELETE FROM meu_cupom WHERE cupo_sq_id = ?";
        self.meuCupomSqlSrv.deletarParamentro(query, [meuCupom.cupo_sq_id])
          .then((registro) => {
            if (registro.rowsAffected > 0) {
              result = registro.insertId;
            }
            resolve({ self, meuCupom });
          })
          .catch((error) => {
            var exception: ExceptionDTO = new ExceptionDTO();
            exception.stack = "2";
            exception.message = error.message;
            reject(exception);
          });
      }
      else {
        resolve({ self, meuCupom });
      }

    });

    return promise;
  }

  private deletarImage = function (params) {
    var self = params.self;
    var meuCupom: CupomCriadoVO = params.meuCupom;
    var result: any;

    var promise = new Promise(function (resolve, reject) {

      var index: number = meuCupom.cupo_tx_urlimagem.lastIndexOf("/");

      var url: String = meuCupom.cupo_tx_urlimagem;
      url = url.substr(0, index);

      var file: string = meuCupom.cupo_sq_id + ".jpg";

      self.downSrv.removeFile(url, file)
        .then((result) => {
          result = true;
          resolve({ self, result });
        })
        .catch((error) => {
          var exception: ExceptionDTO = new ExceptionDTO();
          exception.stack = "2";
          exception.message = error.message;
          reject(exception);
        });
    });

    return promise;
  }

  private pesquisarCupomPego = function () {
    var self = this;
    var meuCupom: CupomCriadoVO = null;

    var query: string = "select * from meu_cupom where cupo_sq_id = ? ";

    var promise = new Promise(function (resolve, reject) {

      self.meuCupomSqlSrv.pesquisar(query, [self.cupom.cupo_sq_id])
        .then((result) => {
          if (result != null && result.rows.length > 0) {
            meuCupom = self.mapSrv.getMeuCupom(result.rows.item(0));
            resolve({ self, meuCupom });
          } else {
            resolve({ self, meuCupom });
          }
        })
        .catch((error) => {
          self.isBtnPegarCupom = false;
          self.isBtnUsarCupom = false;

          reject(error);
        });
    });

    return promise;
  }

  private verificarIsValidade(): boolean {
    var result: boolean = true;

    var dataAtual: any = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
    var dataValidade: any = this.cupom.cupo_dt_validade;

    if (dataAtual > dataValidade) {
      result = false;
    }

    return result;
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

  private closeEvent() {
    this.events.subscribe("anuncio_close:true", (result) => {
      if (result) {
        this.navCtrl.pop();
      }
    });
  }
}
