import { ExceptionDTO } from './../../model/dominio/exceptionDTO';
import { GlobalVar } from './../../shared/global-var';
import { SqlLiteService } from './sqlLite-service';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { database } from 'firebase/app';

@Injectable()
export class UsuarioSqlService {

  private dataBase: SQLiteObject;

  constructor(private plt: Platform,
    private sqlSrv: SqlLiteService,
    private glbVar: GlobalVar) { }

  InitDatabase() {
    var versaoApp: string = this.glbVar.getVersaoApp();
    this.criarBancoDados(versaoApp)
      .then(this.criarTabelas)
      .then(this.verificarVersao)
      .then(this.alterarTabelas)
      .then((result: any) => {
        console.log("Retorno :" + result.db);
        // this.dataBase = result.db;
      })
      .catch((error) => {
        throw new Error("Não foi possivel conectar" + error);
      });
  }

  private criarBancoDados = function (versaoApp: string) {
    let self = this;
    let connection: any;

    var promise = new Promise(function (resolve, reject) {
      if (self.plt.is('ios')) {
        self.sqlSrv.createDataBaseIos().then((db: SQLiteObject) => {
          console.log("Banco Conectado no ios");
          self.dataBase = db;
          resolve({ self, db, versaoApp });

        }).catch((error) => {
          console.log("deu errro ios " + error);
          reject(error);
        });
      }
      else {
        self.sqlSrv.createDataBaseAndroid().then((db: SQLiteObject) => {
          console.log("Banco Conectado no android");
          self.dataBase = db;
          resolve({ self, db , versaoApp });
        })
          .catch((error) => {
            console.log("deu errro ios " + error);
            reject(error);
          });
      }
    });

    return promise;
  }

  private criarTabelas = function (param) {
    let self = param.self;
    let db = param.db;
    let versaoApp: string = param.versaoApp;

    var promise = new Promise(function (resolve, reject) {
      var querys: string[] = [];

      // var query = "DROP TABLE IF EXISTS usuario";
      var query:string = "CREATE TABLE IF NOT EXISTS usuario ( ";
      query = query + "usua_id INTEGER PRIMARY KEY AUTOINCREMENT,";
      query = query + "usua_sq_id TEXT,";
      query = query + "usua_nm_usuario TEXT,";
      query = query + "usua_ds_email TEXT,";
      query = query + "usua_tx_senha TEXT,";
      query = query + "usua_in_ajuda INTEGER,";
      query = query + "usua_ds_telefone TEXT,";
      query = query + "usua_tx_urlprofile TEXT)";
      querys.push(query);

      // query = "DROP TABLE IF EXISTS usuario_logado";
      query = "CREATE TABLE IF NOT EXISTS usuario_logado ( ";
      query = query + "usua_id INTEGER PRIMARY KEY )";

      querys.push(query);

      // var query = "DROP TABLE IF EXISTS cupom";
      query = "CREATE TABLE IF NOT EXISTS meu_cupom ( ";
      query = query + "cupo_sq_id TEXT,";
      query = query + "cupo_tx_titulo TEXT,";
      query = query + "cupo_tx_descricao TEXT,";
      query = query + "cupo_tx_regulamento TEXT,";
      query = query + "cupo_dt_validade TEXT,";
      query = query + "cupo_nr_desconto INTEGER,";
      query = query + "cupo_tx_urlimagem TEXT,";
      query = query + "cupo_nr_vlatual REAL,";
      query = query + "cupo_nr_vlcomdesconto REAL,";
      query = query + "empr_sq_id TEXT,";
      query = query + "empr_nm_fantasia TEXT,";
      query = query + "empr_tx_endereco TEXT,";
      query = query + "empr_tx_bairro TEXT,";
      query = query + "empr_tx_cidade TEXT,";
      query = query + "empr_tx_telefone_1 TEXT,";
      query = query + "empr_nr_documento TEXT,";
      query = query + "muni_sq_id TEXT) ";
      querys.push(query);

       // var query = "DROP TABLE IF EXISTS cupom";
       query = "CREATE TABLE IF NOT EXISTS meu_cupom_item ( ";
       query = query + "id INTEGER PRIMARY KEY AUTOINCREMENT,";
       query = query + "cupo_sq_id TEXT,";
       query = query + "cupo_nr_cupom TEXT,"; 
       query = query + "empr_sq_id TEXT,"; 
       query = query + "empr_nm_fantasia TEXT,";
       query = query + "empr_nr_documento TEXT,";
       query = query + "cupo_in_status INTEGER ) ";
       querys.push(query);

      // var query = "DROP TABLE IF EXISTS cupom";
      query = "CREATE TABLE IF NOT EXISTS municipio ( ";
      query = query + "muni_sq_id TEXT,";
      query = query + "muni_nm_municipio TEXT )";
      querys.push(query);

      // var query = "DROP TABLE IF EXISTS versao";
      query = "CREATE TABLE IF NOT EXISTS versao ( ";
      query = query + "ver_nr_versao TEXT)";
      querys.push(query);


      db.sqlBatch(querys).then((data) => {
        resolve({ self, db, versaoApp });     
        console.log("Tabela Usuario e usuario-logado criada " + data);
      })
        .catch((error) => {
          reject(error);
          console.error('Não foi possível criar a tabela usuario e usuario-logado : ', error);
        });
    });
    return promise;
  }


  private verificarVersao = function (param) {
    let self = param.self;
    let db = param.db;
    let versaoApp: string = param.versaoApp;
    let versaoDb: string = "";

    var query = "SELECT ver_nr_versao from versao"
    var promise = new Promise(function (resolve, reject) {
      self.pesquisar(query, {}).then((result) => {
        console.log("rodou o select na tabela de versao");

        console.log("Total de Linha Versao " + result.rows.length);
        
        if (result.rows.length > 0) {

          console.log("Valor " + result.rows.item(0).ver_nr_versao);

          versaoDb = result.rows.item(0).ver_nr_versao;

          console.log("Versao DB " + versaoDb);
          console.log("Versao App " + versaoApp);

          if (versaoDb != versaoApp) {
            var query = "UPDATE versao SET ver_nr_versao = ?"

            self.inserir(query, [versaoApp])
              .then((registro) => {
                if (registro.rowsAffected > 0) {
                  result = registro.insertId;
                }
                console.log("Atualizou a versao");
                resolve({ versaoDb, versaoApp, self, db });
              })
              .catch((error) => {
                console.log("Deu erro na atualizacao da tabela de versao." + error);
                reject(error);
              });
          }
          else {
            resolve({ versaoDb, versaoApp, self, db });
          }
        } else {
          console.log("Entrou no Insert de versao");
          

          var query = "INSERT INTO versao (ver_nr_versao) values ( ? ); "
          self.inserir(query, [versaoApp])
            .then((registro) => {
              if (registro.rowsAffected > 0) {
                result = registro.insertId;
              }
              resolve({ versaoDb, versaoApp, self, db });
              console.log("Inseriu a versao");
            })
            .catch((error) => {
              console.log("Deu erro no insert da tabela de versao." + error[0]);
              reject(error);
            });
        }
      }).catch((error) => {
        console.log("Deu erro na verificacao de versao." + error[0]);
        reject(error);
      });
    });

    return promise;
  }

  private alterarTabelas = function (param) {
    let self = param.self;
    let db = param.db;
    let versaoApp: string = param.versaoApp;
    let versaoDb: string = param.versaoDb;

    var promise = new Promise(function (resolve, reject) {
      var querys: string[] = [];

      console.log("Versao DB " + versaoDb);
      console.log("Versao App " + versaoApp);
      
      if (versaoDb != versaoApp) {
        if (versaoDb == "") {
          var query = "ALTER TABLE meu_cupom ADD COLUMN tipoCupom INTEGER";
          querys.push(query);

          var query = "ALTER TABLE meu_cupom ADD COLUMN cupo_in_status INTEGER";
          querys.push(query);

          var query = "ALTER TABLE meu_cupom ADD COLUMN sort_sq_id TEXT";
          querys.push(query);

          var query = "UPDATE meu_cupom ";
          query = query + "SET tipoCupom = 1 ,"
          query = query + "cupo_in_status = 1 "
          querys.push(query);
        }

        db.sqlBatch(querys).then((data) => {
          resolve({ self, db });
          console.log("Tabela alterada com sucesso" + data);
        })
          .catch((error) => {
            reject(error);
            console.error('Deu erro na alteracao da tabela', error);
          });
      }
      else {
        console.log("Nao precisou alterar tabela");
        resolve({ self, db });
      }

    });
    return promise;
  }



  public getDataBase() {
    return this.dataBase;
  }

  public deletarParamentro(sqlDelete: string, id: any) {
    return this.dataBase.executeSql(sqlDelete, id);
  }

  public deletarTodos(sqlDelete: string) {
    return this.dataBase.executeSql(sqlDelete, {});
  }

  public listarTodos(sqlList: string) {
    return this.dataBase.executeSql(sqlList, {})
      .then(response => {
        let object = [];
        for (let index = 0; index < response.rows.length; index++) {
          object.push(response.rows.item(index));
        }
        return Promise.resolve(object);
      });
  }

  public atualizar(sqlUpdate: any, sqlParm: any) {
    return this.dataBase.executeSql(sqlUpdate, sqlParm);
  }

  public inserir(sqlInsert: string, sqlParam: any) {
    console.log("Lista parametros " + sqlParam);
    return this.dataBase.executeSql(sqlInsert, sqlParam);
  }

  public pesquisar(sqlquery: any, sqlParm: any) {
    console.log("Query " + sqlquery);
    console.log("Lista Parametros " + sqlParm);
    return this.dataBase.executeSql(sqlquery, sqlParm);
  }

}
