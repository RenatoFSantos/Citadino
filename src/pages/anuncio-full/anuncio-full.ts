import { SlideVO } from './../../model/slideVO';
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

  public slides: Array<SlideVO> = [];
  constructor(public navCtrl: NavController, 
    public params: NavParams) {
    if (params != null && params.get("anuncio") != null) {
      this.createObjSlide(params.get("anuncio"));
    }
  }

  private createObjSlide(anuncio: any) {

    if (anuncio.anun_tx_urlslide1 != null && anuncio.anun_tx_urlslide1 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = anuncio.anun_tx_urlslide1;
      this.slides.push(slide);

    }

    if (anuncio.anun_tx_urlslide2 != null && anuncio.anun_tx_urlslide2 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = anuncio.anun_tx_urlslide2;
      this.slides.push(slide);
    }

    if (anuncio.anun_tx_urlslide3 != null && anuncio.anun_tx_urlslide3 != "") {
      let slide: SlideVO = new SlideVO();
      slide.title = "";
      slide.description = "";
      slide.imageUrl = anuncio.anun_tx_urlslide3;
      this.slides.push(slide);    
    }
  }
}
