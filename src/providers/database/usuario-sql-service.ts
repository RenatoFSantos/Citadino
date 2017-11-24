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
    var self = this;

    this.criarBancoDados()
      .then(self.criarTabelas)
      .then((result: any) => {
        console.log("Retorno :" + result.db);
        this.dataBase = result.db;
      })
      .catch((error) => {
        throw new Error("Não foi possivel conectar");
      });
  }

  private criarBancoDados = function () {
    let self = this;
    let connection: any;

    var promise = new Promise(function (resolve, reject) {
      if (self.plt.is('ios')) {
        this.sqlSrv.createDataBaseIos().then((db: SQLiteObject) => {
          console.log("Banco Conectado no ios");
          resolve({ self, db });

        }).catch((error) => {
          reject(error);
        });
      }
      else {
        self.sqlSrv.createDataBaseAndroid().then((db: SQLiteObject) => {
          console.log("Banco Conectado no android");
          resolve({ self, db });
        })
          .catch((error) => {
            reject(error);
          });
      }
    });

    return promise;
  }

  private criarTabelas = function (bandodados) {
    let self = bandodados.self;
    let db = bandodados.db;

    var promise = new Promise(function (resolve, reject) {
      var querys: string[] = [];

      // var query = "DROP TABLE IF EXISTS usuario";
      var query = "CREATE TABLE IF NOT EXISTS usuario ( ";
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

      db.sqlBatch(querys).then((data) => {
        resolve({ self, db });
        console.log("Tabela Usuario e usuario-logado criada " + data);
      })
        .catch((error) => {
          reject(error);
          console.error('Não foi possível criar a tabela usuario e usuario-logado : ', error);
        });
    });

    return promise;
  }


  public getDataBase() {
    return this.dataBase;
  }

  public deletarPorId(sqlDelete: string, id: any) {
    return this.dataBase.executeSql(sqlDelete, { id });
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
    return this.dataBase.executeSql(sqlUpdate, { sqlParm });
  }

  public inserir(sqlInsert: string, sqlParam: any) {
    console.log("teste paramentros " + sqlParam);
    return this.dataBase.executeSql(sqlInsert, sqlParam);
  }


  public pesquisar(sqlquery: any, sqlParm: any) {
    console.log("Query " + sqlquery);
    console.log("Parametros " + sqlParm);
    return this.dataBase.executeSql(sqlquery, sqlParm);
  }

}
