import { TpScrapfashionPage } from './../tp-scrapfashion/tp-scrapfashion';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


@Component({
  selector: 'page-tp-ped-scrapfashion',
  templateUrl: 'tp-ped-scrapfashion.html'
})
export class TpPedScrapfashionPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TpPedScrapfashionPage');
  }

  openTabelaPreco(site: string) {
    switch(site) {
      case 'scrapfashion':
        this.navCtrl.push(TpScrapfashionPage);
      default:
        break;
    } 
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Finalizar Pedido',
      message: 'Deseja finalizar seu pedido?',
      buttons: [
        {
          text: 'Ainda não!',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Finalizar',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }  
}
