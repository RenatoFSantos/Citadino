import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the AnuncioFull page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-anuncio-full',
  templateUrl: 'anuncio-full.html'
})
export class AnuncioFullPage {

  slides = [
      {
        title: "Slide-1",
        description: "Teste de Slide-1",
        image: "assets/img/slide-1.jpg",
      },
      {
        title: "Slide-2",
        description: "Teste de Slide-2",
        image: "assets/img/slide-2.jpg",
      },
      {
        title: "Slide-3",
        description: "Teste de Slide-3",
        image: "assets/img/slide-3.jpg",
      }
  ];  

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnuncioFullPage');
  }

}
