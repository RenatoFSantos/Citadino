import { FirebaseService } from './../../../providers/database/firebase-service';
import { SignUpPage } from './../signup/signup';
import { UsuarioService } from './../../../providers/service/usuario-service';
import { NetworkService } from './../../../providers/service/network-service';
import { GlobalVar } from './../../../shared/global-var';
import { UserCredentials } from './../../../shared/interfaces';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { EmailValidator } from './../../../shared/validators/email.validator';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  email: AbstractControl;
  password: AbstractControl;

  private loading: any;
  private toastAlert: any;

  constructor(private nav: NavController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private fb: FormBuilder,
    private event: Events,
    private loginSrv: UsuarioService,
    private globalVar: GlobalVar,
    private netService: NetworkService,
    private navCtrl: NavController,
    private fbSrv: FirebaseService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];

  }

  ionViewWillEnter() {
    console.log("Login: ionViewWillEnter");
    this.netService.getStatusConnection();
  }

  ionViewDidLeave() {
    console.log("Login: ionViewDidLeave");
    this.netService.closeStatusConnection();
  }

  onSubmit(signInForm: any): any {
    var self = this;
    if (self.loginForm.valid) {

      this.loading = self.loadingCtrl.create({
        spinner: 'circles'
      });

      this.loading.present();

      let user: UserCredentials = {
        email: signInForm.email,
        password: signInForm.password
      };

      let resultFindUser: any = null;

      if (self.globalVar.getIsFirebaseConnected()) {
        resultFindUser = this.loginSrv.signInUserFB(user.email, user.password);

        if (resultFindUser != null) {
          resultFindUser.then(
            (data: any) => {
              if (data != null) {
                this.loading.dismiss();
                self.event.publish('usuario:logado', self.globalVar.getIsFirebaseConnected(), data);
              } else {
                this.createAlert("Usuário não encontrado");
              }
            },
            (error) => {
              this.errorConnection(error);
            });
        }
        else {
          this.errorConnection(null);
        }
      }
      else {
        
      }
    }

  }

  public criarConta() {
    this.navCtrl.setRoot(SignUpPage);
  }

  private errorConnection(error: any): void {
    let mensagemError: string = "";

    if (error != null && error.code == "auth/wrong-password") {
      mensagemError = "Ops!!! Dados inválidos";
    }
    else {
      mensagemError = "Ops!!! Não estou conseguindo validar o seu login. Tente mais tarde!";
    }

    this.loading.dismiss().then(() => {
      this.createAlert(mensagemError);
    });
  }

  createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top',
      dismissOnPageChange: true
    });

    this.toastAlert.present();
  }

  enviarSenha(): Promise<boolean> {
    let self = this;
    if (self.email != null && self.email.value != "") {
      return new Promise((resolve) => {
        this.fbSrv.getFireBase().auth().sendPasswordResetEmail(self.email.value)
          .then(() => {
            this.createAlert("E-mail enviado com sucesso.");
            resolve(true)
          }, error => {
            this.createAlert("Não foi possível enviar o email.");
            resolve(false)
          })
      });
    }
    else {
      this.createAlert("Favor informar o e-mail.");
    }
  }
}





