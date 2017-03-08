import { MensagemPage } from './../pages/mensagem/mensagem';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';

import { Component } from '@angular/core';
import { Platform, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';


@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage = TabsPage;
  pages: Array<{component: any, title: string, icon: string}>
  subpages: Array<{component: any, title: string, icon: string}>

  constructor(platform: Platform, private menuCtrl: MenuController) {
    this.pages = [
      {component: VitrinePage, title: 'Vitrine', icon: 'logo-windows'},
      {component: GuiaPage, title: 'Guia', icon: 'compass'},
      {component: MensagemPage, title: 'Mensagem', icon: 'chatbubbles'}
    ];

    this.subpages = [
      {component: null, title: 'Configurações', icon: 'options'},
      {component: null, title: 'Favoritos', icon: 'star'},
      {component: null, title: 'Contato', icon: 'contact'},
      {component: null, title: 'Sobre', icon: 'information-circle'},
      {component: null, title: 'Sair', icon: 'exit'}
    ];

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page: any, menuside: string) : void {
    this.rootPage = page.component;
    this.menuCtrl.close(menuside);
  }

  closeMenu() : void {
    this.menuCtrl.close();
  }

}
