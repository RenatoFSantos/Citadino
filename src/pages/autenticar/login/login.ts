import { LoginService } from './../../../providers/login-service';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loginUser: { username?: string, password?: string } = {};
  submitted = false;

  constructor(public loginSrv: LoginService) { }

  login(loginForm: NgForm) {
    this.submitted = true;

    if (loginForm.valid) {
      this.loginSrv.logarUsuario(this.loginUser).subscribe(
        (data: any) => {
          console.log("the data", data.email)
          // this.dismiss();
        },
        (error) => {
          alert("Error Logging In: " + error.message)
          console.log(error)
        });
    }
  }

  // private dismiss(): void {
  //   this.navCtrl.popToRoot();
  //   this.viewCtrl.data.cb()
  // }

}
