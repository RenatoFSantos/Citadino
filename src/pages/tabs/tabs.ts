import { MensagemListaPage } from './../mensagem-lista/mensagem-lista';

import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { GuiaPage } from '../guia/guia';
import { VitrinePage } from '../vitrine/vitrine';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = VitrinePage;
  tab2Root: any = GuiaPage;
  tab3Root: any = MensagemListaPage;

  constructor(public navCtrl: NavController) {

  }
}
