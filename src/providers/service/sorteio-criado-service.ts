import { CupomUsuarioDTO } from './../../model/dominio/cupomUsuarioDTO';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { ToastController, Events } from 'ionic-angular';
import { CupomCriadoItemVO } from './../../model/cupomCriadoItemVO';
import { UsuarioSqlService } from './../database/usuario-sql-service';
import { DownloadImageService } from './download-image-service';
import { UsuarioVO } from './../../model/usuarioVO';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';

import { CupomVO } from './../../model/cupomVO';
import { MappingsService } from './_mappings-service';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';
import { GlobalVar } from '../../shared/global-var';

@Injectable()
export class SorteioCriadoService {

  private sorteioCriadoRef: any;
  private sorteioAtivoRef: any;
  private sorteioUsuarioRef: any;

  private toastAlert: any;


  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService, private glbVar: GlobalVar,
    private downSrv: DownloadImageService, private meuCupomSqlSrv: UsuarioSqlService,
    private toastCtrl: ToastController, private event: Events) {
    this.sorteioCriadoRef = this.fbService.getDataBase().ref('sorteiocriado');
    this.sorteioAtivoRef = this.fbService.getDataBase().ref('sorteioativo');
    this.sorteioUsuarioRef = this.fbService.getDataBase().ref('sorteiousuario');
  }

  //Retorna Ref de storage
  public getStorageRef() {
    return this.fbService.getStorageRef();
  }

  //Retorna storage
  public getStorage() {
    return this.fbService.getStorage();
  }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getCupomRef() {
    return this.sorteioCriadoRef;
  }

  public salvar(uidCupom: string, cupom: CupomCriadoVO) {
    return this.sorteioCriadoRef.child(uidCupom).set(cupom);
  }

  public excluir(uidCupom: string) {
    return this.sorteioCriadoRef.child(uidCupom).set(null);
  }

  public pesquisarCupomPorId(cupomKey: string) {
    return this.sorteioCriadoRef.child(cupomKey).once("value");
  }

  public getNewUidCpom(): string {
    var newKey = this.sorteioCriadoRef.push().key
    return newKey;
  }

  public getCupons() {
    return this.sorteioCriadoRef.orderByChild('cupo_sq_ordem').once("value");
  }

  public getStatusConexao = function () {
    let self = this;
    var status: boolean = false;
    var promise = new Promise(function (resolve, reject) {
      try {
        status = self.glbVar.getIsFirebaseConnected();
        resolve(status);
      }
      catch (error) {
        reject(error);
      }
    });

    return promise;
  }

  public getSorteioAtivo() {
    return this.sorteioCriadoRef.orderByChild('cupo_in_status').equalTo(true).once("value");
  }

  private getNumeroAtualSorteioRef(sorteio: CupomCriadoVO) {
    return this.sorteioCriadoRef.child(sorteio.cupo_sq_id).child("cupo_nr_sorteio");
  }

  public gerarNumeroSorteio(sorteio: CupomCriadoVO, evento: number) {
    let self = this;

    this.getNumeroAtualSorteioRef(sorteio)
      .transaction(function (nrSorteioId) {
        if (nrSorteioId <= sorteio.cupo_nr_qtdecupom) {
          return nrSorteioId + 1;
        }
        else {
          return;
        }
      }, function (error, committed, snapshot) {
        if (error) {
          throw new Error(error);

        } else if (!committed) {
          throw new Error("Não existem mais cupons para esse sorteio.");

        } else {
          try {
            var nrCupom: string = (Number.parseInt(snapshot.val()) - 1).toString();
            sorteio.cupomItens[0].cupo_nr_cupom = nrCupom;

            //Curtir
            if (evento == 1) {
              self.salvarSorteioCurtir(sorteio);

            } else if (evento == 2) { // Usar Cupom Desconto
              self.salvarSorteioUsarDesconto(sorteio)
            }         

          } catch (error) {
            throw new Error("Ocorreu um erro ao salvar o cupom.");
          }
        }
      });
  }

  private salvarSorteioCurtir(sorteio: CupomCriadoVO) {
    var self = this;
    var param:any = {self, sorteio};

    self.sorteioSalvarUsuario(param)
      .then(self.sorteioSalvarImagem)
      .then(self.sorteioSalvarCupom)
      .then(() => {
        self.createAlert("Parabéns! Você está participando do sorteio do mês.");
      })
      .catch((error) => {
        self.createAlert(error);
        throw new Error(error);
      });
  }

  public salvarSorteioDesconto(sorteio: CupomCriadoVO) {
    var self = this;
    var param: any = { self, sorteio };
    self.sorteioSalvarImagem(param)
      .then(self.sorteioSalvarCupom)
      .then(() => {
        self.createAlert("Utilize seu seu desconto e participe do sorte do mês.");
      })
      .catch((error) => {
        self.createAlert(error);
        throw new Error(error);
      });
  }

  private salvarSorteioUsarDesconto(sorteio: CupomCriadoVO) {
    var self = this;
    self.atualizarCupomSorteio(sorteio)
      .then(self.sorteioSalvarUsuario)
      .then(() => {
        self.event.publish("sorteiovalidadosucesso", true);        
        self.createAlert("Parabéns! Você está participando do sorteio do mês.");
      })
      .catch((error) => {
        self.createAlert(error);
        throw new Error(error);
      });
  }

  private sorteioSalvarUsuario = function (param) {
    var self = param.self;
    var sorteio: CupomCriadoVO = param.sorteio;

    var promise = new Promise(function (resolve, reject) {

      var usuario: UsuarioVO = self.glbVar.usuarioLogado;
      var usuarioCupom: CupomUsuarioDTO = new CupomUsuarioDTO();

      usuarioCupom.usua_sq_id = usuario.usua_sq_id;
      usuarioCupom.usua_nm_usuario = usuario.usua_nm_usuario;
      usuarioCupom.empr_sq_id = sorteio.cupomItens[0].empresa.empr_sq_id;
      usuarioCupom.empr_nm_fantasia = sorteio.cupomItens[0].empresa.empr_nm_fantasia;

      self.sorteioUsuarioRef.child(sorteio.cupo_sq_id).child(sorteio.cupomItens[0].cupo_nr_cupom).set(usuarioCupom)
        .then(() => {
          resolve({ self, sorteio });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  private sorteioSalvarImagem = function (param) {
    var self = param.self;
    var sorteio: CupomCriadoVO = param.sorteio;

    let urlImage: string = "";

    var promise = new Promise(function (resolve, reject) {
      var nameFile: string = sorteio.cupo_sq_id + ".jpg";
      var urlTo: string = self.glbVar.getAppPathStorage() + self.glbVar.getMyPathStorage() + "/" + nameFile;

      self.downSrv.donwload(sorteio.cupo_tx_urlimagem, urlTo)
        .then((value) => {
          urlImage = self.glbVar.getMyPathStorage() + "/" + nameFile;
          resolve({ self, sorteio, urlImage });
        })
        .catch((error) => {
          reject(error);

        });
    });

    return promise;
  }

  private sorteioSalvarCupom = function (param) {
    let self = param.self;
    var urlImage: string = param.urlImage;
    var sorteio: CupomCriadoVO = param.sorteio;

    let result: any;

    let promise = new Promise(function (resolve, reject) {

      let querySel: string = "select * from meu_cupom ";
      querySel = querySel + "where cupo_sq_id = ? ";

      self.meuCupomSqlSrv.pesquisar(querySel, [sorteio.cupo_sq_id]).then((result) => {
        if (result.rows.length > 0) {
          self.inserirNovoNumero(sorteio.cupomItens[0]);
        }
        else {
          self.inserirNovoCupom(sorteio, urlImage);
        }
      });
      return promise;
    });
  }

  private inserirNovoNumero(cupomItem: CupomCriadoItemVO) {
    let self = this;
    var status: number = 0;

    if (cupomItem.cupo_in_status == true) {
      status = 1;
    }

    let queryMcpi: string = "INSERT INTO meu_cupom_item (";
    queryMcpi = queryMcpi + "cupo_sq_id, cupo_nr_cupom, ";
    queryMcpi = queryMcpi + "empr_sq_id, empr_nm_fantasia, ";
    queryMcpi = queryMcpi + "empr_nr_documento,cupo_in_status) ";
    queryMcpi = queryMcpi + "Values ( ?, ?, ?, ?, ?, ? )";

    self.meuCupomSqlSrv.inserir(queryMcpi, [cupomItem.cupo_sq_id, cupomItem.cupo_nr_cupom,
    cupomItem.empresa.empr_sq_id, cupomItem.empresa.empr_nm_fantasia,
    cupomItem.empresa.empr_nr_documento, status]).then((registro) => {
      if (registro.rowsAffected > 0) {
        return registro.insertId;
      }
    }).catch((error) => {
      throw new Error(error);
    })
  }

  private inserirNovoCupom(sorteio: CupomCriadoVO, urlImage: string) {
    let self = this;
    var statusSorteio: number = 0;
    var statusSorteioItem: number = 0;

    if (sorteio.cupo_in_status == true) {
      statusSorteio = 1;
    }

    let queryMcp: string = "INSERT INTO meu_cupom (";
    queryMcp = queryMcp + "cupo_sq_id,cupo_tx_titulo,";
    queryMcp = queryMcp + "cupo_tx_descricao,cupo_tx_regulamento,";
    queryMcp = queryMcp + "cupo_dt_validade,cupo_nr_desconto,";
    queryMcp = queryMcp + "cupo_tx_urlimagem,cupo_nr_vlatual,";
    queryMcp = queryMcp + "cupo_nr_vlcomdesconto,empr_sq_id,";
    queryMcp = queryMcp + "empr_nm_fantasia,empr_tx_endereco,";
    queryMcp = queryMcp + "empr_tx_bairro,empr_tx_cidade,";
    queryMcp = queryMcp + "empr_tx_telefone_1,empr_nr_documento,muni_sq_id,";
    queryMcp = queryMcp + "tipoCupom, cupo_in_status, sort_sq_id ) ";
    queryMcp = queryMcp + "Values (?, ?, ?, ?, ?, ?, ?, ?,";
    queryMcp = queryMcp + "?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    self.meuCupomSqlSrv.getDataBase().transaction(function (tx) {

      tx.executeSql(queryMcp, [
        sorteio.cupo_sq_id, sorteio.cupo_tx_titulo,
        sorteio.cupo_tx_descricao, sorteio.cupo_tx_regulamento,
        sorteio.cupo_dt_validade, sorteio.cupo_nr_desconto,
        urlImage, sorteio.cupo_nr_vlatual,
        sorteio.cupo_nr_vlcomdesconto, sorteio.empresa.empr_sq_id,
        sorteio.empresa.empr_nm_fantasia, sorteio.empresa.empr_tx_endereco,
        sorteio.empresa.empr_tx_bairro, sorteio.empresa.empr_tx_cidade,
        sorteio.empresa.empr_tx_telefone_1, sorteio.empresa.empr_nr_documento,
        sorteio.empresa.municipio.muni_sq_id, sorteio.tipoCupom, statusSorteio, sorteio.sort_sq_id]);

      if (sorteio.cupomItens[0].cupo_in_status == true) {
        statusSorteioItem = 1;
      }


      let queryMcpi: string = "INSERT INTO meu_cupom_item (";
      queryMcpi = queryMcpi + "cupo_sq_id, cupo_nr_cupom, ";
      queryMcpi = queryMcpi + "empr_sq_id, empr_nm_fantasia, ";
      queryMcpi = queryMcpi + "empr_nr_documento,cupo_in_status) ";
      queryMcpi = queryMcpi + "Values ( ?, ?, ?, ?, ?, ?)";

      tx.executeSql(queryMcpi, [sorteio.cupomItens[0].cupo_sq_id, sorteio.cupomItens[0].cupo_nr_cupom, sorteio.cupomItens[0].empresa.empr_sq_id, sorteio.cupomItens[0].empresa.empr_nm_fantasia, sorteio.cupomItens[0].empresa.empr_nr_documento, statusSorteioItem]);

    }), function (error) {
      console.log("Deu erro nessa porra");
      throw new Error(error);
    }, function () {
      console.log("Show de bola funcionou");
    }
  }


  private atualizarCupomSorteio(sorteio: CupomCriadoVO) {
    let self = this;

    var query: string = "Update meu_cupom_item ";
    query = query + "Set cupo_in_status = 1 ";

    if (sorteio.cupomItens != null) {
      query = query + ",cupo_nr_cupom = ? ";
    }

    query = query + "Where id = ? ";

    var promise = new Promise(function (resolve, reject) {
      var params: any = null

      if (sorteio.cupomItens != null) {
        params = [sorteio.cupomItens[0].cupo_nr_cupom, sorteio.cupomItens[0].id];
      }
      else {
        params = [sorteio.cupomItens[0].id];
      }

      self.meuCupomSqlSrv.atualizar(query, params)
        .then((result) => {     
            resolve({self, sorteio});
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
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }



  public pesquisarSorteioInativoDevice = function (sorteioItemId: number) {
    var self = this;
    var sorteios: Array<CupomCriadoVO> = new Array<CupomCriadoVO>();
    var result: boolean = true;
    var query: string = "";

    var promise = new Promise(function (resolve, reject) {

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
      query = query + "where coi.empr_nr_documento = ? ";
      query = query + "and coi.cupo_in_status = 0 ";
      query = query + "order by coi.id asc ";
      query = query + "LIMIT 1 ";

      self.meuCupomSqlSrv.pesquisar(query, [sorteioItemId])
        .then((result) => {
          if (result != null && result.rows.length > 0) {
            var count = 0;

            sorteios = self.mapSrv.getCupomCriadoSQL(result);
            resolve({ self, sorteios });

          } else {
            sorteios = new Array<CupomCriadoVO>();
            result = false
            resolve({ self, sorteios });
          }
        })
        .catch((error) => {
          reject(error);
        });
    })

    return promise;
  }

  public pesquisarSorteioItemIdDevice = function (sorteioItemId: string) {
    var self = this;
    var sorteios: Array<CupomCriadoVO> = new Array<CupomCriadoVO>();
    var result: boolean = true;
    var query: string = "";

    var promise = new Promise(function (resolve, reject) {

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
      query = query + "INNER JOIN meu_cupom_item coi "
      query = query + "on co.cupo_sq_id = coi.cupo_sq_id "
      query = query + "where coi.id = ? ";
 

      self.meuCupomSqlSrv.pesquisar(query, [sorteioItemId])
        .then((result) => {
          if (result != null && result.rows.length > 0) {
            var count = 0;

            sorteios = self.mapSrv.getCupomCriadoSQL(result);
            resolve({ self, sorteios });

          } else {
            sorteios = new Array<CupomCriadoVO>();
            result = false
            resolve({ self, sorteios });
          }
        })
        .catch((error) => {
          reject(error);
        });
    })

    return promise;
  }

}
