import { TpScrapfashionPage } from './../tp-scrapfashion/tp-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the SsScrapfashion page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-ss-scrapfashion',
  templateUrl: 'ss-scrapfashion.html'
})
export class SsScrapfashionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad SsScrapfashionPage');
  }

  openTabelaPreco(site: string) {
    switch(site) {
      case 'scrapfashion':
        this.navCtrl.push(TpScrapfashionPage);
      default:
        break;
    } 
  }
}
