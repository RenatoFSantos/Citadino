import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class EmpresaService {

  private empresaRef: any;

  constructor(public fbService: FirebaseService) {
    this.empresaRef = this.fbService.getDataBase().ref('empresa');
  }

  public getEmpresaPorKey(empresaKey: string) {
    return this.empresaRef.child(empresaKey).once('value');
  }

  public getEmpresaRef() {
    return this.empresaRef;
  }


}