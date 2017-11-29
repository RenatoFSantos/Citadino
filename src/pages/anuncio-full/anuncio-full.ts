import { SlideVO } from './../../model/slideVO';
import { Component } from '@angular/core';
import { NavController, NavParams,  Events, ViewController } from 'ionic-angular';
import { ImageViewerController } from 'ionic-img-viewer';
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@Component({
  selector: 'page-anuncio-full',
  templateUrl: 'anuncio-full.html'
})
export class AnuncioFullPage {

  @ViewChild(Slides) objSlide: Slides;

  public slides: Array<SlideVO> = [];
  public isBtnExcluirImg:Boolean = false;
  public grid = true;
  public imgView: ImageViewerController;


  constructor(public navCtrl: NavController,
    public params: NavParams,
    private imageViewerCtrl: ImageViewerController,
    private events: Events,
    private viewCtrl: ViewController) {

    this.imgView = imageViewerCtrl;

    if (params != null) {
      if (params.get("slideParam") != null) {
        this.slides = params.get("slideParam")
      }

      if (params.get("isExcluirImagem") != null) {
        this.isBtnExcluirImg = Boolean(params.get("isExcluirImagem"));
      }
    }      
  }

  openImage(myImage) {
    const imageViewer = this.imgView.create(myImage);
    imageViewer.present();
  }

  removeImage() {
    this.viewCtrl.dismiss();
    this.events.publish("excluirImagem:true", (this.objSlide.getActiveIndex()));
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
