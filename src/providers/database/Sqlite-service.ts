import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';


@Injectable()
export class SqLiteService {

  private dataBase: SQLiteObject;

  constructor() {}

  InitDatabase() {
    var self = this;
    let dbCreate = new SQLite();
    dbCreate.create({
      name: 'citadinodb.db',
      location: 'default', // the location field is required
      iosDatabaseLocation: 'Documents'
    }).then((db: SQLiteObject) => {
      self.dataBase = db;
      self.createUser();
      // self.dropUser();
    }, (err) => {
      console.error('Não foi possível abri o banco de dados: ', err);
    });
  }

  public getDataBase() {
    return this.dataBase;
  }

  deletarPorId(sqlDelete: string, id: any) {
    return this.dataBase.executeSql(sqlDelete, { id });
  }

  listarTodos(sqlList: string) {
    return this.dataBase.executeSql(sqlList, {})
      .then(response => {
        let object = [];
        for (let index = 0; index < response.rows.length; index++) {
          object.push(response.rows.item(index));
        }
        return Promise.resolve(object);
      });
  }

  atualizar(sqlUpdate: any, sqlParm: any) {
    return this.dataBase.executeSql(sqlUpdate, { sqlParm });
  }

  inserir(sqlInsert: string, sqlParam: any) {
    console.log("teste paramentros " + sqlParam);
    return this.dataBase.executeSql(sqlInsert, sqlParam);
  }

  private createUser() {
    var self = this;
    var query = "CREATE TABLE IF NOT EXISTS Usuario ( ";
    query = query + "usua_id INTEGER PRIMARY KEY AUTOINCREMENT,";
    query = query + "usua_sq_id TEXT,";
    query = query + "usua_nm_usuario TEXT,";
    query = query + "usua_ds_email TEXT,";
    query = query + "usua_tx_senha TEXT,";
    query = query + "usua_in_ajuda INTEGER );";


    self.dataBase.executeSql(query, {}).then((data) => {
      console.log("Tabela criada " + data);
    }, (err) => {
      console.error('Não foi possível criar a tabela Usuario: ', err);
    });
  }

  pesquisar(sqlquery: any, sqlParm: any) {
    console.log("Query " + sqlquery);
    console.log("Parametros " + sqlParm);
    return this.dataBase.executeSql(sqlquery, sqlParm);
  }

}
