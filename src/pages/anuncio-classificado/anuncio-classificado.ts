import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular/util/events';

@Component({
  selector: 'page-anuncio-classificado',
  templateUrl: 'anuncio-classificado.html',
})
export class AnuncioClassificadoPage {
  public titulo:string = "Meus Anúncios"
  
  constructor(private navCtrl: NavController, private navParams: NavParams,private events: Events) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AnuncioClassificadoPage');
  }

}
