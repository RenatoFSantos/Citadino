import { NavController, ViewController, Events } from 'ionic-angular';
import { LoginService } from './../../../providers/service/login-service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginUser: { email?: string, password?: string } = {};
  error: any

  constructor(public navCtrl: NavController,
    public loginSrv: LoginService,
    private viewCtrl: ViewController,
    private event: Events) {

  }

  login(loginForm: NgForm) {
    if (loginForm.valid) {
      this.loginSrv.logarUsuario(this.loginUser).subscribe(
        (data: any) => {
          this.event.publish('usuario:logado', data.name);
          this.viewCtrl.dismiss();
        },
        (err) => {
          this.error = err;
        });
    }
  }
}
