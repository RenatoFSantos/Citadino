import { UsuarioVO } from './../model/usuarioVO';
import { IMenu } from './../shared/interfaces';
import { Network } from '@ionic-native/Network';
import { LoginService } from './../providers/service/login-service';
import { FirebaseService } from './../providers/database/firebase-service';

import { HomeLoginPage } from './../pages/autenticar/homeLogin';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { TestePage } from './../pages/teste/teste';
import { RelatoriosListaPage } from './../pages/relatorios-lista/relatorios-lista';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';
import { TabsPage } from '../pages/tabs/tabs';

import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav, ModalController, Events } from 'ionic-angular';
import { SplashScreen, } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import * as enums from './../model/dominio/citadinoEnum'

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  public isLogado = false;
  public pages: IMenu[];
  public subpages: IMenu[];
  public userLogged:UsuarioVO = new UsuarioVO();
  public rootPage: any;
  public firebaseConnectionAttempts: number = 0;


  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private mdlCtrl: ModalController,
    private fbs: FirebaseService,
    private loginSrv: LoginService,
    private events: Events,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private network: Network) {

    var self = this;
    self.listernLoginEvents();

    platform.ready().then(() => {
      if (window.cordova) {
        self.statusBar.styleDefault();
        self.listernLoginEvents();
        self.listernConnection();
        self.listernDisconnect();
        self.splashScreen.hide();

        // console.log('in ready..');
        // let array: string[] = platform.platforms();
        // console.log(array);
        // self.sqliteService.InitDatabase();
      }
      else {
        self.listernLoginEvents();
        self.listernConnection();
        self.listernDisconnect();
        self.splashScreen.hide();
      }
    });
  }

  ngOnInit() {
    let self = this;
    self.checkFirebase();
  }

  checkFirebase() {
    let self = this;
    if (!self.fbs.isFirebaseConnected()) {
      setTimeout(function () {
        console.log('Retry : ' + self.firebaseConnectionAttempts);
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 5) {
          self.checkFirebase();
        } else {
          // self.internetConnected = false;
          // self.dataService.goOffline();
          // self.loadSqliteThreads();
          console.log("Não foi possível conectar no banco de dados")
        }
      }, 1000);
    }
    else {
      self.loginSrv.getUserDetail().subscribe((userRef) => {
        self.popularMenu(true);
        self.userLogged = userRef.val();
        self.rootPage = TabsPage;
      }, error => {
        self.rootPage = HomeLoginPage;
      });
    }
  }

  listernConnection() {
    var self = this;
    self.network.onConnect().subscribe(() => {
      setTimeout(() => {
        self.fbs.goOnline();
        self.events.publish('network:connected', true);
      }, 3000);
    });
  }


  listernDisconnect() {
    var self = this;
    self.network.onDisconnect().subscribe(() => {
      self.fbs.goOffline();
      self.events.publish('network:connected', false);
    });
  }

  openPage(page: IMenu) {
    var self = this;
    switch (page.typeMenu) {
      case enums.ETypeMenu.default:
        if (page.index) {
          self.nav.setRoot(page.component, { tabIndex: page.index });
        } else {
          self.nav.setRoot(page.component).catch((e) => {
          });
        }
        break;

      case enums.ETypeMenu.login:
        let loginModal = self.mdlCtrl.create(HomeLoginPage);
        loginModal.present();
        break;

      case enums.ETypeMenu.logout:
        setTimeout(() => {
          self.nav.setRoot(HomeLoginPage);
          self.loginSrv.signOut();
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
    // else {
    //   this.subpages.push({ title: 'Login', component: HomeLoginPage, icon: 'log-in', typeMenu: enums.ETypeMenu.login });
    // }
  }

  listernLoginEvents() {
    var self = this;
    self.events.subscribe('usuario:logado', (loggedInUser) => {  
      if (loggedInUser) {
        self.loginSrv.getUserDetail().subscribe((userRef) => { 
          self.popularMenu(true);
          self.userLogged = userRef.val();
          self.nav.setRoot(TabsPage);
        }, error => {
          self.nav.setRoot(HomeLoginPage);
        });
      }
    });
  }

}
