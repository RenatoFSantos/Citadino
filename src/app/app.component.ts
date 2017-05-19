import { LoginPage } from './../pages/autenticar/login/login';
import { SqLiteService } from './../providers/database/sqlite-service';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './../providers/service/network-service';
import { UsuarioVO } from './../model/usuarioVO';
import { IMenu } from './../shared/interfaces';
import { LoginService } from './../providers/service/login-service';
import { FirebaseService } from './../providers/database/firebase-service';

import { HomeLoginPage } from './../pages/autenticar/homeLogin';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { TestePage } from './../pages/teste/teste';
import { RelatoriosListaPage } from './../pages/relatorios-lista/relatorios-lista';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';
import { TabsPage } from '../pages/tabs/tabs';

import { Component, ViewChild, OnInit } from '@angular/core';
import {
  Platform, MenuController, Nav,
  ModalController, Events, ToastController
} from 'ionic-angular';
import { SplashScreen, } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import * as enums from './../model/dominio/citadinoEnum'

declare var window: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  public pages: IMenu[];
  public subpages: IMenu[];
  public userLogged: UsuarioVO = new UsuarioVO();
  public rootPage: any;
  public firebaseConnectionAttempts: number = 0;

  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private mdlCtrl: ModalController,
    private fbService: FirebaseService,
    private sqService: SqLiteService,
    private loginSrv: LoginService,
    private events: Events,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private netService: NetworkService,
    private toastCtrl: ToastController,
    private globalVar: GlobalVar) {

    platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.userLoggedEvent();

      if (window.cordova) {
        this.netService.initializeNetworkEvents();
        this.networkDisconnectEvent();
        this.networkConnectionEvent();
        this.sqService.InitDatabase();
      }
    });
  }

  ngOnInit() {
    this.checkFirebase();
  }


  checkFirebase() {
    let self = this;
    if (!self.globalVar.getIsFirebaseConnected()) {
      setTimeout(function () {
        self.firebaseConnectionAttempts++;

        if (self.firebaseConnectionAttempts < 5) {
          console.log(self.firebaseConnectionAttempts);
          self.checkFirebase();
        } else {
          self.splashScreen.hide();
          self.rootPage = LoginPage;
          self.fbService.goOffline();
        }
      }, 1000);
    }
    else {
      let userCurrent = self.loginSrv.getLoggedInUser();
      if (userCurrent != null) {
        console.log("userCurrent " + userCurrent.uid);
        this.loginSrv.getUserDetail(userCurrent.uid).then((userRef) => {
          self.popularMenu(true);
          self.userLogged = userRef.val();
          self.splashScreen.hide();
          self.rootPage = TabsPage;
        }).cath((error) => {
          self.splashScreen.hide();
          self.rootPage = HomeLoginPage;
        });
      } else {
        self.splashScreen.hide();
        self.rootPage = HomeLoginPage;
      }
    }
  }

  networkConnectionEvent() {
    this.events.subscribe('network:online', () => {
      setTimeout(() => {
        this.netService.closeStatusConnection();
        this.fbService.goOnline();
      }, 3000);
    });
  }

  networkDisconnectEvent() {
    this.events.subscribe('network:offline', () => {
      this.netService.getStatusConnection();
      this.fbService.goOffline();
    });
  }

  userLoggedEvent() {
    this.events.subscribe('usuario:logado', (isFirebase, data) => {
      if (isFirebase) {
        let userCurrent = this.loginSrv.getLoggedInUser();
        if (userCurrent != null) {
          this.loginSrv.getUserDetail(userCurrent.uid).then((userRef) => {
            this.popularMenu(true);
            this.userLogged = userRef.val();
            this.nav.setRoot(TabsPage);
          }).catch((error) => {
            this.nav.setRoot(HomeLoginPage);
          });
        } else {
          this.nav.setRoot(HomeLoginPage);
        }
      } else {
        this.popularMenu(true);
        this.userLogged = this.populateObjectUser(data);
        this.nav.setRoot(TabsPage);
      }
    });
  }

  populateObjectUser(data: any): UsuarioVO {
    var object = new UsuarioVO();
    let imageData = "assets/img/profile/profile.png";

    for (var i = 0; i < data.rows.length; i++) {

      object.usua_uid_authentic = data.rows.item(i).usua_uid_authentic;
      object.usua_nm_usuario = data.rows.item(i).usua_nm_usuario;
      object.usua_ds_email = data.rows.item(i).usua_ds_email;
      object.usua_tx_senha = data.rows.item(i).usua_tx_senha;
      object.usua_ds_url_profile = imageData;

    }

    return object;
  }

  openPage(page: IMenu) {
    let params = {};

    switch (page.typeMenu) {
      case enums.ETypeMenu.default:

        if (page.index) {
          params = { tabIndex: page.index };
        }

        if (this.nav.getActiveChildNav() && page.index != undefined) {
          this.nav.getActiveChildNav().select(page.index);       
        } else {    
          this.nav.push(page.component, params).catch((err: any) => {
            console.log(`Didn't set nav root: ${err}`);
          });
        }
        break;

      case enums.ETypeMenu.login:
        let loginModal = this.mdlCtrl.create(HomeLoginPage);
        loginModal.present();
        break;

      case enums.ETypeMenu.logout:
        setTimeout(() => {
          this.nav.setRoot(HomeLoginPage);
          this.loginSrv.signOut();
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
  }
}
