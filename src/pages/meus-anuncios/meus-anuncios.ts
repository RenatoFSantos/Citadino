import { GlobalVar } from './../../shared/global-var';
import { UsuarioVO } from './../../model/usuarioVO';
import { AnuncioSorteioPage } from './../anuncio-sorteio/anuncio-sorteio';
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
  tabSorteio:any = AnuncioSorteioPage
  tabClassificado: any = AnuncioClassificadoPage;

  public titulo: string = "Meus Anúncios"
  public usuario: UsuarioVO;
  
  selectedIndex: number;

  constructor(private navCtrl: NavController, 
    private navParams: NavParams, private glbVar: GlobalVar,
    private events: Events) {
    this.selectedIndex = navParams.data.tabIndex || 1;

    this.usuario = glbVar.usuarioLogado;

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
