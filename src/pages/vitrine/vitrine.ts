import { VitrineAnuncio5Page } from './../vitrine-anuncio-5/vitrine-anuncio-5';
import { VitrineAnuncio4Page } from './../vitrine-anuncio-4/vitrine-anuncio-4';
import { VitrineAnuncio3Page } from './../vitrine-anuncio-3/vitrine-anuncio-3';
import { VitrineAnuncio2Page } from './../vitrine-anuncio-2/vitrine-anuncio-2';
import { VitrineAnuncio1Page } from './../vitrine-anuncio-1/vitrine-anuncio-1';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-vitrine',
  templateUrl: 'vitrine.html'
})
export class VitrinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitrinePage');
  }

  openPub():void {
    this.navCtrl.push(AnuncioFullPage);
  }

  openDetalhe(tipo: number) {
    if (tipo==1) {
      this.navCtrl.push(VitrineAnuncio1Page);
    } else if (tipo==2) {
      this.navCtrl.push(VitrineAnuncio2Page);
    } else if (tipo==3) {
      this.navCtrl.push(VitrineAnuncio3Page);
    } else if (tipo==4) {
      this.navCtrl.push(VitrineAnuncio4Page);
    } else if (tipo==5) {
      this.navCtrl.push(VitrineAnuncio5Page);
    }
  }

}
