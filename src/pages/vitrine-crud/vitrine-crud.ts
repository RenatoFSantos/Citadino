import { VitrineCurtirService } from './../../providers/service/vitrine-curtir-service';
import { MinhasPublicacoesService } from './../../providers/service/minhas-publicacoes';
import { VitrineService } from './../../providers/service/vitrine-service';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { SlideVO } from './../../model/slideVO';
import { ViewImageDTO } from './../../model/dominio/viewImageDTO';
import { ItemsService } from './../../providers/service/_items-service';
import { BackgroundService } from './../../providers/service/background-service';
import { Camera } from '@ionic-native/camera';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { VitrineVO } from './../../model/vitrineVO';
import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaVO } from './../../model/empresaVO';
import { ViewController, AlertController, ToastController, NavController, Events, LoadingController } from 'ionic-angular';
import { UsuarioVO } from './../../model/usuarioVO';
import { UsuarioService } from './../../providers/service/usuario-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import * as enums from './../../model/dominio/ctdEnum';
import { Component } from '@angular/core';

@Component({
  selector: 'page-vitrine-crud',
  templateUrl: 'vitrine-crud.html',
})
export class VitrineCrudPage {

  private toastAlert: any;
  public frmVitrineCrud: FormGroup;
  public vitrine: VitrineVO = new VitrineVO();
  public imagens: any[] = [];
  private imagemPadrao: any;
  private pathImagens: any[];
  private usuaKey: string = "";

  private seqMunicipio: string = "-KoJyCiR1SOOUrRGimAS";

  constructor(private emprSrv: EmpresaService,
    private usuaSrv: UsuarioService,
    private viewCtrl: ViewController,
    private mapSrv: MappingsService,
    public frmBuilder: FormBuilder,
    private camera: Camera,
    private backSrv: BackgroundService,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private itemsService: ItemsService,
    public navCtrl: NavController,
    private events: Events,
    private vtSrv: VitrineService,
    private mnPublSrv: MinhasPublicacoesService,
    private loadingCtrl: LoadingController,
    private vtrCurt: VitrineCurtirService) {

    this.criarFormulario();
    this.excluirImagemEvent();
  }

  ionViewDidLoad() {
    this.pesquisarEmpresa();
  }

  private pesquisarEmpresa() {
    let self = this;
    self.usuaKey = this.usuaSrv.getLoggedInUser().uid;

    this.usuaSrv.getEmpresaPorUsuario(self.usuaKey).then((snapEmprUsu) => {

      if (snapEmprUsu.val() != null) {
        var emprKey: any = Object.keys(snapEmprUsu.val())[0];
        self.emprSrv.getEmpresaPorKey(emprKey).then((snapEmpresa) => {

          var empresa: EmpresaVO = self.mapSrv.getEmpresa(snapEmpresa.val());

          self.vitrine.empr_sq_id = empresa.empr_sq_id;
          self.vitrine.anun_tx_urlavatar = empresa.empr_tx_logomarca;
          self.vitrine.empr_nm_fantasia = empresa.empr_nm_razaosocial;

          if (snapEmpresa.child("smartsite").exists()) {
            self.vitrine.anun_in_smartsite = true;
          }
          else {
            self.vitrine.anun_in_smartsite = false;
          }

          self.vitrine.muni_sq_id = self.seqMunicipio;
          self.vitrine.anun_in_status = "A"

        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }

  private criarFormulario() {

    this.imagemPadrao = new ViewImageDTO();
    this.imagemPadrao.index = 99;
    this.imagemPadrao.path = "assets/img/camera.png";

    this.frmVitrineCrud = this.frmBuilder.group({
      'anun_tx_titulo': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'anun_tx_texto': ['', Validators.compose([Validators.required, Validators.maxLength(3000)])],
      'anun_tx_urlslide1': ['',],
      'anun_tx_urlslide2': ['',],
      'anun_tx_urlslide3': ['',],
      'anun_tx_urlslide4': ['',]
    });

    this.adicionaImagemPadrao();
  }


  public publicarVitrine(formProfile: any) {

    let self = this;

    if (self.frmVitrineCrud.valid) {


      var vitrineId = self.vtSrv.getNewUidVitrine(self.seqMunicipio);
      var dtAtual = CtdFuncoes.convertDateToStr(new Date(), enums.DateFormat.enUS);
      var nmEmpresa = self.vitrine.empr_nm_fantasia;

      self.vitrine.anun_tx_titulo = self.frmVitrineCrud.controls.anun_tx_titulo.value;
      self.vitrine.anun_tx_texto = self.frmVitrineCrud.controls.anun_tx_texto.value;
      self.vitrine.anun_tx_subtitulo = nmEmpresa.substr(0, 35)
      self.vitrine.vitr_sq_ordem = String(new Date().getTime());
      self.vitrine.vitr_dt_agendada = "";
      self.vitrine.vitr_sq_id = vitrineId;
      self.vitrine.usua_sq_id = self.usuaKey;


      var loader = self.loadingCtrl.create({
        content: 'Aguarde...',
        dismissOnPageChange: true
      });

      loader.present();

      self.carregaListaImagens(self, "images/publicacoes/")
        .then(self.salvarImages)
        .then(() => {
          self.salvarPublicacao(self).then(() => {
            setTimeout(() => {
              // loader.dismiss();
              self.createAlert("Publicação criada com sucesso.");
              // self.events.publish("carregaPublicacao:true");
              self.navCtrl.pop();
            },2000);
          })
            .catch(err => {
              loader.dismiss();
              self.createAlert("Não foi possível criar sua publicação.");
            });
        })
        .catch((err) => {
          loader.dismiss();
          self.createAlert("Não foi possível criar sua publicação.");
        });
    }
  }

  private carregaListaImagens = function (self: any, pathImagem: string) {
    let promises: any = [];

    var dtVitrine: string = self.vitrine.vitr_dt_agendada;
    var vitrineId: string = this.vitrine.vitr_sq_id;

    self.itemsService.removeItems(this.imagens, this.imagemPadrao);

    var promise = new Promise(function (resolve, reject) {

      if (self.imagens != null && self.imagens.length > 0) {
        var count: number = 1;
        self.imagens.forEach(item => {
          promises.push(self.usuaSrv.getStorageRef().child(pathImagem + vitrineId + '/imagem_' + count + '.jpeg').putString(item.path, 'data_url', { contentType: 'image/jpeg' }));
          count++;
        });
      }
      resolve({ promises, self });
    });

    return promise;
  }

  private salvarImages = function (listaImagens) {
    let self = listaImagens.self;
    let vitrineId = self.vitrineId
    let promises = listaImagens.promises;

    self.pathImagens = [];

    var promAll = Promise.all(promises).then(values => {
      values.forEach((snapImagem: any) => {
        self.pathImagens.push(snapImagem.downloadURL);
      });
    });

    return promAll;
  }

  private salvarDadosVitrine = function (self: any) {
    let vitrineId = self.vitrine.vitr_sq_id;
    let imgs: any[] = self.pathImagens;

    var promise = new Promise(function (resolve, reject) {

      if (imgs.length == 1) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
      }
      else if (imgs.length == 2) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
      } else if (imgs.length == 3) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
        self.vitrine.anun_tx_urlslide3 = imgs[2];
      } else if (imgs.length == 4) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
        self.vitrine.anun_tx_urlslide3 = imgs[2];
        self.vitrine.anun_tx_urlslide4 = imgs[3];
      }

      self.vtSrv.salvarWithUid(vitrineId, self.seqMunicipio, self.vitrine).then(() => {
        resolve(self);
      })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }


  private salvarPublicacao = function (self: any) {
    let vitrineId = self.vitrine.vitr_sq_id;
    let imgs: any[] = self.pathImagens;

    var promise = new Promise(function (resolve, reject) {

      if (imgs.length == 1) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
      }
      else if (imgs.length == 2) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
      } else if (imgs.length == 3) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
        self.vitrine.anun_tx_urlslide3 = imgs[2];
      }
      else if (imgs.length == 4) {
        self.vitrine.anun_tx_urlbanner = imgs[0];
        self.vitrine.anun_tx_urlslide1 = imgs[0];
        self.vitrine.anun_tx_urlslide2 = imgs[1];
        self.vitrine.anun_tx_urlslide3 = imgs[2];
        self.vitrine.anun_tx_urlslide4 = imgs[3];
      }

      if (self.imagens.length != null && self.imagens.length - 1 > 0) {
        var nrImg = self.imagens.length - 1;
        self.vitrine.anun_nr_imagens = "+" + nrImg.toString();
      } else {
        self.vitrine.anun_nr_imagens = "";
      }

      self.mnPublSrv.salvar(self.usuaKey, vitrineId, self.vitrine).then(() => {
        resolve(self);
      })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  private selecionarTipoImagem(imagem: ViewImageDTO, imagens: ViewImageDTO[]) {
    if (imagem.index != 99) {
      this.visualizarImagem(imagens);
    } else {
      this.adicionarImagens();
    }
  }

  private visualizarImagem(imagens: ViewImageDTO[]) {
    this.navCtrl.push(AnuncioFullPage, { slideParam: this.retornaLisSlide(imagens), isExcluirImagem: true });
  }

  private retornaLisSlide(imagens: ViewImageDTO[]): SlideVO[] {

    let slides: SlideVO[] = [];

    imagens.forEach(item => {
      if (item.index != 99) {
        let slide: SlideVO = new SlideVO();
        slide.title = "";
        slide.description = "";
        slide.imageUrl = item.path;
        slides.push(slide);
      }
    });

    return slides;
  }

  private adicionarImagens() {
    let tpUpload = this.alertCtrl.create({
      title: 'Adicionar imagem',
      buttons: [
        {
          text: 'Tirar foto',
          handler: () => {
            this.takeThePhoto(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Selecionar da galeria',
          handler: () => {
            this.takeThePhoto(this.camera.PictureSourceType.SAVEDPHOTOALBUM);
          }
        }, {
          text: 'Cancelar',
          handler: () => {
            tpUpload.dismiss();
          }
        }
      ]
    });

    tpUpload.present();

  }

  private takeThePhoto(pictureSourceType) {

    let self = this;
    this.backSrv.enable();

    this.camera.getPicture({
      // allowEdit: true,
      sourceType: pictureSourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      quality: 50,
      targetHeight: 800,
      targetWidth: 570,
      correctOrientation: true,
      mediaType: this.camera.MediaType.PICTURE,
      encodingType: this.camera.EncodingType.JPEG
    })
      .then(
      imageURI => {
        self.imagens.push(self.adicionarImagem("data:image/jpeg;base64," + imageURI));
        self.ordenaImagens();

        if (self.imagens.length > 4) {
          self.itemsService.removeItems(self.imagens, self.imagens[self.imagens.length - 1]);
        }
        self.backSrv.disable();

      },
      error => {
        self.createAlert("Não foi possível selecionar a imagem.")
      }
      );
  }

  private toBase64(url: string) {
    return new Promise<string>(function (resolve) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'blob';
      xhr.onload = function () {
        var reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result);
        }
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.send();
    });
  }

  private adicionarImagem(path: string): ViewImageDTO {

    let viewImage: ViewImageDTO = new ViewImageDTO();
    viewImage.path = path;
    viewImage.index = this.imagens.length + 1;

    return viewImage;
  }

  private createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }

  private adicionaImagemPadrao() {
    this.imagens.push(this.imagemPadrao);
  }

  private ordenaImagens() {

    this.imagens = this.itemsService.orderBy(this.imagens, ['index'], ['asc'])
  }

  private excluirImagemEvent() {
    let self = this;
    this.events.subscribe('excluirImagem:true', (result) => {

      if (result != null) {
        self.itemsService.removeItems(self.imagens, self.imagens[result]);


        if (self.imagens.length < 4) {

          if (self.itemsService.findElement(self.imagens, self.imagemPadrao) == null) {
            self.adicionaImagemPadrao();
          }
        }
        self.ordenaImagens();
      }

    });
  }
}



// var httpsReference = self.usuaSrv.getStorage().refFromURL(self.vitrine.anun_tx_urlslide1);

//         console.log(httpsReference);

//         // self.mnPublSrv.salvar(self.usuaKey, vitrineId, self.vitrine);
