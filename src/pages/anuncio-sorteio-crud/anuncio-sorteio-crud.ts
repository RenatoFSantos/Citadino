import { CupomUsuarioDTO } from './../../model/dominio/cupomUsuarioDTO';
import { SorteioCriadoService } from './../../providers/service/sorteio-criado-service';
import { CupomCriadoVO } from './../../model/cupomCriadoVO';
import { CupomEmpresaDTO } from './../../model/dominio/cupomEmpresaDTO';
import { UsuarioVO } from './../../model/usuarioVO';
import { CtdFuncoes } from './../../shared/ctdFuncoes';
import { MappingsService } from './../../providers/service/_mappings-service';
import { EmpresaVO } from './../../model/empresaVO';
import { UsuarioService } from './../../providers/service/usuario-service';
import { EmpresaService } from './../../providers/service/empresa-service';
import { SlideVO } from './../../model/slideVO';
import { ItemsService } from './../../providers/service/_items-service';
import { Camera } from '@ionic-native/camera';
import { BackgroundService } from './../../providers/service/background-service';
import { CurrencyMask } from './../../shared/currency-mask';
import { ViewImageDTO } from './../../model/dominio/viewImageDTO';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Events, LoadingController } from 'ionic-angular';
import { AnuncioFullPage } from '../anuncio-full/anuncio-full';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import * as enums from './../../model/dominio/ctdEnum';
import { GlobalVar } from '../../shared/global-var';

@Component({
  selector: 'page-anuncio-sorteio-crud',
  templateUrl: 'anuncio-sorteio-crud.html',
})
export class AnuncioSorteioCrudPage {

  public frmSorteioCrud: FormGroup;
  public sorteio: CupomCriadoVO = new CupomCriadoVO();
  public titulo: string = "Criar Sorteio";
  public imagens: any[] = [];
  public dateMin: any = "";
  public dateMax: any = "";
  private toastAlert: any;
  private usuaKey: string = "";
  private dtAtual: any;
  public usuario: UsuarioVO;

  private imagemPadrao: any;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private frmBuilder: FormBuilder,
    private currencyMask: CurrencyMask,
    private alertCtrl: AlertController,
    private backSrv: BackgroundService,
    private itemsService: ItemsService,
    private camera: Camera,
    private toastCtrl: ToastController,
    private events: Events,
    private emprSrv: EmpresaService,
    private usuaSrv: UsuarioService,
    private mapSrv: MappingsService,
    private loadingCtrl: LoadingController,
    private glbVar: GlobalVar,
    private cupoCriaSrv: SorteioCriadoService) {

    var data: Date = new Date();
    this.dateMin = data.getFullYear();
    this.dateMax = data.getFullYear() + 2;
    this.dtAtual = CtdFuncoes.convertDateToStr(data, enums.DateFormat.enUS);

    this.usuario = glbVar.usuarioLogado;
    this.excluirImagemEvent();
    this.criarFormulario();
  }

  ionViewDidLoad() {
    this.pesquisarEmpresaUsuario();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('excluirImagem:true', null);
  }

  private criarFormulario() {

    this.imagemPadrao = new ViewImageDTO();
    this.imagemPadrao.index = 99;
    this.imagemPadrao.path = "assets/img/camera.png";

    this.frmSorteioCrud = new FormGroup({
      cupo_tx_titulo: new FormControl('', [Validators.required]),
      cupo_tx_descricao: new FormControl('', [Validators.required]),
      cupo_tx_regulamento: new FormControl('', [Validators.required]),
      cupo_dt_validade: new FormControl('', [Validators.required]),
      cupo_nr_qtdecupom: new FormControl('', [Validators.required]),
      cupo_in_status: new FormControl()
    });

    this.adicionaImagemPadrao();
  }

  private adicionaImagemPadrao() {
    this.imagens.push(this.imagemPadrao);
  }

  public salvar(form: any) {

    let self = this;

    if (self.frmSorteioCrud.valid) {

      var cupomId = self.cupoCriaSrv.getNewUidCpom();

      var usuarioParam: CupomUsuarioDTO = new CupomUsuarioDTO();
      usuarioParam.usua_sq_id = this.usuario.usua_sq_id;
      usuarioParam.usua_nm_usuario = this.usuario.usua_nm_usuario;

      self.sorteio.tipo_tx_anuncio = 'TPA-SORTEIO';
      self.sorteio.tipoCupom = 2;
      self.sorteio.usuario = usuarioParam;
      self.sorteio.cupo_sq_id = cupomId;
      self.sorteio.cupo_tx_titulo = self.frmSorteioCrud.controls.cupo_tx_titulo.value;
      self.sorteio.cupo_tx_descricao = self.frmSorteioCrud.controls.cupo_tx_descricao.value;
      self.sorteio.cupo_tx_regulamento = self.frmSorteioCrud.controls.cupo_tx_regulamento.value;
      self.sorteio.cupo_dt_validade = self.frmSorteioCrud.controls.cupo_dt_validade.value;
      self.sorteio.cupo_nr_qtdecupom = self.frmSorteioCrud.controls.cupo_nr_qtdecupom.value;
      self.sorteio.cupo_nr_qtdedisponivel = 0;
      self.sorteio.cupo_nr_vlatual = 0;
      self.sorteio.cupo_nr_desconto = 0;

      self.sorteio.cupo_in_status = true;
      self.sorteio.cupo_dt_cadastro = self.dtAtual;
      self.sorteio.cupo_sq_ordem = String(new Date().getTime());
      self.sorteio.cupo_nr_vlcomdesconto = 0
      self.sorteio.cupo_dt_publicado = null;

      var loader = self.loadingCtrl.create({
        content: 'Aguarde...',
        dismissOnPageChange: true
      });

      loader.present();

      self.carregaListaImagens(self, "images/sorteios/")
        .then(self.salvarImages)
        .then(() => {
          self.salvarCupom(self).then(() => {
            loader.dismiss();
            setTimeout(() => {
              self.createAlert("Promoção criada com sucesso.");
              self.events.publish("carregaPromocoes:true");
              self.navCtrl.pop();
            }, 1000);
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

    var cupomId: string = self.sorteio.cupo_sq_id;

    self.itemsService.removeItems(this.imagens, this.imagemPadrao);

    var promise = new Promise(function (resolve, reject) {

      if (self.imagens != null && self.imagens.length > 0) {
        var count: number = 1;
        self.imagens.forEach(item => {
          promises.push(self.usuaSrv.getStorageRef().child(pathImagem + cupomId + '/imagem_' + count + '.jpeg').putString(item.path, 'data_url', { contentType: 'image/jpeg' }));
          count++;
        });
      }
      resolve({ promises, self });
    });

    return promise;
  }

  private salvarImages = function (listaImagens) {
    let self = listaImagens.self;
    let cupomId = self.cupomId
    let promises = listaImagens.promises;

    self.pathImagens = [];

    var promAll = Promise.all(promises).then(values => {
      values.forEach((snapImagem: any) => {
        self.pathImagens.push(snapImagem.downloadURL);
      });
    });

    return promAll;
  }

  private salvarCupom = function (self: any) {
    let cupomId = self.sorteio.cupo_sq_id;
    let imgs: any[] = self.pathImagens;

    var promise = new Promise(function (resolve, reject) {

      if (imgs.length == 1) {
        self.sorteio.cupo_tx_urlimagem = imgs[0];
      }

      self.cupoCriaSrv.salvar(cupomId, self.sorteio).then(() => {
        resolve(self);
      })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }


  currencyChange() {
    let self = this;
    self.sorteio.cupo_nr_vlatual = self.currencyMask.detectAmount(self.sorteio.cupo_nr_vlatual);
  }

  clearDate() {
    this.sorteio.cupo_dt_validade = null;
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

          if (self.imagens.length > 1) {
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

  private ordenaImagens() {

    this.imagens = this.itemsService.orderBy(this.imagens, ['index'], ['asc'])
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

  private adicionarImagem(path: string): ViewImageDTO {

    let viewImage: ViewImageDTO = new ViewImageDTO();
    viewImage.path = path;
    viewImage.index = this.imagens.length + 1;

    return viewImage;
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

  private pesquisarEmpresaUsuario() {
    let self = this;
    self.usuaKey = this.usuaSrv.getLoggedInUser().uid;

    this.usuaSrv.getEmpresaPorUsuario(self.usuaKey).then((snapEmprUsu) => {

      if (snapEmprUsu.val() != null) {
        var emprKey: any = Object.keys(snapEmprUsu.val())[0];
        self.emprSrv.getEmpresaPorKey(emprKey).then((snapEmpresa) => {

          var empresa: EmpresaVO = self.mapSrv.getEmpresa(snapEmpresa.val());
          var cupomEmpresa: CupomEmpresaDTO = new CupomEmpresaDTO();

          cupomEmpresa.empr_sq_id = empresa.empr_sq_id;

          if (empresa.empr_nm_fantasia != null && empresa.empr_nm_fantasia != "") {
            cupomEmpresa.empr_nm_fantasia = empresa.empr_nm_fantasia;
          }
          else {
            cupomEmpresa.empr_nm_fantasia = empresa.empr_nm_razaosocial;
          }

          cupomEmpresa.empr_tx_bairro = empresa.empr_tx_bairro;
          cupomEmpresa.empr_tx_cidade = empresa.empr_tx_cidade;
          cupomEmpresa.empr_tx_endereco = empresa.empr_tx_endereco;
          cupomEmpresa.empr_tx_telefone_1 = empresa.empr_tx_telefone_1;
          cupomEmpresa.empr_nr_documento = empresa.empr_nr_documento
          cupomEmpresa.municipio = empresa.municipio;

          self.sorteio.empresa = cupomEmpresa;

        }).catch((error) => {
          console.log(error);
        });
      }
    });
  }


  // onSelectChange(selectedValue: any) {
  //   if (selectedValue == 1) {
  //     this.frmSorteioCrud.addControl('cupo_nr_desconto', new FormControl("", Validators.required));
  //     this.frmSorteioCrud.addControl('cupo_nr_vlatual', new FormControl("", Validators.required));
  //   }
  //   else {
  //     this.frmSorteioCrud.removeControl('cupo_nr_desconto');
  //     this.frmSorteioCrud.removeControl('cupo_nr_vlatual');
  //   }
  // }

}
