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

  public getPathPlantaoFarmacia() {
    let self = this;
    var promise = new Promise(function (resolve, reject) {
      self.fbService.getStorageRef().child('images/infoutil/slide-plantao.jpg')
        .getDownloadURL().then((url) => {

          resolve(url);

        }).catch(() => {
          reject("Não foi possível localizar a imagem.");
        });
    });

    return promise;

  }

  public getPathHorarioOnibus() {
    let self = this;
    let paths: string[] = [];

    var promise = new Promise(function (resolve, reject) {
      self.fbService.getStorageRef().child('images/infoutil/slide-bus-1.jpg')
        .getDownloadURL().then((url1) => {
          paths.push(url1);

          self.fbService.getStorageRef().child('images/infoutil/slide-bus-2.jpg')
            .getDownloadURL().then((url2) => {
              paths.push(url2);

              self.fbService.getStorageRef().child('images/infoutil/slide-bus-3.jpg')
                .getDownloadURL().then((url3) => {
                  paths.push(url3);

                  resolve(paths);

                }).catch(() => {
                  reject("Não foi possível localizar a imagem.");
                });

            }).catch(() => {
              reject("Não foi possível localizar a imagem.");
            });

        }).catch(() => {
          reject("Não foi possível localizar a imagem.");
        });
    });

    return promise;
  }

}