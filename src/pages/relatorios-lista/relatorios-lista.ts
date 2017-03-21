import { RelatFidelidadePage } from './../relat-fidelidade/relat-fidelidade';
import { RelatPedidoPage } from './../relat-pedido/relat-pedido';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the RelatoriosLista page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-relatorios-lista',
  templateUrl: 'relatorios-lista.html'
})
export class RelatoriosListaPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RelatoriosListaPage');
  }

  openRelat(nome: string) {
    switch(nome) {
      case 'pedido':
        this.navCtrl.push(RelatPedidoPage);
        break;
      case 'fidelidade':
        this.navCtrl.push(RelatFidelidadePage);
        break;
      default:
        break;
    }
  }

}
