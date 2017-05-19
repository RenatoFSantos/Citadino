import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Mensagem page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mensagem',
  templateUrl: 'mensagem.html'
})
export class MensagemPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
     console.log("Construtor Guia");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensagemPage');
  }

}
