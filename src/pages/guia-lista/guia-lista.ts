import { GuiaContatoPage } from './../guia-contato/guia-contato';
import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, Events } from 'ionic-angular';

@Component({
  selector: 'page-guia-lista',
  templateUrl: 'guia-lista.html'
})
export class GuiaListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController, private viewCtrl: ViewController, public events:Events ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaListaPage');
  }

  openGuiaContato() {
    console.log('teste');
    this.events.subscribe('app:netWork',() => {
      console.log('teste evento');
    });
    let modal = this.modalCtrl.create(GuiaContatoPage);
    modal.present();
  }

}
