import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class MunicipioService {

  private municipioRef: any;

  constructor(private fbService: FirebaseService) {

    this.municipioRef = fbService.getDataBase().ref("/municipio");

  }

  getMunicipioRef() {
    return this.municipioRef;
  }

  findMunicipioById(uid: string) {
    return this.municipioRef.child(uid).once('value');
  }

  listMunicipio() {
    return this.municipioRef.orderByChild('muni_nm_municipio').once('value');
  }

}
