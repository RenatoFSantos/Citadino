import { usuarioCupomVO } from './../../model/usuarioCupomVO';
import { MappingsService } from './_mappings-service';
import { Injectable } from '@angular/core';
import { FirebaseService } from '../database/firebase-service';

@Injectable()
export class UsuarioCupomService {
  private usuarioCupomRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.usuarioCupomRef = this.fbService.getDataBase().ref('usuariocupom');
  }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getUsuaCupomRef() {
    return this.usuarioCupomRef;
  }

  public salvar(usuarioCupom: usuarioCupomVO) {
    var self = this;
    var usuaKey = usuarioCupom.usua_sq_id;
    var cupoKey = usuarioCupom.cupo_sq_id;

    var promise = new Promise(function (resolve, reject) {
      self.usuarioCupomRef.child(usuaKey).child(cupoKey).set(usuarioCupom)
        .then(() => {
          resolve(true);
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }

  public getMeusCupons(userKey: string) {
    return this.usuarioCupomRef.child(userKey).once('value');
  }
}
