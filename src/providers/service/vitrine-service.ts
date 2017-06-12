import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class VitrineService {

  private vitrineRef: any;

  constructor(public fbService: FirebaseService) {
    this.vitrineRef = this.fbService.getDataBase().ref('municipio_agenda');
  }

  public getVitrineRef() {
    return this.vitrineRef;
  }

  public getVitrineRefTotal(seqMunicipio: string) {
    return this.vitrineRef.child(seqMunicipio).orderByChild('agen_sq_agenda').once('value');
  }

  public getVitrineMunicipio(seqMunicipio: string, limitPage: number, startPk: string) {
    if (startPk == "") {
      return this.vitrineRef.child(seqMunicipio).orderByChild('agen_sq_agenda').limitToLast(limitPage).once('value');
    } else {
      return this.vitrineRef.child(seqMunicipio).orderByChild('agen_sq_agenda').limitToFirst(limitPage).startAt(startPk).once('value');
    }
  }

}