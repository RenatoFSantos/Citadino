import { MensagemPage } from './../mensagem/mensagem';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
