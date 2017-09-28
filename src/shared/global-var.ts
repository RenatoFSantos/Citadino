import { UsuarioVO } from './../model/usuarioVO';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVar {

  public usuarioLogado:UsuarioVO;
  private isNetworkConnected:boolean;
  private isFirebaseConnected:boolean;

  constructor() {
   this.isNetworkConnected =  false;
   this.isFirebaseConnected =  false;
  }

  public getIsNetworkConnected():boolean {
    return this.isNetworkConnected;
  }

  public setIsNetworkConnected(value:boolean){
    this.isNetworkConnected =  value;
  }

  public getIsFirebaseConnected():boolean {
    return this.isFirebaseConnected;
  }

  public setIsFirebaseConnected(value:boolean) {
    this.isFirebaseConnected =  value;
  }

}
