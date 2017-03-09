import { TpDetScrapfashionPage } from './../tp-det-scrapfashion/tp-det-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the TpScrapfashion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tp-scrapfashion',
  templateUrl: 'tp-scrapfashion.html'
})
export class TpScrapfashionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TpScrapfashionPage');
  }

  openDetalhe(item: number) {
    switch(item) {
      case 1:
        this.navCtrl.push(TpDetScrapfashionPage);
        break;
      default:
        break;
    }
  }
}
