import { NavController, ViewController, Events } from 'ionic-angular';
import { TabsPage } from './../../tabs/tabs';
import { LoginService } from './../../../providers/service/login-service';
import { GlobalVar } from './../../../providers/global-var';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginUser: { username?: string, password?: string } = {};
  submitted = false;
  error: any

  constructor(public navCtrl: NavController, public loginSrv: LoginService,
    public glbVar: GlobalVar,
    private viewCtrl: ViewController,
    private event:Events) {

  }

  login(loginForm: NgForm) {
    this.submitted = true;
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
