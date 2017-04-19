import { FirebaseService } from './../../../providers/database/firebase-service';
import { UserCredentials } from './../../../shared/interfaces';
import { EmailValidator } from './../../../shared/validators/email.validator';
import { HomeLoginPage } from './../homeLogin';
import { LoginService } from './../../../providers/service/login-service';
import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, Events, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm, FormGroup, AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage implements OnInit {
  createLoginForm: FormGroup;
  usua_nm_usuario: AbstractControl;
  usua_ds_email: AbstractControl;
  usua_tx_senha: AbstractControl;

  constructor(private loginService: LoginService,
    private fbService: FirebaseService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private viewCtrl: ViewController,
    private event: Events,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.createLoginForm = this.fb.group({
      'usua_nm_usuario': ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
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

      let loader = self.loadingCtrl.create({
        content: 'Aguarde... configurando o perfil',
        dismissOnPageChange: true
      });

      let newUser: UserCredentials = {
        email: signupForm.usua_ds_email,
        password: signupForm.usua_tx_senha
      };

      loader.present();

      self.loginService.registerUser(newUser).then((result) => {
        self.loginService.addUser(signupForm,
          self.loginService.getLoggedInUser().uid);

        self.CreateAndUploadDefaultImage();

        loader.dismiss().then(() => {
          let toast = self.toastCtrl.create({
            message: 'Usuário criado com sucesso.',
            duration: 2000,
            position: 'top'
          });
          toast.present();
        });
      }).catch(function (error) {
        console.log("Error ao criar o usuário")
        var errorMessage = error.message;
        console.error(error);
        loader.dismiss().then(() => {
          let toast = self.toastCtrl.create({
            message: errorMessage,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        });
      });
    }
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
    let uid = self.loginService.getLoggedInUser().uid;
    let progress: number = 0;

    var metadata = {
      contentType: 'image/png',
      name: 'profile.png',
      cacheControl: 'no-cache',
    };

    var uploadTask = self.fbService.getStorageRef().child('images/' + uid + '/profile.png').put(file, metadata);

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

  // saveLogin(loginForm: NgForm) {
  //   if (loginForm.valid) {
  //     this.loginSrv.saveLogin(this.usuario).subscribe(
  //       (usuario: any) => {
  //         this.event.publish('usuario:logado', usuario.usua_nm_usuario);
  //         this.navCtrl.setRoot(TabsPage);
  //       },
  //       (err) => {
  //         this.error = err;
  //       });
  //   }
  // }
  close() {
    this.navCtrl.setRoot(HomeLoginPage);
  }
}
