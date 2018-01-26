import { ItemsService } from './../../providers/service/_items-service';
import { MunicipioVO } from './../../model/municipioVO';
import { MunicipioService } from './../../providers/service/municipio-service';
import { ValidationResult } from './../../shared/interfaces';
import { FirebaseService } from './../../providers/database/firebase-service';
import { BackgroundService } from './../../providers/service/background-service';

import { MappingsService } from './../../providers/service/_mappings-service';
import { UsuarioService } from './../../providers/service/usuario-service';
import { EmailValidator } from './../../shared/validators/email.validator';
import { UsuarioVO } from './../../model/usuarioVO';
import { FormGroup, FormBuilder, AbstractControl, Validators, FormControl } from '@angular/forms';
import { NavController, NavParams, AlertController, ToastController, Events, LoadingController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Camera } from '@ionic-native/camera';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  myPhoto: any;
  frmProfile: FormGroup;
  maskTel: any;
  usuario: UsuarioVO = new UsuarioVO();
  toastAlert: any;
  uidUsuario: string;
  changeImageProfile: boolean = false;

  private municipioSelected: MunicipioVO;
  public municipios: Array<MunicipioVO> = [];

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public frmBuilder: FormBuilder,
    private usuaSrv: UsuarioService,
    private mapSrv: MappingsService,
    private alertCtrl: AlertController,
    private camera: Camera,
    private backSrv: BackgroundService,
    private toastCtrl: ToastController,
    private fbs: FirebaseService,
    private event: Events,
    private loadingCtrl: LoadingController,
    private municSrv: MunicipioService,
    private itenSrv: ItemsService) {

    this.createForm();
    this.listaMunicipio();

  }

  createForm() {

    let self = this;

    this.frmProfile = this.frmBuilder.group({
      'usua_nm_usuario': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
      'usua_ds_email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'usua_ds_telefone': '',
      'usua_tx_senha_atual': ['', Validators.compose([Validators.minLength(6)])],
      'usua_tx_senha': ['', Validators.compose([Validators.minLength(6)])],
      'usua_tx_nova_senha': ['', Validators.compose([Validators.minLength(6)])],
      'muni_sq_id': ['', Validators.compose([Validators.required])]
    }, { validator: senhaDiferente('usua_tx_senha', 'usua_tx_nova_senha') });


    function senhaDiferente(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup): { [key: string]: any } => {
        let password = group.controls[passwordKey];
        let confirmPassword = group.controls[confirmPasswordKey];

        if (password.value !== confirmPassword.value) {
          return {
            senhaDiferente: true
          };
        }
      }
    }
  }

  ionViewDidLoad() {
    this.getUsuario();
  }

  private getUsuario() {
    let self = this;
    self.uidUsuario = this.usuaSrv.getLoggedInUser().uid;

    this.usuaSrv.getUserDetail(self.uidUsuario).then((snapUsua) => {
      self.usuario = self.mapSrv.getUsuario(snapUsua);

      if (self.usuario.usua_tx_urlprofile != '') {
        this.myPhoto = self.usuario.usua_tx_urlprofile;
      }
      else {
        this.myPhoto = 'assets/img/profile/profile.png';
      }
    })
  }

  private listaMunicipio() {
    let self = this;

    self.municSrv.listMunicipio().then((municSnap) => {
      var munickey: any[] = Object.keys(municSnap.val());
      munickey.forEach(element => {
        var munic: MunicipioVO = self.mapSrv.getMunicipio(municSnap.val()[element]);
        self.municipios.push(munic);
      });
    });
  }

  onSubmit(formProfile: any): void {
    var self = this;
    var loaderPerfil: any;

    if (self.frmProfile.valid) {

      loaderPerfil = self.loadingCtrl.create({
        content: 'Aguarde... atualizando o perfil',
        dismissOnPageChange: true
      });

      loaderPerfil.present();

      this.trocarSenha()
        .then(this.salvarImage)
        .then(this.salvarDadosUsuario)
        .then(() => {
          loaderPerfil.dismiss();
          self.event.publish('dadosUsuario:alterado', self.usuario);
          this.createAlert("Dados atualizado com sucesso.");
        })
        .catch((error) => {
          loaderPerfil.dismiss();
          this.createAlert(error);
        })
    }
  }

  trocarSenha = function () {
    let self = this;
    let result: boolean = false;
    var promise = new Promise(function (resolve, reject) {

      var emailUser = self.usuario.usua_ds_email;
      var currentPassword: any = self.frmProfile.controls.usua_tx_senha_atual.value;
      var newPassword = self.frmProfile.controls.usua_tx_nova_senha.value;
      let userCurrent = self.usuaSrv.getLoggedInUser();
      if (newPassword != '') {

        if (currentPassword != '') {

          var credential: any = self.fbs.getAuthRef().EmailAuthProvider.credential(emailUser, currentPassword);

          userCurrent.reauthenticate(credential).then(() => {

            userCurrent.updatePassword(newPassword).then(() => {

              self.usuaSrv.getUsersRef().child(userCurrent.uid).child('usua_tx_senha').set(newPassword);

              result = true;
              resolve({ self, result });
            })
              .catch((error) => {
                reject(error);
              })
          })
            .catch((error) => {
              reject("Senha atual inválida.");
            });
        } else {
          reject("Informe a senha atual.");
        }
      }
      result = true;
      resolve({ self, result });
    });
    return promise;
  }

  salvarImage = function (trocarSenha) {
    let self = trocarSenha.self;
    let pathUrlImage: string = '';
    var promise = new Promise(function (resolve, reject) {

      if (self.changeImageProfile == true) {
        self.usuaSrv.getStorageRef().child('images/usuario/' + self.uidUsuario + '/profile.png')
          .putString(self.myPhoto.substring(23), 'base64', { contentType: 'image/png' })
          .then((savedPicture) => {
            pathUrlImage = savedPicture.downloadURL;
            resolve({ pathUrlImage, self })
          })
          .catch((error) => {
            reject("Não foi possível atualizar a imagem do perfil.");
          });
      }
      else {
        resolve({ pathUrlImage, self })
      }
    });

    return promise;
  }

  salvarDadosUsuario = function (dados) {
    var promise = new Promise(function (resolve, reject) {
      let self = dados.self;
      let urlProfile = dados.pathUrlImage;


      self.usuario.usua_nm_usuario = self.frmProfile.controls.usua_nm_usuario.value;
      self.usuario.usua_ds_telefone = self.frmProfile.controls.usua_ds_telefone.value;

      self.usuaSrv.getUsersRef().child(self.uidUsuario).child('usua_nm_usuario').set(self.usuario.usua_nm_usuario);
      self.usuaSrv.getUsersRef().child(self.uidUsuario).child('usua_ds_telefone').set(self.usuario.usua_ds_telefone);

      if (self.municipioSelected != null) {
        self.usuaSrv.getUsersRef().child(self.uidUsuario).child('municipio').set(self.municipioSelected);
      }

      if (urlProfile != '') {
        self.usuario.usua_tx_urlprofile = urlProfile;
        self.usuaSrv.getUsersRef().child(self.uidUsuario).child('usua_tx_urlprofile').set(urlProfile);
      } else {
        self.usuario.usua_tx_urlprofile = self.myPhoto;
      }

      resolve(true);
    })

    return promise;
  }

  selecionarTipoUpload() {
    let tpUpload = this.alertCtrl.create({
      title: 'Alterar foto do perfil',
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

  takeThePhoto(pictureSourceType) {

    let self = this;
    this.backSrv.enable();


    this.camera.getPicture({
      sourceType: pictureSourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      quality: 50,
      targetHeight: 500,
      targetWidth: 500,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.PNG
    })
      .then(
      imageURI => {
        window['plugins'].crop.promise(imageURI, {
          quality: 95
        }).then(newPath => {
          this.toBase64(newPath).then((base64Img) => {
            self.changeImageProfile = true;
            this.myPhoto = base64Img;
            this.backSrv.disable();
          });
        },
          error => {
            self.changeImageProfile = false;
            this.createAlert("Não foi possível selecionar a imagem.")
          }
          );

      },
      error => {
        self.changeImageProfile = false;
        this.createAlert("Não foi possível selecionar a imagem.")
      }
      );
  }

  toBase64(url: string) {
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

  createAlert(errorMessage: string) {

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

  public onChangeMunicipio(value: string) {
    let self = this;
    self.municipioSelected = self.itenSrv.findElement(self.municipios, (v: any) => v.muni_sq_id == value);
  }
}
