import { LoginService } from './../../../providers/service/login-service';
import { Component } from '@angular/core';
import { NavController, ViewController, Events } from 'ionic-angular';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage {

  loginUser: { uid?:any, name?: string, email?: string, password?: string } = {};
  error: any

  constructor(public navCtrl: NavController,
    public loginSrv: LoginService,
    private viewCtrl: ViewController,
    private event: Events) { }

  salvar(loginForm: NgForm) {
    if (loginForm.valid) {
      this.loginSrv.salvarLogin(this.loginUser).subscribe(
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
