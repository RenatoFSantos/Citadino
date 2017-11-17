import { MappingsService } from './_mappings-service';
import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class MeusMarcadosService {

  private meusMarcadosRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.meusMarcadosRef = this.fbService.getDataBase().ref('minhavitrine');
  }

  public getMeusMarcadosRef() {
    return this.meusMarcadosRef;
  }

  public getMeusMarcadosPorUsuario(uidUsuario: string) {
    return this.meusMarcadosRef.child(uidUsuario).orderByKey().once('value');
  }

  public salvar(uidUsuario: string, vitrine: VitrineVO) {
    var newKey = this.meusMarcadosRef.child(uidUsuario).push().key
    this.meusMarcadosRef.child(uidUsuario).child(newKey).set(vitrine);
  }

  public excluir(uidUsuario: string, uidMinhaVitrine: string) {
    let self = this;
    var promise = new Promise(function (resolve, reject) {
      self.meusMarcadosRef.child(uidUsuario).child(uidMinhaVitrine).remove()
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
    return this.meusMarcadosRef.child(uidUsuario).orderByChild('vitr_sq_id').equalTo(uidVitrine).once('value');
  }

}