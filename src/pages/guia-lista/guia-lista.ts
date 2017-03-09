import { SsScrapfashionPage } from './../ss-scrapfashion/ss-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the GuiaLista page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-guia-lista',
  templateUrl: 'guia-lista.html'
})
export class GuiaListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaListaPage');
  }

  openSmartSite(site: string) {
    switch(site) {
      case 'scrapfashion': 
        this.navCtrl.push(SsScrapfashionPage);
      default: {
      }
    }
  }
}
