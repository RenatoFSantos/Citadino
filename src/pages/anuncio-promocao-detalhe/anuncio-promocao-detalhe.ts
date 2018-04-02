import { CupomCriadoItemVO } from './../../model/cupomCriadoItemVO';
import { ExceptionDTO } from './../../model/dominio/exceptionDTO';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { SorteioCriadoService } from './../../providers/service/sorteio-criado-service';
import { GlobalVar } from './../../shared/global-var';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { UsuarioSqlService } from './../../providers/database/usuario-sql-service';
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
  private qrCode: string = "";

  constructor(private navCtrl: NavController, private params: NavParams,
    private compCriadoSrv: CupomCriadoService, private events: Events,
    private mapSrv: MappingsService, private vtrSrv: VitrineService,
    private downSrv: DownloadImageService, private meuCupomSqlSrv: UsuarioSqlService,
    private loadingCtrl: LoadingController, private mdlCtrl: ModalController,
    private barcodeScanner: BarcodeScanner, private toastCtrl: ToastController,
    private glbVar: GlobalVar, private sorteioSrv: SorteioCriadoService) {

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
      .then(this.salvarImagemCupom)
      .then(this.salvarMeuCupomDevice)
      .then(() => {
        self.createAlert("Cupom pego com sucesso.")

        //Gerar cupom do sorteio
        self.sorteioPegarDesconto();

        self.isBtnPegarCupom = false;
        self.isBtnUsarCupom = true;
        loader.dismiss();
      })
      .catch((error) => {
        loader.dismiss();
        console.error;
      });
  }

  private pegarCupom = function (paramSelf) {
    let self = paramSelf;
    let exception: ExceptionDTO = new ExceptionDTO();

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
          self.compCriadoSrv.salvarCupomUsuario(self.cupom.cupo_sq_id, self.cupom.usuario.usua_sq_id)
            .then(() => {
              resolve(self);
            })
            .catch((error) => {
              reject(error);
            });
        }
      });
    });

    return promise;
  }

  private salvarImagemCupom = function (param) {
    let self = param;
    let urlImage: string = "";
    let result: any;

    var promise = new Promise(function (resolve, reject) {
      var nameFile: string = self.cupom.cupo_sq_id + ".jpg";
      var urlTo: string = self.glbVar.getAppPathStorage() + self.glbVar.getMyPathStorage() + "/" + nameFile;

      self.downSrv.donwload(self.cupom.cupo_tx_urlimagem, urlTo)
        .then((value) => {
          urlImage = self.glbVar.getMyPathStorage() + "/" + nameFile;
          resolve({ self, urlImage });
        })
        .catch((error) => {
          reject(error);
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
      query = query + "empr_tx_telefone_1,empr_nr_documento,muni_sq_id,";
      query = query + "tipoCupom,cupo_in_status) ";
      query = query + "Values (?, ?, ?, ?, ?, ?, ?, ?,";
      query = query + "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      self.meuCupomSqlSrv.inserir(query, [
        self.cupom.cupo_sq_id, self.cupom.cupo_tx_titulo,
        self.cupom.cupo_tx_descricao, self.cupom.cupo_tx_regulamento,
        self.cupom.cupo_dt_validade, self.cupom.cupo_nr_desconto,
        urlImage, self.cupom.cupo_nr_vlatual,
        self.cupom.cupo_nr_vlcomdesconto, self.cupom.empresa.empr_sq_id,
        self.cupom.empresa.empr_nm_fantasia, self.cupom.empresa.empr_tx_endereco,
        self.cupom.empresa.empr_tx_bairro, self.cupom.empresa.empr_tx_cidade,
        self.cupom.empresa.empr_tx_telefone_1, self.cupom.empresa.empr_nr_documento,
        self.cupom.empresa.municipiomuni_sq_id, self.cupom.tipoCupom, 1])
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
    var statusConexao: boolean = false;

    let loader = this.loadingCtrl.create({
      dismissOnPageChange: true,
      content: 'Aguarde...'
    });

    loader.present();

    statusConexao = self.glbVar.getIsFirebaseConnected();

    this.barcodeScanner.scan()
      .then((barcodeData) => {

        if (barcodeData.cancelled) {
          loader.dismiss();
          return false;
        }

        if (barcodeData.text != null) {
          self.qrCode = barcodeData.text.split(",")[0].trim();

          if (self.qrCode == CtdFuncoes.removeMaskNrDocumento(self.cupom.empresa.empr_nr_documento)) {
            self.pesquisarCupomPego()
              .then(self.deletarCupom)
              .then(self.deletarImage)
              .then(self.sorteioInativoLocal)
              .then(self.atualizarStatusSorteio)
              .then((result) => {
                self.createAlert("Cupom utilizado com sucesso.");
                loader.dismiss();
                self.events.publish("carregaMeuCupomEvent", true);
                this.navCtrl.pop();

                //Ativar Cupom Sorteio
                self.sorteioUsarDesconto(result.sorteioLocal, statusConexao);

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
      })
      .catch((err) => {
        loader.dismiss();
        console.log(err);
      });
  }

  private atualizarStatusSorteio = function (param) {
    var self = param.self;
    var sorteioLocal: CupomCriadoVO = param.sorteioLocal;

    var promise = new Promise(function (resolve, reject) {
      self.sorteioSrv.atualizarCupomSorteio(sorteioLocal)
        .then(() => {
          resolve({ self, sorteioLocal });
        })
        .catch((error) => {
          reject(error);
        })
    });

    return promise;
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

      var pathApp: string = self.glbVar.getAppPathStorage() + self.glbVar.getMyPathStorage();
      var file: string = meuCupom.cupo_sq_id + ".jpg";

      self.downSrv.removeFile(pathApp, file)
        .then((result) => {
          result = true;
          resolve({ self, result, meuCupom });
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

  private pesquisarSorteioAtivo = function (param) {
    let self = param.self;
    let statusConexao: boolean = param.statusConexao;
    let nrDocumento: string = param.nrDocumento;

    var sorteioKey: string = null;
    var nrQuantidadeCupom: number = 0;

    var promise = new Promise(function (resolve, reject) {

      if (statusConexao == true) {
        self.sorteioSrv.getCupomAtivo()
          .then((snap) => {

            if (snap != null && snap.val() != null) {
              sorteioKey = Object.keys(snap.val())[0];

              self.sorteioSrv.getQuantidadeDisponivel(sorteioKey)
                .then((snap) => {
                  nrQuantidadeCupom = snap.val();

                  resolve({ self, sorteioKey, nrQuantidadeCupom });

                })
                .catch((error) => {
                  reject(error);
                });
            }
            else {
              var error: Error = new Error("Não existe sorteio ativo");
              reject(error);
            }
          })
          .catch((error) => {
            reject(error);
          });
      }
      else {
        resolve({ self, sorteioKey, nrQuantidadeCupom });
      }
    });
    return promise;
  }

  private sorteioPegarDesconto() {
    let self = this;
    var sorteioItens: Array<CupomCriadoItemVO> = new Array<CupomCriadoItemVO>();

    self.sorteioSrv.getStatusConexao()
      .then((statusConnect: boolean) => {
        if (statusConnect == true) {
          self.sorteioSrv.getSorteioAtivo()
            .then((snap) => {
              if (snap != null && snap.val() != null) {
                var sorteioObject: any = snap.val()[Object.keys(snap.val())[0]];
                var sorteio: CupomCriadoVO = self.mapSrv.getCupomCriado(sorteioObject);
                sorteio.cupo_in_status = true;

                var sorteioItem: CupomCriadoItemVO = new CupomCriadoItemVO();
                sorteioItem.cupo_sq_id = sorteio.cupo_sq_id;
                sorteioItem.cupo_in_status = false;
                sorteioItens.push(sorteioItem);

                sorteio.cupomItens = sorteioItens;

                var empresa: CupomEmpresaDTO = new CupomEmpresaDTO();
                empresa.empr_sq_id = self.cupom.empresa.empr_sq_id;
                empresa.empr_nm_fantasia = self.cupom.empresa.empr_nm_fantasia;
                empresa.empr_nr_documento = self.cupom.empresa.empr_nr_documento;

                sorteioItem.empresa = empresa;

                self.sorteioSrv.salvarSorteioDesconto(sorteio);
              }
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
        else {
          console.log("Não foi possível conectar a internet.");
        }
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  private sorteioUsarDesconto( sorteioLocal: CupomCriadoVO, statusConexao: boolean) {
    let self = this;
    var sorteioItens: Array<CupomCriadoItemVO> = new Array<CupomCriadoItemVO>();

    if (statusConexao == true) {

      self.sorteioAtivoWeb()
        .then((sorteioWeb: CupomCriadoVO) => {
          sorteioLocal.cupo_nr_qtdecupom = sorteioWeb.cupo_nr_qtdecupom;
          self.sorteioSrv.gerarNumeroSorteio(sorteioLocal, 2);
        })
        .catch(error => {

        })
    } else {
      self.createAlert("Valide sua participação no sorteio do mês.");
    }
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

  public sorteioInativoLocal = function (param: any) {
    var self = param.self;
    var nrQrcode = self.qrCode;
    var sorteioLocal: CupomCriadoVO = null;

    var promise = new Promise(function (resolve, reject) {

      self.sorteioSrv.pesquisarSorteioInativoDevice(nrQrcode)
        .then((result: any) => {

          if (result.sorteios.length > 0) {
            sorteioLocal = result.sorteios[0];
          }

          resolve({ self, sorteioLocal });

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

  // public listarDiretorio() {

  //   this.downSrv.listDir(window.cordova.file.applicationStorageDirectory, "Library/Image")
  //     .then((result: any) => {
  //       result.forEach(element => {
  //         console.log("Elemento :" + element.fullPath);
  //         console.log("Elemento :" + element.nativeURL);
  //         console.log("Elemento :" + element.name);
  //       });
  //     })
  //     .catch((error) => {
  //       console.log("Deu error nessa porra " + error.message);
  //     })
  // }
}
