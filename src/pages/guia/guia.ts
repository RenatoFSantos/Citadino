import { GuiaListaPage } from './../guia-lista/guia-lista';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Guia page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-guia',
  templateUrl: 'guia.html'
})
export class GuiaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaPage');
  }

  openGuiaLista(guia: string) {
    switch(guia) {
      case 'bares':
        this.navCtrl.push(GuiaListaPage);
        break;
      default:
        break;
    } 
  }
}
