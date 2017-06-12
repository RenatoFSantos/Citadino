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
  private descritores: any = [];
  public searchDescritor: string = '';
  public searchControl: FormControl;
  public searching: any = false;
  public descritorEnable = false;
  private loadCtrl: any;

  constructor(public navCtrl: NavController,
    public guiaSrv: GuiaService,
    public loadingCtrl: LoadingController) {
    this.searchControl = new FormControl();
  }

  ngOnInit() {

    this.loadCtrl = this.loadingCtrl.create({
      spinner: 'circles'
    });

    this.loadCtrl.present();

    this.getLoadCategorias();
  }

  ionViewDidLoad() {
    let self = this;
    this.searchControl.valueChanges
      .debounceTime(700)
      .distinctUntilChanged()
      .map(v => v) //.toLowerCase().trim()
      .subscribe(value => {
        self.descritores = []
        this.searching = false;
        if (value != "") {
          this.guiaSrv.getDescritorPorNome(value).then(snapShot => {
            if (snapShot != null && snapShot.numChildren() > 0) {
              snapShot.forEach(element => {
                self.descritores.push(element.val())
              });
            }
            if (self.descritores.length == 0) {
              this.descritorEnable = false;
              self.descritores = [];
            }
            else {
              this.descritorEnable = true;
            }
          });
        }
        else {
          self.descritores = [];
          this.descritorEnable = false;
        }
      });
  }

  public onSearchInput() {
    this.searching = true;
  }

  public onCleanInput() {
    this.searching = true;
    this.descritores = [];
  }

  private getLoadCategorias() {
    let listaCategorias: Array<CategoriaVO> = [];

    this.guiaSrv.getCategorias().then((snapShot) => {
      snapShot.forEach(element => {
        listaCategorias.push(element.val());
      });

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

        this.categorias.push(item);
      }

      this.loadCtrl.dismiss();
    });
  }


  openGuiaCategoria(categoriaNm: string, categoriaKey: string) {
    let empresaskey: any = [];
    this.guiaSrv.getEmpresaByCategoria(categoriaKey).then((snapShot) => {
      snapShot.forEach(element => {
        empresaskey.push(element.key);
      });
      this.navCtrl.push(GuiaListaPage, { categNm: categoriaNm, emprKeys: empresaskey })
    });
  }

  openGuiaDescritor(descritorNm: string, descritorKey: string) {
    let empresaskey: any = [];
    this.guiaSrv.getEmpresaByDescritor(descritorKey).then((snapShot) => {
      snapShot.forEach(element => {
        empresaskey.push(element.key);
      });

      if (empresaskey.length > 0) {
        this.navCtrl.push(GuiaListaPage, { categNm: descritorNm, emprKeys: empresaskey })
      }
    });
  }

}
