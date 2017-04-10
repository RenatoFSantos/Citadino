import { SignUpPage } from './signup/signup';
import { LoginPage } from './login/login';
import { Component } from '@angular/core';
import { ViewController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-homeLogin',
  templateUrl: 'homeLogin.html'
})
export class HomeLoginPage {


  constructor(private viewCtrl: ViewController,
    private mdlCtrl: ModalController) { }

  criarConta() {
    let signUpModal = this.mdlCtrl.create(SignUpPage);
    signUpModal.present();
    this.viewCtrl.dismiss();
  }

  logarUsuario() {
    let loginModal = this.mdlCtrl.create(LoginPage);
    loginModal.present();
    this.viewCtrl.dismiss();
  }

}
