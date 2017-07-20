import { VitrineVO } from './../../model/vitrineVO';
import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

/*
  Generated class for the NoticiaFull page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-noticia-full',
  templateUrl: 'noticia-full.html'
})
export class NoticiaFullPage {

  public vitrine: VitrineVO;

  constructor(public navParams: NavParams) {
    this.vitrine = navParams.get("vitrine");

  }


  ionViewDidLoad() {
  }

}
