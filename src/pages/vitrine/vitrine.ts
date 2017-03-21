import { NoticiaFullPage } from './../noticia-full/noticia-full';
import { VitrineAnuncio6Page } from './../vitrine-anuncio-6/vitrine-anuncio-6';
import { SsScrapfashionPage } from './../ss-scrapfashion/ss-scrapfashion';
import { VitrineAnuncio5Page } from './../vitrine-anuncio-5/vitrine-anuncio-5';
import { VitrineAnuncio4Page } from './../vitrine-anuncio-4/vitrine-anuncio-4';
import { VitrineAnuncio3Page } from './../vitrine-anuncio-3/vitrine-anuncio-3';
import { VitrineAnuncio2Page } from './../vitrine-anuncio-2/vitrine-anuncio-2';
import { VitrineAnuncio1Page } from './../vitrine-anuncio-1/vitrine-anuncio-1';
import { AnuncioFullPage } from './../anuncio-full/anuncio-full';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-vitrine',
  templateUrl: 'vitrine.html'
})
export class VitrinePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad VitrinePage');
  }

  openPub(opcao: number):void {
    switch(opcao) {
      case 1: 
        this.navCtrl.push(AnuncioFullPage);
        break;
      case 2: 
        this.navCtrl.push(NoticiaFullPage);
        break;
      default:
        break;        
    }
    
  }

  openDetalhe(tipo: number) {
    switch(tipo) {
      case 1:
        this.navCtrl.push(VitrineAnuncio1Page);
        break;
      case 2:
        this.navCtrl.push(VitrineAnuncio2Page);
        break;
      case 3:
        this.navCtrl.push(VitrineAnuncio3Page);
        break;
      case 4:
        this.navCtrl.push(VitrineAnuncio4Page);
        break;
      case 5:
        this.navCtrl.push(VitrineAnuncio5Page);
        break;
      case 6:
        this.navCtrl.push(VitrineAnuncio6Page);
        break;
      default:
        break;
    }
  }

  openSmartSite(site: string) {
    switch(site) {
      case 'scrapfashion': 
        this.navCtrl.push(SsScrapfashionPage);
      default: {
      }
    }
  }

  showPromocao() {
    let confirm = this.alertCtrl.create({
      title: 'Parabéns!',
      message: 'Você ganhou este cupom de desconto!<br>Guarde este número para resgatar esta promoção!<br>CTDN943587220012',
      buttons: [
         {
          text: 'Obrigado!',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }

}
