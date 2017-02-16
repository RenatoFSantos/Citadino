
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { MensagemPage } from '../mensagem/mensagem';
import { GuiaPage } from '../guia/guia';
import { VitrinePage } from '../vitrine/vitrine';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root: any = VitrinePage;
  tab2Root: any = GuiaPage;
  tab3Root: any = MensagemPage;

  constructor(public navCtrl: NavController) {

  }
}
