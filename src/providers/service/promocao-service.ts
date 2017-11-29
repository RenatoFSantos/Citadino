import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class PromocaoService {

  private promocaoRef: any;

  constructor(private fbService: FirebaseService) {
    this.promocaoRef = this.fbService.getDataBase().ref('promocao');
  }

  public getDataBaseRef() {
    return this.fbService.getDataBase().ref();
  }

  public getPromocaoRef() {
    return this.promocaoRef;
  }

  public salvar() {
    var promocao = {
      prom_sq_id: 1,
      prom_in_ativo: true
    }

    this.promocaoRef.once("value").then((result) => {
      if (result.val() == null) {
        this.promocaoRef.push().set(promocao);
      }
    });
  }

  public getPromocao() {
    return this.promocaoRef.once("value");
  }
}
