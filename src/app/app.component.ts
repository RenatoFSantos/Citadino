import { LoginPage } from './../pages/autenticar/login/login';
import { AjudaPage } from './../pages/ajuda/ajuda';
import { MensagemPage } from './../pages/mensagem/mensagem';
import { MensagemService } from './../providers/service/mensagem-service';
import { UsuarioService } from './../providers/service/usuario-service';
import { SqLiteService } from './../providers/database/sqlite-service';
import { GlobalVar } from './../shared/global-var';
import { NetworkService } from './../providers/service/network-service';
import { UsuarioVO } from './../model/usuarioVO';
import { IMenu } from './../shared/interfaces';
import { FirebaseService } from './../providers/database/firebase-service';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { GuiaPage } from './../pages/guia/guia';
import { VitrinePage } from './../pages/vitrine/vitrine';
import { TabsPage } from '../pages/tabs/tabs';
import { Component, ViewChild, OnInit } from '@angular/core';
import {
  Platform, MenuController, Nav, ModalController, Events,
  ToastController, App, LoadingController
} from 'ionic-angular';
import { SplashScreen, } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import * as enums from './../model/dominio/ctdEnum';

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
  public timeOutSession: any;
  private toastAlert: any;

  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private mdlCtrl: ModalController,
    private fbService: FirebaseService,
    private sqService: SqLiteService,
    private usuaSrv: UsuarioService,
    private msgSrv: MensagemService,
    private events: Events,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private netService: NetworkService,
    private toastCtrl: ToastController,
    private globalVar: GlobalVar,
    private app: App,
    private loadingCtrl: LoadingController
  ) {

    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      if (window.cordova) {
        this.netService.initializeNetworkEvents();
        this.networkDisconnectEvent();
        this.networkConnectionEvent();
        this.appStateEvent();
        // this.checkForUpdate();
        //Inicializa o servico do sqlLite
        // this.sqService.InitDatabase();
      }


    });
  }

  ngOnInit() {
    this.checkFirebase();
    this.userLoggedEvent();
    this.mensagemNovaEvent();
  }


  checkFirebase() {
    let self = this;

    if (!self.globalVar.getIsFirebaseConnected()) {
      setTimeout(function () {
        self.firebaseConnectionAttempts++;
        if (self.firebaseConnectionAttempts < 10) {
          console.log(self.firebaseConnectionAttempts);
          self.checkFirebase();
        } else {
          self.splashScreen.hide();
          self.rootPage = LoginPage;
          self.fbService.goOffline();
          this.createAlert('Desculpe, no momento estamos fazendo a manutenção em nosso servidor. Tente mais tarde!');
        }
      }, 1000);
    }
    else {
      let userCurrent = self.usuaSrv.getLoggedInUser();
      if (userCurrent != null) {
        self.usuaSrv.getUserDetail(userCurrent.uid).then((userRef) => {
          if (userRef != null) {
            self.popularMenu(true);
            self.userLogged = userRef.val();
            self.splashScreen.hide();

            if (self.userLogged.usua_in_ajuda == true) {
              // self.rootPage = TabsPage;
              // this.app.getRootNav().setRoot(TabsPage);
              this.app.getActiveNavs()[0].setRoot(TabsPage);
            }
            else {
              // self.rootPage = AjudaPage;
              // this.app.getRootNav().setRoot(AjudaPage);
              this.app.getActiveNavs()[0].setRoot(AjudaPage);
            }

            this.msgSrv.addMensagemEvent();
          }
          else {
            // self.rootPage = LoginPage;
            // this.app.getRootNav().setRoot(LoginPage);
            this.app.getActiveNavs()[0].setRoot(LoginPage);
            self.splashScreen.hide();
          }
        });
      } else {
        // self.rootPage = LoginPage;
        // this.app.getRootNav().setRoot(LoginPage);
        this.app.getActiveNavs()[0].setRoot(LoginPage);
        self.splashScreen.hide();
      }
    }
  }

  //Evento disparado quando conexao =  online
  networkConnectionEvent() {
    var self = this;
    self.events.subscribe('network:online', () => {
      setTimeout(() => {
        self.netService.closeStatusConnection();
        self.fbService.goOnline();
        self.firebaseConnectionAttempts = 0;
        // this.checkFirebase();
      }, 4000);
    });
  }

  //Evento disparado quando conexao =  offline
  networkDisconnectEvent() {
    var self = this;
    self.events.subscribe('network:offline', () => {
      self.netService.getStatusConnection();
      self.fbService.goOffline();
    });
  }

  //Evento disparado quando o usuário estiver logado
  userLoggedEvent() {
    var self = this;
    self.events.subscribe('usuario:logado', (isFirebase, data) => {
      if (isFirebase == true) {
        let userCurrent = self.usuaSrv.getLoggedInUser();
        if (userCurrent != null) {
          self.usuaSrv.getUserDetail(userCurrent.uid).then((userRef) => {
            if (userRef != null) {
              self.popularMenu(true);
              self.userLogged = userRef.val();
              if (self.userLogged.usua_in_ajuda == true) {
                // self.rootPage = TabsPage;
                // this.app.getRootNav().setRoot(TabsPage);
                this.app.getActiveNavs()[0].setRoot(TabsPage);
              }
              else {
                // self.rootPage = AjudaPage;
                // this.app.getRootNav().setRoot(AjudaPage);
                this.app.getActiveNavs()[0].setRoot(AjudaPage);
              }
            } else {
              // self.nav.setRoot(LoginPage);
              // this.app.getRootNav().setRoot(LoginPage);
              this.app.getActiveNavs()[0].setRoot(LoginPage);
            }
          });
        } else {
          // self.nav.setRoot(LoginPage);
          // this.app.getRootNav().setRoot(LoginPage);
          this.app.getActiveNavs()[0].setRoot(LoginPage);
        }
      } else {
        // self.popularMenu(true);
        // self.userLogged = this.preencherObjetoUsuario(data);
        // self.nav.setRoot(TabsPage);
        // self.nav.setRoot(LoginPage);
        // this.app.getRootNav().setRoot(LoginPage);
        this.app.getActiveNavs()[0].setRoot(LoginPage);
      }
    });
  }

  preencherObjetoUsuario(data: any): UsuarioVO {
    var object = new UsuarioVO();
    // let imageData = "assets/img/profile/profile.png";

    for (var i = 0; i < data.rows.length; i++) {

      object.usua_sq_id = data.rows.item(i).usua_sq_id;
      object.usua_nm_usuario = data.rows.item(i).usua_nm_usuario;
      object.usua_ds_email = data.rows.item(i).usua_ds_email;
      object.usua_tx_senha = data.rows.item(i).usua_tx_senha;
      object.usua_tx_urlprofile = data.rows.item(i).usua_tx_urlprofile;

    }

    return object;
  }

  //Evento de nova mensagem enviada
  mensagemNovaEvent() {
    this.events.subscribe('mensagem:alterada', (childSnapshot) => {
      let userCurrent = this.usuaSrv.getLoggedInUser();

      if (this.app.getActiveNav() != null && this.app.getActiveNav().getActive()) {
        if (this.app.getActiveNav().getActive().instance instanceof MensagemPage) {
          this.usuaSrv.getUsersRef().child(userCurrent.uid)
            .child("mensagem")
            .child(childSnapshot.key).set(false);
        }
        else {
          this.usuaSrv.getMensagens().then((snapMsg) => {
            let totalMensage: number = 0;
            snapMsg.forEach(element => {

              if (element.val() == true) {
                totalMensage = totalMensage + 1;
              }

              this.events.publish('mensagem:nova', totalMensage);
            });
          });
        }
      }
    });
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
        let loginModal = this.mdlCtrl.create(LoginPage);
        loginModal.present();
        break;

      case enums.ETypeMenu.logout:
        this.timeOutSession = setTimeout(() => {
          this.usuaSrv.signOut();
          this.closeSession();
        }, 1000);
        break;
    }
  }

  public closeSession() {
    clearTimeout(this.timeOutSession);
    this.nav.setRoot(LoginPage);
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
      // { title: 'Configurações', component: TestePage, icon: 'options', typeMenu: enums.ETypeMenu.default },
      // { title: 'Estatísticas', component: RelatoriosListaPage, icon: 'pie', typeMenu: enums.ETypeMenu.default },
      // { title: 'Favoritos', component: TestePage, icon: 'star', typeMenu: enums.ETypeMenu.default },
      // { title: 'Contato', component: TestePage, icon: 'contact', typeMenu: enums.ETypeMenu.default },
      { title: 'Ajuda', component: AjudaPage, icon: 'md-help', typeMenu: enums.ETypeMenu.default }
      // { title: 'Sobre', component: TestePage, icon: 'information-circle', typeMenu: enums.ETypeMenu.default }

    ];

    if (value == true) {
      this.subpages.push({ title: 'Sair', component: TabsPage, icon: 'exit', typeMenu: enums.ETypeMenu.logout });
    }
  }

  // checkForUpdate() {
  //   const checking = this.loadingCtrl.create({
  //     content: 'Verificando atualizações...'
  //   });
  //   checking.present();

  //   this.deploy.check().then((snapshotAvailable: boolean) => {
  //     checking.dismiss();
  //     if (snapshotAvailable) {

  //       this.deploy.getSnapshots().then((snapshots) => {
  //         console.log('Snapshots', snapshots);
  //         this.deploy.info().then((x) => {
  //           console.log('Current snapshot infos', x);
  //           for (let suuid of snapshots) {
  //             if (suuid !== x.deploy_uuid) {
  //               this.deploy.deleteSnapshot(suuid);
  //             }
  //           }
  //         })
  //       });

  //       this.downloadAndInstall();
  //     }
  //   });
  // }

  // private downloadAndInstall() {
  //   const updating = this.loadingCtrl.create({
  //     content: 'Atualizando a aplicação.'
  //   });
  //   updating.present();
  //   this.deploy.download().then(() => this.deploy.extract()).then(() => this.deploy.load());
  // }

  createAlert(errorMessage: string) {

    if (this.toastAlert != null) {
      this.toastAlert.dismiss();
    }

    this.toastAlert = this.toastCtrl.create({
      message: errorMessage,
      duration: 3000,
      position: 'top'
    });

    this.toastAlert.present();
  }

  appStateEvent() {
    document.addEventListener("pause", () => {
      this.fbService.goOffline();
    }, false);

    document.addEventListener("resume", () => {
      this.fbService.goOnline();
    }, false);

  }
}