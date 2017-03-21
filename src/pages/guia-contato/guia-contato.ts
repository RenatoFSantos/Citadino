import { SsScrapfashionPage } from './../ss-scrapfashion/ss-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-guia-contato',
  templateUrl: 'guia-contato.html'
})
export class GuiaContatoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {}

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

  dismiss() {
    this.viewCtrl.dismiss();
  }
}
