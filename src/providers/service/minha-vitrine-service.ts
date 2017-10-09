import { MappingsService } from './_mappings-service';
import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class MinhaVitrineService {

  private minhaVitrineRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.minhaVitrineRef = this.fbService.getDataBase().ref('minhavitrine');
  }

  public getMinhaVitrineRef() {
    return this.minhaVitrineRef;
  }

  public getMinhaVitrinePorUsuario(uidUsuario: string) {
    return this.minhaVitrineRef.child(uidUsuario).orderByKey().once('value');
  }

  public salvar(uidUsuario: string, vitrine: VitrineVO) {
    var newKey = this.minhaVitrineRef.child(uidUsuario).push().key
    this.minhaVitrineRef.child(uidUsuario).child(newKey).set(vitrine[0]);
  }

  public excluir(uidUsuario: string, uidMinhaVitrine: string) {
    let self = this;
    var promise = new Promise(function (resolve, reject) {
      self.minhaVitrineRef.child(uidUsuario).child(uidMinhaVitrine).remove()
        .then(() => {
          resolve(true);
        }).catch(() => {
          reject(false);
        }
        );
    });

    return promise;
  }

  // public pesquisaPorUidVitrine(uidUsuario: string, uidVitrine: string) {
  //     return this.minhaVitrineRef.child(uidUsuario).child(uidVitrine).once('value');
  //   }

  public pesquisaPorUidVitrine(uidUsuario: string, uidVitrine: string) {
    return this.minhaVitrineRef.child(uidUsuario).orderByChild('vitr_sq_id').equalTo(uidVitrine).once('value');
  }

}