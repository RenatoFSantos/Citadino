import { TpPedScrapfashionPage } from './../tp-ped-scrapfashion/tp-ped-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the TpDetScrapfashion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tp-det-scrapfashion',
  templateUrl: 'tp-det-scrapfashion.html'
})
export class TpDetScrapfashionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TpDetScrapfashionPage');
  }

  openPedido() {
    this.navCtrl.push(TpPedScrapfashionPage);
  }
}
