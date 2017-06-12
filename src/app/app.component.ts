import { UsuarioService } from './../providers/service/usuario-service';
import { LoginPage } from './../pages/autenticar/login/login';
import { SqLiteService } from './../providers/database/sqlite-service';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './../providers/service/network-service';
import { UsuarioVO } from './../model/usuarioVO';
import { IMenu } from './../shared/interfaces';
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
import * as enums from './../model/dominio/ctdEnum'

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
    private loginSrv: UsuarioService,
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
    var self = this;
    self.checkFirebase();
  }

  checkFirebase() {
    let self = this;

    if (!self.globalVar.getIsFirebaseConnected()) {
      setTimeout(function () {
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 5) {
          //retirar
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

      //refatorar
      //Cria um método para verificar se o firebase retornou
      this.mensagemEvent();

      let userCurrent = self.loginSrv.getLoggedInUser();

      if (userCurrent != null) {
        self.loginSrv.getUserDetail(userCurrent.uid).then((userRef) => {
          if (userRef != null) {
            self.popularMenu(true);
            self.userLogged = userRef.val();
            self.rootPage = TabsPage;
            self.splashScreen.hide();
          }
          else {
            self.rootPage = HomeLoginPage;
            self.splashScreen.hide();
          }
        });
      } else {
        self.rootPage = HomeLoginPage;
        self.splashScreen.hide();
      }
    }
  }

  networkConnectionEvent() {
    var self = this;
    self.events.subscribe('network:online', () => {
      setTimeout(() => {
        self.netService.closeStatusConnection();
        self.fbService.goOnline();
      }, 3000);
    });
  }

  networkDisconnectEvent() {
    var self = this;
    self.events.subscribe('network:offline', () => {
      self.netService.getStatusConnection();
      self.fbService.goOffline();
    });
  }

  userLoggedEvent() {
    var self = this;
    self.events.subscribe('usuario:logado', (isFirebase, data) => {
      console.log("Usuario Criado");
      if (isFirebase) {
        let userCurrent = self.loginSrv.getLoggedInUser();
        if (userCurrent != null) {
          self.loginSrv.getUserDetail(userCurrent.uid).then((userRef) => {
            if (userRef != null) {
              self.popularMenu(true);
              self.userLogged = userRef.val();
              self.nav.setRoot(TabsPage);
              console.log("Envio para tab");

            } else {
              self.nav.setRoot(HomeLoginPage);
              console.log("userRef null");
            }
          });
        } else {
          console.log("envio para home");
          self.nav.setRoot(HomeLoginPage);
        }
      } else {
        self.popularMenu(true);
        self.userLogged = this.populateObjectUser(data);
        self.nav.setRoot(TabsPage);
      }
    });
  }

  populateObjectUser(data: any): UsuarioVO {
    var object = new UsuarioVO();
    let imageData = "assets/img/profile/profile.png";

    for (var i = 0; i < data.rows.length; i++) {

      object.usua_sq_id = data.rows.item(i).usua_sq_id;
      object.usua_nm_usuario = data.rows.item(i).usua_nm_usuario;
      object.usua_ds_email = data.rows.item(i).usua_ds_email;
      object.usua_tx_senha = data.rows.item(i).usua_tx_senha;
      object.usua_tx_urlprofile = imageData;

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

  public mensagemEvent() {

    if (this.globalVar.getIsFirebaseConnected()) {

      let userCurrent = this.loginSrv.getLoggedInUser();

      this.fbService.getDataBase().ref(`/usuario/${userCurrent.uid}/mensagem/`).on('child_changed', this.onMensagemAlterada);

      this.fbService.getDataBase().ref(`/usuario/${userCurrent.uid}/mensagem/`).on('child_added', this.onMensagemAdicionada);
    }
  }

  public onMensagemAdicionada = (childSnapshot, prevChildKey) => {
    var self = this;
    var pkMensagem = childSnapshot.key;
    console.log(childSnapshot.val());
    console.log(pkMensagem);
    console.log("Adicionado");

    // let view = this.nav.getActive();
    // console.log(view);
    // if(view.instance instanceof MyPage) { 
      // Você já está nesta página 
    // }

  }

  public onMensagemAlterada = (childSnapshot, prevChildKey) => {
    var self = this;
    var pkMensagem = childSnapshot.key;
    console.log(childSnapshot.val());
    console.log(pkMensagem);
    console.log("Alterado");

    // let view = this.nav.getActive();
    // console.log(view);

  }
}
