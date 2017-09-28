import { LoginPage } from './../login/login';
import { UsuarioVO } from './../../../model/usuarioVO';
import { UsuarioService } from './../../../providers/service/usuario-service';
import { UserCredentials } from './../../../shared/interfaces';
import { EmailValidator } from './../../../shared/validators/email.validator';
import { Component, OnInit } from '@angular/core';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage implements OnInit {

  createLoginForm: FormGroup;
  usua_nm_usuario: AbstractControl;
  usua_ds_email: AbstractControl;
  usua_tx_senha: AbstractControl;

  newUser: UsuarioVO = null;

  private urlImage:string = "https://firebasestorage.googleapis.com/v0/b/citadinoprd-13651.appspot.com/o/images%2Fprofile%2Fprofile.png?alt=media&token=5aa52b8b-fbd3-41b5-978c-6fc5bccfe4a6";

  private loaderPerfil:any;

  constructor(private loginService: UsuarioService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private event: Events,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createLoginForm = this.fb.group({
      'usua_nm_usuario': ['', Validators.compose([Validators.required, Validators.maxLength(60)])],
      'usua_ds_email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'usua_tx_senha': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.usua_nm_usuario = this.createLoginForm.controls['usua_nm_usuario'];
    this.usua_ds_email = this.createLoginForm.controls['usua_ds_email'];
    this.usua_tx_senha = this.createLoginForm.controls['usua_tx_senha'];
  }

  onSubmit(signupForm: any): void {
    var self = this;

    if (self.createLoginForm.valid) {

      this.loaderPerfil = self.loadingCtrl.create({
        content: 'Aguarde... configurando o perfil',
        dismissOnPageChange: true
      });

      let newAuth: UserCredentials = {
        email: signupForm.usua_ds_email,
        password: signupForm.usua_tx_senha
      };

      this.newUser = new UsuarioVO();
      this.newUser.usua_nm_usuario = signupForm.usua_nm_usuario;
      this.newUser.usua_ds_email = signupForm.usua_ds_email;
      this.newUser.usua_tx_senha = signupForm.usua_tx_senha;
      this.newUser.usua_tx_urlprofile = this.urlImage;
      this.newUser.usua_sg_perfil = "USU";
      this.loaderPerfil.present();

      self.loginService.registerUser(newAuth).then((result) => {
        if (result != null) {
          // newUser.usua_sq_id = self.loginService.getLoggedInUser().uid;
          this.newUser.usua_sq_id = result.uid;
          self.loginService.addUserFB(this.newUser).then(() => {
            // self.loginService.addUserSQ(signupForm,
            // self.loginService.getLoggedInUser().uid);
            // self.CreateAndUploadDefaultImage();

            self.event.publish('usuario:logado', true);

            this.loaderPerfil.dismiss().then(() => {
              let toast = self.toastCtrl.create({
                message: 'Usuário criado com sucesso.',
                duration: 2000,
                position: 'top'
              });
              toast.present();
            });

          }).catch((error) => {
            self.errorNewUser(error);
          });
        }
      }).catch(function (error) {
        self.errorNewUser(error);
      });
    }
  }

  errorNewUser(error: any): void {
    let errorMessage: string;

    if (error.code == "auth/email-already-in-use") {
      errorMessage = "Ops!!! Usuário já cadastrado"
    } else {
      errorMessage = "Ops!!! Erro ao criar novo usuário."
    }

    this.loaderPerfil.dismiss().then(() => {
      let toast = this.toastCtrl.create({
        message: errorMessage,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });

  }

  CreateAndUploadDefaultImage() {
    let self = this;
    let imageData = 'assets/img/profile/profile.png';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageData, true);
    xhr.responseType = 'blob';
    xhr.onload = function (e) {
      if (xhr.status === 200) {
        var myBlob = xhr.response;
        self.startUploading(myBlob);
      }
    };
    xhr.send();
  }

  startUploading(file) {
    let self = this;
    // let uid = self.loginService.getLoggedInUser().uid;

    let uid = this.newUser.usua_sq_id;
    let progress: number = 0;

    var metadata = {
      contentType: 'image/png',
      name: 'profile.png',
      cacheControl: 'no-cache',
    };

    var uploadTask = self.loginService.getStorageRef().child('images/usuario/' + uid + '/profile.png').put(file, metadata);

    uploadTask.on('state_changed',
      function (snapshot) {
        progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      }, function (error) {
        // loader.dismiss().then(() => {
        //   switch (error.code) {
        //     case 'storage/unauthorized':
        //       break;

        //     case 'storage/canceled':
        //       break;

        //     case 'storage/unknown':
        //       break;
        //   }
        // });
      }, function () {
        var downloadURL = uploadTask.snapshot.downloadURL;
        self.loginService.setUserImage(uid, downloadURL);
        self.event.publish('usuario:logado', true);
      });
  }

  close() {
    this.navCtrl.setRoot(LoginPage);
  }
}
