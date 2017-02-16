import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { VitrinePage } from '../pages/vitrine/vitrine';
import { GuiaPage } from '../pages/guia/guia';
import { MensagemPage } from '../pages/mensagem/mensagem';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = VitrinePage;
  tab2Root: any = GuiaPage;
  tab3Root: any = MensagemPage;

  constructor(public navCtrl: NavController) {

  }
}
