import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class VitrineService {

  private vitrineRef: any;

  constructor(public fbService: FirebaseService) {
    this.vitrineRef = this.fbService.getDataBase().ref('vitrine');
  }

  public getVitrineRef() {
    return this.vitrineRef;
  }

  //Retorna Ref de storage
  getStorageRef() {
    return this.fbService.getStorageRef();
  }

  //Retorna storage
  getStorage() {
    return this.fbService.getStorage();
  }

  public getVitrineRefTotal(seqMunicipio: string) {
    return this.vitrineRef.child(seqMunicipio).orderByChild('vitr_sq_ordem').once('value');
  }

  public getVitrineMunicipio(seqMunicipio: string, limitPage: number, startPk: string) {
    if (startPk == "") {
      return this.vitrineRef.child(seqMunicipio).orderByChild('vitr_sq_ordem').limitToLast(limitPage).once('value');
    } else {
      return this.vitrineRef.child(seqMunicipio).orderByChild('vitr_sq_ordem').endAt(startPk).limitToLast(limitPage).once('value');
    }
  }

  public getNewUidVitrine(seqMunicipio: string): string {
    var newKey = this.vitrineRef.child(seqMunicipio).push().key
    return newKey;
  }

  public salvarWithUid(uid: string, seqMunicipio: string, vitrine: VitrineVO) {
    return this.vitrineRef.child(seqMunicipio).child(uid).set(vitrine);
  }

  public excluir(vitrine: VitrineVO) {

    var vitrineKey = vitrine.vitr_sq_id;
    var municipioKey = vitrine.muni_sq_id;
    var dtVitrine = vitrine.vitr_dt_agendada;

    return this.vitrineRef.child(municipioKey).child(vitrineKey).set(null);
  }

  public getVitrineByKey(municipioKey: string, vitrineKey: string) {

    return this.vitrineRef.child(municipioKey).child(vitrineKey).once('value');
  }

}