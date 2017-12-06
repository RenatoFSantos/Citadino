import { MappingsService } from './_mappings-service';
import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class MinhasPublicacoesService {

  private minhasPublicacoesRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.minhasPublicacoesRef = this.fbService.getDataBase().ref('minhaspublicacoes');
  }


  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getMinhasPublicacoesRef() {
    return this.minhasPublicacoesRef;
  }

  public getMinhasPublicacoesPorUsuario(uidUsuario: string) {
    return this.minhasPublicacoesRef.child(uidUsuario).orderByChild('vitr_sq_ordem');
  }

  public salvar(uidUsuario: string, uidVitrine: string, vitrine: VitrineVO) {
    return this.minhasPublicacoesRef.child(uidUsuario).child(uidVitrine).set(vitrine);
  }

  public excluir(uidUsuario: string, uidMinhaVitrine: string) {
    let self = this;
    var promise = new Promise(function (resolve, reject) {
      self.minhasPublicacoesRef.child(uidUsuario).child(uidMinhaVitrine).remove()
        .then(() => {
          resolve(true);
        }).catch(() => {
          reject(false);
        }
        );
    });

    return promise;
  }

  public pesquisaPorUidVitrine(uidUsuario: string, uidVitrine: string) {
    return this.minhasPublicacoesRef.child(uidUsuario).child(uidVitrine).once('value');
  }


  public atualizarDadosVitrine(newVitrine: VitrineVO) {

    let updates = {};

    updates['/minhaspublicacoes/' + newVitrine.usua_sq_id + '/' + newVitrine.vitr_sq_id + '/anun_nr_visitas'] = newVitrine.anun_nr_visitas;
    updates['/minhaspublicacoes/' + newVitrine.usua_sq_id + '/' + newVitrine.vitr_sq_id + '/anun_nr_curtidas'] = newVitrine.anun_nr_curtidas;
    updates['/minhaspublicacoes/' + newVitrine.usua_sq_id + '/' + newVitrine.vitr_sq_id + '/anun_in_curtida'] = newVitrine.anun_in_curtida;

    this.getDataBaseRef().update(updates);

  }
}