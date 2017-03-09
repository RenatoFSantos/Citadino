import { MensagemPage } from './../mensagem/mensagem';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the MensagemLista page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-mensagem-lista',
  templateUrl: 'mensagem-lista.html'
})
export class MensagemListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) { }

  openMensagemPage() {
    this.navCtrl.push(MensagemPage);
  }

}
