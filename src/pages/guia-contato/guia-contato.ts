import { SsScrapfashionPage } from './../ss-scrapfashion/ss-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the GuiaContato page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-guia-contato',
  templateUrl: 'guia-contato.html'
})
export class GuiaContatoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GuiaContatoPage');
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
