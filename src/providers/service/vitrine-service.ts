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

}