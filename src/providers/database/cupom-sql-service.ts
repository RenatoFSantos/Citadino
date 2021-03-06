import { GlobalVar } from './../../shared/global-var';
import { SqlLiteService } from './sqlLite-service';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { database } from 'firebase/app';

@Injectable()
export class CupomSqlService {

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
        self.sqlSrv.createDataBaseIos().then((db: SQLiteObject) => {
          resolve({ self, db });
        }).catch((error) => {
          reject(error);
        });
      }
      else {
        self.sqlSrv.createDataBaseAndroid().then((db: SQLiteObject) => {
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

      // var query = "DROP TABLE IF EXISTS cupom";
      var query = "CREATE TABLE IF NOT EXISTS meu_cupom ( ";
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
      query = query + "empr_tx_telefone_1 TEXT,";
      query = query + "empr_nr_documento TEXT,";      
      query = query + "muni_sq_id TEXT)";

      querys.push(query);

      db.sqlBatch(querys).then((data) => {
        resolve({ self, db });        
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
