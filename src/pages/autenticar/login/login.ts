import { UserCredentials } from './../../../shared/interfaces';
import { TabsPage } from './../../tabs/tabs';
import { HomeLoginPage } from './../homeLogin';
import { NavController, Events, LoadingController, ToastController } from 'ionic-angular';
import { LoginService } from './../../../providers/service/login-service';
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

  constructor(public nav: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public fb: FormBuilder,
    public event: Events,
    public loginSrv: LoginService) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      'email': ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
    });

    this.email = this.loginForm.controls['email'];
    this.password = this.loginForm.controls['password'];
  }

  onSubmit(signInForm: any): any {
    var self = this;

    if (self.loginForm.valid) {

      let loading = self.loadingCtrl.create({
        spinner: 'circles',
        duration: 4000
      });

      loading.present();

      let user: UserCredentials = {
        email: signInForm.email,
        password: signInForm.password
      };

      this.loginSrv.signInUser(user.email, user.password).then(
        (data: any) => {
          self.event.publish('usuario:logado', true);
          self.nav.setRoot(TabsPage);
          loading.dismiss();
        },
        (error) => {
          var errorMessage = error.message;
          loading.dismiss().then(() => {
            let toast = self.toastCtrl.create({
              message: errorMessage,
              duration: 4000,
              position: 'top'
            });
            toast.present();
          });
        });
    }
  }

  close() {
    var self = this;
    self.nav.setRoot(HomeLoginPage);
  }
}
