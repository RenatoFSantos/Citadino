import { Injectable } from '@angular/core';

/*
  Generated class for the GlobalVar provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class GlobalVar {

  private isLogado:boolean;

  constructor() {
   this.isLogado =  false;
  }

  public getIsLogado():boolean {
    return this.isLogado;
  }

  public setIsLogado(value:boolean){
    this.isLogado =  value;
  }

}
