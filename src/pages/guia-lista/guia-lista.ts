import { GuiaContatoPage } from './../guia-contato/guia-contato';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-guia-lista',
  templateUrl: 'guia-lista.html'
})
export class GuiaListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaListaPage');
  }

  openGuiaContato() {
    let modal = this.modalCtrl.create(GuiaContatoPage);
    modal.present();
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
