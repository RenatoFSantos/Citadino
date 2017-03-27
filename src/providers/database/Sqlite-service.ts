import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';


@Injectable()
export class SqLiteService {

  db:any;

  constructor(private sqlite: SQLite) {    
  }

  openDatabase() {
    this.sqlite.create({
      name: 'citadinoDB.db',
      location: 'default'
    }).then((objDb: SQLiteObject) => {
        this.db = objDb;
    }).catch(e => console.log(e));
  }

  criarTabela(sqlCreate: string) {
    return this.db.executeSql(sqlCreate, {});
  }

  deletarPorId(sqlDelete: string, id: any) {
    return this.db.executeSql(sqlDelete, {id});
  }

  listarTodos(sqlList: string) {
    return this.db.executeSql(sqlList, {})
      .then(response => {
        let object = [];
        for (let index = 0; index < response.rows.length; index++) {
          object.push(response.rows.item(index));
        }
        return Promise.resolve(object);
      });
  }

  atualizar(sqlUpdate: any, sqlParm:any) {
    return this.db.executeSql(sqlUpdate, {sqlParm});
  }

  inserir(sqlInsert:string, sqlParam:any) {
    return this.db.executeSql(sqlInsert, {sqlParam});
  }
}
