import { GuiaContatoPage } from './../guia-contato/guia-contato';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-guia-lista',
  templateUrl: 'guia-lista.html'
})

export class GuiaListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaListaPage');
  }

  openGuiaContato() {
    this.navCtrl.push(GuiaContatoPage);
  }
}
