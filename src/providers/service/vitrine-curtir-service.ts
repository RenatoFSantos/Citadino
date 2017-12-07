import { VitrineVO } from './../../model/vitrineVO';
import { CupomVO } from './../../model/cupomVO';
import { CupomEmpresaVO } from './../../model/cupomEmpresaVO';
import { MappingsService } from './_mappings-service';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class VitrineCurtirService {

  private vitrineCurtirRef: any;

  constructor(private fbService: FirebaseService,
    private mapSrv: MappingsService) {
    this.vitrineCurtirRef = this.fbService.getDataBase().ref('vitrinecurtir');
  }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getVitrineCurtirByKey(vtrUid: string, usuaUid: string) {
    return this.getVitrineCurtirRef().child(vtrUid).child(usuaUid).once('value');
  }

  public getVitrineCurtirRef() {
    return this.vitrineCurtirRef;
  }

  public salvar(vtrUid: string, usuaUid: string, value: boolean) {
    return this.vitrineCurtirRef.child(vtrUid).child(usuaUid).set(value);
  }

}
