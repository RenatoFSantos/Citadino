import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class SqlLiteService {

    private dataBase: SQLiteObject;

    constructor() { }

    public createDataBaseIos() {
        let dbCreate = new SQLite();
        console.log("Db IOS");
        return dbCreate.create({
            name: 'citadinodb.db',
            iosDatabaseLocation: 'Library/LocalDatabase'
        });
    }

    public createDataBaseAndroid() {
        var self = this;
        let dbCreate = new SQLite();
        console.log("Db Android");
        return dbCreate.create({
            name: 'citadinodb.db',
            location: 'default'
        });
    }

    public getDataBase() {
        return this.dataBase;
    }
}