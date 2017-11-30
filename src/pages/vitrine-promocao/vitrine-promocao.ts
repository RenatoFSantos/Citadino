import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-vitrine-promocao',
  templateUrl: 'vitrine-promocao.html',
})
export class VitrinePromocaoPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitrinePromocaoPage');
  }

}
