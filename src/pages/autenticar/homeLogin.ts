import { SignUpPage } from './signup/signup';
import { LoginPage } from './login/login';
import { Component } from '@angular/core';
import { NavController, ViewController, ModalController } from 'ionic-angular';

@Component({
  selector: 'page-homeLogin',
  templateUrl: 'homeLogin.html'
})
export class HomeLoginPage {
  constructor(private viewCtrl: ViewController,
    private mdlCtrl: ModalController,
    public navCtrl:NavController) { }

  criarConta() {
    this.navCtrl.setRoot(SignUpPage);
   }

  logarUsuario() {
      this.navCtrl.setRoot(LoginPage);
  }

}
