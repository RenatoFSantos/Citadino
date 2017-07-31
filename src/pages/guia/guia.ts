import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { ItemsService } from './../../providers/service/_items-service';
import { EmpresaVO } from './../../model/empresaVO';
import { FormControl } from '@angular/forms';
import { CategoriaVO } from './../../model/categoriaVO';
import { GuiaService } from './../../providers/service/guia-service';
import { GuiaListaPage } from './../guia-lista/guia-lista';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-guia',
  templateUrl: 'guia.html'
})
export class GuiaPage implements OnInit {

  public categorias: any = [];
  public empresas: any = [];
  public searchDescritor: string = '';
  public searchControl: FormControl;
  public searching: any = false;
  public descritorEnable = false;
  private loadCtrl: any;

  constructor(public navCtrl: NavController,
    public guiaSrv: GuiaService,
    public loadingCtrl: LoadingController,
    private itemSrv: ItemsService,
    private netService: NetworkService,
    private globalVar: GlobalVar) {
    this.searchControl = new FormControl();

    this.getLoadCategorias();
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  ionViewDidLeave() {
    if (this.categorias != null && this.categorias.length == 0) {
      this.getLoadCategorias();
    }
  }

  ionViewDidLoad() {
    let self = this;
    this.searchControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .map(v => v.toLowerCase().trim())
      .subscribe(value => {
        self.empresas = []
        this.searching = false;

        if (value != "") {
          let loader = this.loadingCtrl.create({
            content: 'Aguarde...',
            dismissOnPageChange: true
          });

          loader.present();

          this.guiaSrv.getDescritorPorNome(value).then(snapShot => {
            if (snapShot != null && snapShot.numChildren() > 0) {
              snapShot.forEach(element => {
                if (element.val() != null && element.val().empresa != null) {
                  let itensEmpresas: any = Object.keys(element.val().empresa);

                  itensEmpresas.forEach(item => {
                    let pkVitrine: string = item;

                    if (self.empresas != null && self.empresas.length > 0) {
                      let exist: boolean = self.empresas.some(campo =>
                        campo.empr_sq_id == pkVitrine);

                      if (!exist) {
                        self.empresas.push(element.val().empresa[item]);
                      }
                    } else {
                      self.empresas.push(element.val().empresa[item]);
                    }
                    self.empresas = this.itemSrv.orderBy(self.empresas, ['empr_nm_razaosocial'], ['asc'])
                  });
                }
              });
              loader.dismiss();
            }
            if (self.empresas.length == 0) {
              this.descritorEnable = false;
              self.empresas = [];
            }
            else {
              this.descritorEnable = true;
            }
          });
          loader.dismiss();
        }
        else {
          self.empresas = [];
          this.descritorEnable = false;
        }
      });
  }

  public onSearchInput() {
    this.searching = true;
  }

  public onCleanInput() {
    this.searching = true;
    this.empresas = [];
  }


  private getLoadCategorias() {

    if (this.loadCtrl != null) {
      this.loadCtrl.dismiss();
    }

    if (this.globalVar.getIsFirebaseConnected()) {
      this.loadCtrl = this.loadingCtrl.create({
        spinner: 'circles'
      });
      this.loadCtrl.present();

      this.firstLoadCategorias()
        .then(this.secoundLoadCategorias)
        .then(() => {
          this.loadCtrl.dismiss();
        });
    }
  }

  firstLoadCategorias = function () {
    let self = this;
    let listaCategorias: Array<CategoriaVO> = [];
    var promise = new Promise(function (resolve, reject) {
      self.guiaSrv.getCategorias()
        .then((snapShot) => {
          snapShot.forEach(element => {
            listaCategorias.push(element.val());
          });
          resolve({ listaCategorias, self });
        })
        .catch((error) => {
          reject(error);
        });
    });
    return promise;
  }

  secoundLoadCategorias = function (firstLoadCategorias) {
    let self = firstLoadCategorias.self;
    let listaCategorias: Array<CategoriaVO> = firstLoadCategorias.listaCategorias;

    var promise = new Promise(function (resolve, reject) {
      let length = listaCategorias.length;

      for (let i = 0; i < length; i += 3) {
        let item: Array<CategoriaVO> = [];
        item.push(listaCategorias[i]);

        if (i + 1 < length) {
          item.push(listaCategorias[i + 1]);
        }

        if (i + 2 < length) {
          item.push(listaCategorias[i + 2]);
        }

        for (let i = 0; i <= (3 - item.length); i++) {
          let categoria: Array<CategoriaVO> = [];
          let item = new CategoriaVO();
          categoria.push(item);
        }

        self.categorias.push(item);
      }
      resolve(self.categorias);
    });

    return promise;
  }


  openGuiaCategoria(categoriaNm: string, categoriaKey: string) {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();
    let empresaskey: any = [];
    this.guiaSrv.getEmpresaByCategoria(categoriaKey).then((snapShot) => {
      snapShot.forEach(element => {
        empresaskey.push(element.key);
      });
      loader.dismiss();
      this.navCtrl.push(GuiaListaPage, { categNm: categoriaNm, emprKeys: empresaskey })
    });
    loader.dismiss();
  }

  openGuiaDescritor(descritorNm: string, descritorKey: string) {
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();
    let empresaskey: any = [];
    empresaskey.push(descritorKey)
    loader.dismiss();
    this.navCtrl.push(GuiaListaPage, { categNm: descritorNm, emprKeys: empresaskey })
    // this.guiaSrv.getEmpresaByDescritor(descritorKey).then((snapShot) => {
    //   snapShot.forEach(element => {
    //     empresaskey.push(element.key);
    //   });

    //   loader.dismiss();
    //   if (empresaskey.length > 0) {
    // this.navCtrl.push(GuiaListaPage, { categNm: descritorNm, emprKeys: empresaskey })
    // }
    // });
  }

}
