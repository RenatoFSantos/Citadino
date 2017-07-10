import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { FirebaseService } from './../database/firebase-service';
import { Injectable } from '@angular/core';

@Injectable()
export class GuiaService {

  private categoriaRef: any;
  private descritorRef: any;

  constructor(public fbService: FirebaseService) {
    this.categoriaRef = this.fbService.getDataBase().ref('categoria');
    this.descritorRef = this.fbService.getDataBase().ref('descritorempresa');
  }

  public getCategorias() {
    return this.categoriaRef.orderByChild('cate_nm_pesquisa').once('value');
  }

  public getDescritorPorNome(nome: string) {
    return this.descritorRef.orderByChild('desc_nm_pesquisa')
      .startAt(CtdFuncoes.removerAcentos(
        CtdFuncoes.removeEspacosDuplos(nome.toLowerCase().trim())))
      .endAt(CtdFuncoes.removerAcentos(
        CtdFuncoes.removeEspacosDuplos(nome.toLowerCase().trim())) + '\uf8ff')
      .once('value');
  }

  public getEmpresaByCategoria(categoria: string) {
    return this.categoriaRef.child(categoria).child('empresa').orderByChild('empr_nm_razaosocial').once('value');

  }

  public getEmpresaByDescritor(descritor: string) {
    return this.descritorRef.child(descritor).child('empresa').orderByChild('empr_nm_razaosocial').once('value');
  }

}