import { HomeLoginPage } from './../pages/autenticar/homeLogin';
import { IMenu } from './../Interface/IMenu';
import { LoginService } from './../providers/service/login-service';
import { FirebaseService } from './../providers/database/firebase-service';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { TestePage } from './../pages/teste/teste';
import { RelatoriosListaPage } from './../pages/relatorios-lista/relatorios-lista';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';

import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ModalController, Events } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { StatusBar } from '@ionic-native/statusBar';
import { TabsPage } from '../pages/tabs/tabs';
import * as enums from './../modelo/dominio/citadinoEnum'

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  public isLogado = false;
  public pages: IMenu[];
  public subpages: IMenu[];
  public usuarioLog: any;

  @ViewChild(Nav) nav: Nav;
  rootPage = TabsPage;


  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private mdlCtrl: ModalController,
    private data: FirebaseService,
    private loginSrv: LoginService,
    public events: Events,
    public splashScreen: SplashScreen) {

    data.init();
    this.listenoLoginEvents();
    this.platformReady();
  }

  platformReady() {
    this.platform.ready().then(() => {
      this.splashScreen.hide();
    });
  }

  ngOnInit() {

    this.loginSrv.getUsuarioLogado().subscribe(
      (usuLogado) => {
        this.popularMenu(true);
        this.usuarioLog = usuLogado.name;
      }, err => {
        this.popularMenu(false);
        console.log('usuario desconectado');
      });
  }

  openPage(page: IMenu) {

    switch (page.typeMenu) {
      case enums.ETypeMenu.default:
        if (page.index) {
          this.nav.setRoot(page.component, { tabIndex: page.index });
        } else {
          this.nav.setRoot(page.component).catch((e) => {        
          });
        }
        break;

      case enums.ETypeMenu.login:
        let loginModal = this.mdlCtrl.create(HomeLoginPage);
        loginModal.present();
        break;

      case enums.ETypeMenu.logout:
        setTimeout(() => {
          this.popularMenu(false);
          this.usuarioLog = '';
          this.loginSrv.logout();
        }, 1000);
        break;
    }
  }

  isActive(page: IMenu) {
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

  public popularMenu(value: boolean) {

    try {
      this.pages = [
        {
          title: 'Vitrine', component: TabsPage, tabComponent: VitrinePage, index: 0, icon: 'logo-windows'
          , typeMenu: enums.ETypeMenu.default
        },
        {
          title: 'Guia', component: TabsPage, tabComponent: GuiaPage, index: 1, icon: 'compass'
          , typeMenu: enums.ETypeMenu.default
        },
        {
          title: 'Mensagem', component: TabsPage, tabComponent: MensagemListaPage, index: 2, icon: 'chatbubbles'
          , typeMenu: enums.ETypeMenu.default
        }
      ];
    }
    catch (e) {
      console.log.apply(e);
    }

    this.subpages = [
      { title: 'Configurações', component: TestePage, icon: 'options', typeMenu: enums.ETypeMenu.default },
      { title: 'Estatísticas', component: RelatoriosListaPage, icon: 'pie', typeMenu: enums.ETypeMenu.default },
      { title: 'Favoritos', component: TestePage, icon: 'star', typeMenu: enums.ETypeMenu.default },
      { title: 'Contato', component: TestePage, icon: 'contact', typeMenu: enums.ETypeMenu.default },
      { title: 'Sobre', component: TestePage, icon: 'information-circle', typeMenu: enums.ETypeMenu.default }];

    if (value == true) {
      this.subpages.push({ title: 'Sair', component: TabsPage, icon: 'exit', typeMenu: enums.ETypeMenu.logout });
    }
    else {
      this.subpages.push({ title: 'Login', component: HomeLoginPage, icon: 'log-in', typeMenu: enums.ETypeMenu.login });
    }
  }

  listenoLoginEvents() {
    this.events.subscribe('usuario:logado', (nomeUsuario) => {
      if (nomeUsuario != null) {
        this.usuarioLog = nomeUsuario;
        this.popularMenu(true);
      }
    });
  }

}
