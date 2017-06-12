import { SignUpPage } from './signup/signup';
import { LoginPage } from './login/login';
import { Component, OnInit } from '@angular/core';
import { NavController, ViewController, ModalController, Events } from 'ionic-angular';

@Component({
  selector: 'page-homeLogin',
  templateUrl: 'homeLogin.html'
})
export class HomeLoginPage implements OnInit {
  constructor(private viewCtrl: ViewController,
    private mdlCtrl: ModalController,
    public navCtrl:NavController,
    public event: Events) { }

  ngOnInit() {
    // this.event.subscribe('network:connected', this.networkConnected);  
  }

  criarConta() {
    this.navCtrl.setRoot(SignUpPage);
   }

  logarUsuario() {
      this.navCtrl.setRoot(LoginPage);
  }

  public networkConnected = (connection) => {
    // console.log("Teste de conexao: " + connection);

    // if (self.internetConnected) {
    //   self.vitrines = [];
    //   self.loadThreads(true);
    // } else {
    //   self.notify('Connection lost. Working offline..');
    //   // save current threads..
    //   setTimeout(function () {
    //     console.log(self.threads.length);
    //     self.sqliteService.saveThreads(self.threads);
    //     self.loadSqliteThreads();
    //   }, 1000);
    // }
  }

}
