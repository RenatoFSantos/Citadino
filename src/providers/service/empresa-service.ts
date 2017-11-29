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

  public getUsuarioPorEmpresa(empresaKey: string) {
    return this.empresaRef.child(empresaKey).child("usuario").once('value');
  }

  public getSmartSitePorEmpresa(empresaKey: string) {
    return this.empresaRef.child(empresaKey).child('smartsite').once('value');
  }

  public getEmpresaByCnpj(cnpj: string) {
    return this.empresaRef.orderByChild('empr_nr_documento').equalTo(cnpj).once('value');
  }
}