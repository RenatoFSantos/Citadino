import { AnuncioClassificadoPage } from './../anuncio-classificado/anuncio-classificado';
import { AnuncioPromocaoPage } from './../anuncio-promocao/anuncio-promocao';
import { AnuncioPublicidadePage } from './../anuncio-publicidade/anuncio-publicidade';
import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';



@Component({
  selector: 'page-meus-anuncios',
  templateUrl: 'meus-anuncios.html',
})
export class MeusAnunciosPage {

  tabPublicidade: any = AnuncioPublicidadePage;
  tabPromocao: any = AnuncioPromocaoPage;
  tabClassificado: any = AnuncioClassificadoPage;

  selectedIndex: number;

  constructor(private navCtrl: NavController, private navParams: NavParams,
    private events: Events) {
    this.selectedIndex = navParams.data.tabIndex || 1;
  }

  ionViewDidLoad() {
    this.closeEvent();
  }
  
  ionViewWillUnload() {
    // this.events.unsubscribe('anuncio_close:true', null);
  }
  
  private closeEvent() {
    this.events.subscribe("anuncio_close:true", (result) => {
      if (result) {
        this.navCtrl.pop();
      }
    });
  }
}
