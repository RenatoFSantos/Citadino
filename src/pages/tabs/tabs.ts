import { MensagemListaPage } from './../mensagem-lista/mensagem-lista';

import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';
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
  selectedIndex: number;

  constructor(navParams: NavParams) {
    this.selectedIndex = navParams.data.tabIndex || 0;
  }
}
