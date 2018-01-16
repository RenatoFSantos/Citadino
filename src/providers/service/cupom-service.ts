import { CupomVO } from './../../model/cupomVO';
import { MappingsService } from './_mappings-service';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class CupomService {

  private cupomRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.cupomRef = this.fbService.getDataBase().ref('cupom');
  }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getCupomRef() {
    return this.cupomRef;
  }


  public salvar(cupom: CupomVO) {
    var self = this;

    var newKey = cupom.cupo_sq_id != undefined ? cupom.cupo_sq_id : this.cupomRef.push().key;
    var result: string = null;

    var promise = new Promise(function (resolve, reject) {
      self.cupomRef.child(newKey).set(cupom)
        .then(() => {
          result = newKey;
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  public pesquisarCupomPorId(cupomKey: string) {
    return this.cupomRef.child(cupomKey).once("value");
  }
}
