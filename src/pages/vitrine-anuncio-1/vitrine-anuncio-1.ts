import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the VitrineAnuncio1 page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-vitrine-anuncio-1',
  templateUrl: 'vitrine-anuncio-1.html'
})
export class VitrineAnuncio1Page {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitrineAnuncio1Page');
  }

}
