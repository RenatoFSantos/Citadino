import { MappingsService } from './../../providers/service/_mappings-service';
import { MunicipioService } from './../../providers/service/municipio-service';
import { MunicipioVO } from './../../model/municipioVO';
import { SlideVO } from './../../model/slideVO';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { VitrineVO } from './../../model/vitrineVO';
import { GlobalVar } from './../../shared/global-var';
import { NetworkService } from './../../providers/service/network-service';
import { ItemsService } from './../../providers/service/_items-service';
import { EmpresaVO } from './../../model/empresaVO';
import { FormControl } from '@angular/forms';
import { CategoriaVO } from './../../model/categoriaVO';
import { GuiaService } from './../../providers/service/guia-service';
import { GuiaListaPage } from './../guia-lista/guia-lista';
import { Component, OnInit } from '@angular/core';
import { NavController, LoadingController, ToastController, Events } from 'ionic-angular';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';

// Guia

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
  private toastAlert: any;

  private municipios: MunicipioVO[] = [];
  private municipioAnterior: string = "";

  constructor(public navCtrl: NavController,
    public guiaSrv: GuiaService,
    public loadingCtrl: LoadingController,
    private itemSrv: ItemsService,
    private netService: NetworkService,
    private globalVar: GlobalVar,
    private toastCtrl: ToastController,
    public events: Events,
    private muniSrv: MunicipioService,
    private mapSrv: MappingsService) {
    this.searchControl = new FormControl();

    this.municipioAnterior = this.globalVar.getMunicipioPadrao().muni_sq_id;
    this.getLoadCategorias();
  }

  ngOnInit() {
    console.log('ngOnInit');
  }

  // ionViewDidLeave() {
  //   if (this.categorias != null && this.categorias.length == 0) {
  //     this.getLoadCategorias();
  //   }
  // }

  ionViewDidEnter() {
    if (this.municipioAnterior != this.globalVar.getMunicipioPadrao().muni_sq_id) {
      this.carregaDadosDescritorEmpresa(this.searchControl.value);
      this.municipioAnterior = this.globalVar.getMunicipioPadrao().muni_sq_id;
    }
  }


  ionViewDidLoad() {
    this.onSearchCategoria();
    this.bancoDadosOnlineEvent();
    this.onChangeMunicipioEvent();
  }

  ionViewWillUnload() {
    this.events.unsubscribe("guia:municipio", null);
  }

  public onSearchInput() {
    this.searching = true;
  }

  public onCleanInput() {
    this.searching = true;
    this.empresas = [];
    
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true,
      duration: 700
    });
    loader.present();
  }


  private onSearchCategoria() {
    let self = this;
    this.searchControl.valueChanges
      .pipe(
      debounceTime(700),
      distinctUntilChanged()
      )
      .map(v => v.toLowerCase().trim())
      .subscribe((value: any) => {
        this.searching = false;
        this.carregaDadosDescritorEmpresa(value);
      });
  }

  private carregaDadosDescritorEmpresa(value: any) {
    let self = this;
    self.empresas = []

    if (value != "") {
      let loader = this.loadingCtrl.create({
        content: 'Aguarde...',
        dismissOnPageChange: true
      });

      loader.present();

      this.guiaSrv.getDescritorPorNome(self.globalVar.getMunicipioPadrao().muni_sq_id, value).then(snapShot => {
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
  }

  private getLoadCategorias() {

    if (this.globalVar.getIsFirebaseConnected()) {

      if (this.loadCtrl != null) {
        this.loadCtrl.dismiss();
      }

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
    else {
      this.createAlert("Ops!!! Não estou conseguindo carregar a guia. Tente mais tarde!");
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


  openGuiaCategoria(categoriaNm: string, categoriaKey: string, cate_in_tipo: string) {
    let self = this;
    let loader = this.loadingCtrl.create({
      content: 'Aguarde...',
      dismissOnPageChange: true
    });

    loader.present();

    if (cate_in_tipo == 'CT' || cate_in_tipo == '' || typeof cate_in_tipo === 'undefined') {
      let empresaskey: any = [];
      this.guiaSrv.getEmpresaByCategoria(self.globalVar.getMunicipioPadrao().muni_sq_id, categoriaKey).then((snapShot) => {
        snapShot.forEach(element => {
          empresaskey.push(element.key);
        });
        loader.dismiss();
        this.navCtrl.push(GuiaListaPage, { categNm: categoriaNm, emprKeys: empresaskey })
      });
    } else if (cate_in_tipo == 'PF') {
      let vitrine: VitrineVO = new VitrineVO();

      this.guiaSrv.getPathPlantaoFarmacia().then((url: any) => {
        let slides: SlideVO[] = [];

        let slide: SlideVO = new SlideVO();
        slide.imageUrl = url;

        slides.push(slide);

        loader.dismiss();
        this.navCtrl.push(AnuncioFullPage, { slideParam: slides, isExcluirImagem: false });

      })
        .catch((error) => {

        });

    }
    else if (cate_in_tipo == 'HO') {
      let vitrine: VitrineVO = new VitrineVO();

      this.guiaSrv.getPathHorarioOnibus().then((paths: any) => {

        let slides: SlideVO[] = [];
        let slide: SlideVO = new SlideVO();

        if (paths.length > 0 && paths.length == 1) {
          slide.imageUrl = paths[0];
          slides.push(slide);

        } else if (paths.length > 0 && paths.length > 1) {
          slide.imageUrl = paths[0];
          slides.push(slide);

          slide = new SlideVO();
          slide.imageUrl = paths[1];
          slides.push(slide);

          slide = new SlideVO();
          slide.imageUrl = paths[2];
          slides.push(slide);
        }

        loader.dismiss();
        this.navCtrl.push(AnuncioFullPage, { slideParam: slides, isExcluirImagem: false });

      }).catch((error) => {

      });
    }
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
  }

  createAlert(errorMessage: string) {
    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 4000,
      position: 'top'
    });

    this.toastAlert.present();
  }

  public bancoDadosOnlineEvent() {
    let self = this;
    this.events.subscribe('firebase:connected', (result: any) => {
      if (result == true) {
        setTimeout(() => {
          if (this.categorias == null ||
            (this.categorias != null && this.categorias.length == 0)) {
            this.getLoadCategorias();
          }
        }, 2500);
      }
    });
  }

  private onChangeMunicipioEvent() {
    let self = this;
    this.events.subscribe("guia:municipio", () => {
      self.municipioAnterior = this.globalVar.getMunicipioPadrao().muni_sq_id;
      self.carregaDadosDescritorEmpresa(self.searchControl.value);
    })
  }
}
