import { VitrineVO } from './../../model/vitrineVO';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class VitrineService {

  private vitrineRef: any;
  private cupomCriadoRef: any;

  constructor(public fbService: FirebaseService) {
    this.vitrineRef = this.fbService.getDataBase().ref('vitrine');
    this.cupomCriadoRef = this.fbService.getDataBase().ref('cupomcriado');
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
    return this.vitrineRef.child(seqMunicipio).orderByChild('vitr_sq_ordem').once('value')
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

  public visitarVitrine(vitrine: VitrineVO) {
    return  this.vitrineRef.child(vitrine.muni_sq_id).child(vitrine.vitr_sq_id).child("anun_nr_visitas");
  }

  public curtirVitrine(vitrine: VitrineVO) {
    return this.vitrineRef.child(vitrine.muni_sq_id).child(vitrine.vitr_sq_id).child("anun_nr_curtidas");
  }

  public baixarCupomTransacion(municipioKey: string, vitrineKey: String) {
    return this.vitrineRef.child(municipioKey).child(vitrineKey).child("cupo_nr_qtdedisponivel");
  }

  public atualizaCurtirVitrineTodos(keyMunicipio: string, vitrine: VitrineVO, nrCurtida: any) {
    let self = this;

    self.vitrineRef.child(keyMunicipio).child(vitrine.vitr_sq_id).once("value")
      .then(snapChild => {
        if (snapChild.exists()) {
          this.vitrineRef.child(keyMunicipio).child(vitrine.vitr_sq_id).child("anun_nr_curtidas").set(nrCurtida);
        }
      });
  }

  public atualizaNrVisitaTodos(keyMunicipio: string, vitrine: VitrineVO, nrVisitas: any) {
    let self = this;

    self.vitrineRef.child(keyMunicipio).child(vitrine.vitr_sq_id).once("value")
      .then(snapChild => {
        if (snapChild.exists()) {
          this.vitrineRef.child(keyMunicipio).child(vitrine.vitr_sq_id).child("anun_nr_visitas").set(nrVisitas);
        }
      });
  }

  // public baixarCupom() {
  //   return this.cupomCriadoRef.child("3rWFZa3v3KTWcks1DSlZJj476Bo2/-L39lWkpyuoBLP_w94j4/cupo_nr_qtdedisponivel");

  // }
}