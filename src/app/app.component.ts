import { LoginPage } from './../pages/autenticar/login/login';
import { UsuarioVO } from './../modelo/usuarioVO';
import { LoginService } from './../providers/login-service';
import { DataService } from './../providers/data-service';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { TestePage } from './../pages/teste/teste';
import { RelatoriosListaPage } from './../pages/relatorios-lista/relatorios-lista';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';

import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, Events } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';


export interface PageInterface {
  title: string;
  component: any;
  icon: string;
  tabComponent?: any;
  logsOut?: boolean;
  index?: number;
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  usuario: UsuarioVO;
  rootPage = TabsPage;  
  
  pages: PageInterface[] = [
    { title: 'Vitrine', component: TabsPage, tabComponent: VitrinePage, index: 0, icon: 'logo-windows' },
    { title: 'Guia', component: TabsPage, tabComponent: GuiaPage, index: 1, icon: 'compass' },
    { title: 'Mensagem', component: TabsPage, tabComponent: MensagemListaPage, index: 2, icon: 'chatbubbles' }
  ];

  subpages: PageInterface[] = [
    { title: 'Configurações', component: TestePage, icon: 'options' },
    { title: 'Estatísticas', component: RelatoriosListaPage, icon: 'pie' },
    { title: 'Favoritos', component: TestePage, icon: 'star' },
    { title: 'Contato', component: TestePage, icon: 'contact' },
    { title: 'Sobre', component: TestePage, icon: 'information-circle' },
    { title: 'Sair', component: TabsPage, icon: 'exit', logsOut: true },
    { title: 'Login', component: LoginPage, icon: 'log-in' }
  ]
  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private data: DataService,
    private loginSrv: LoginService,
    public events:Events) {
    
    data.init();
    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  ngOnInit() {

    this.loginSrv.getUsuarioLogado().subscribe(
      (usuLogado) => {
        console.log('usuario conectado');
        this.usuario = new UsuarioVO();
        this.usuario.nome = usuLogado.name;
        //this.rootPage = TabsPage;
      }, err => {
        //this.rootPage = TabsPage;
        console.log('usuario desconectado');
      });     
  }

  openPage(page: PageInterface) {
    if (page.index) {
      this.nav.setRoot(page.component, { tabIndex: page.index });
    } else {
      this.nav.setRoot(page.component).catch(() => {
        console.log("Didn't set nav root");
      });
    }

    if (page.logsOut === true) {
      // Give the menu time to close before changing to logged out
      setTimeout(() => {
        // this.userData.logout();
      }, 1000);
    }
  }

  isActive(page: PageInterface) {
    let childNav = this.nav.getActiveChildNav();

    if (childNav) {
      if (childNav.getSelected() && childNav.getSelected().root === page.tabComponent) {
        return 'primary';
      }
      return;
    }

    if (this.nav.getActive() && this.nav.getActive().component === page.component) {
      return 'primary';
    }
    return;
  }

  platformReady() {
    this.platform.ready().then(() => {
      Splashscreen.hide();
    });
  }

  close(): void {
  }

}
