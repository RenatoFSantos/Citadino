import { SlideVO } from './../../model/slideVO';
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

  public slides: Array<SlideVO> = [];
  public vitrine: VitrineVO;

  constructor(public params: NavParams) {
    this.vitrine = params.get("vitrine");

    if (params != null && params.get("slideParam") != null) {
      this.slides = params.get("slideParam")
    }
    
  }


  ionViewDidLoad() {
  }

}
