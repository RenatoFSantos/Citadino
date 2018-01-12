import { MunicipioVO } from './../model/municipioVO';
import { UsuarioVO } from './../model/usuarioVO';
import { Injectable } from '@angular/core';

@Injectable()
export class GlobalVar {

  public usuarioLogado: any;
  private isNetworkConnected: boolean;
  private isFirebaseConnected: boolean;
  private isSqlConnected: boolean;
  private isCordova: boolean;
  private municipioPadrao:MunicipioVO;


  constructor() {
    this.isNetworkConnected = false;
    this.isFirebaseConnected = false;
    this.isSqlConnected = false;
    this.isCordova = false;
    this.municipioPadrao = null;

  }

  public getIsNetworkConnected(): boolean {
    return this.isNetworkConnected;
  }

  public setIsNetworkConnected(value: boolean) {
    this.isNetworkConnected = value;
  }

  public getIsFirebaseConnected(): boolean {
    return this.isFirebaseConnected;
  }

  public setIsFirebaseConnected(value: boolean) {
    this.isFirebaseConnected = value;
  }


  public setIsSqlConnected(value: boolean) {
    this.isSqlConnected = value;
  }

  public getIsSqlConnected(): boolean {
    return this.isSqlConnected;
  }

  public setIsCordova(value: boolean) {
    this.isCordova = value;
  }

  public getIsCordova(): boolean {
    return this.isCordova;
  }


  public isBtnAdicionarVitrine(): boolean {
    var result: boolean = false;

    if (this.usuarioLogado.empresa != null || this.usuarioLogado.usua_sg_perfil == "ADM") {
      result = true;
    }

    return result;
  }

  public setMunicipioPadrao(munic:MunicipioVO) {
    this.municipioPadrao = munic;
  }

  public getMunicipioPadrao() {
    return this.municipioPadrao;
  }

}
