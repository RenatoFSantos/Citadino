import { MappingsService } from './../providers/service/_mappings-service';
import { EnviarNotificacaoPage } from './../pages/enviar-notificacao/enviar-notificacao';
import { TokenDeviceService } from './../providers/service/token-device';
import { NotificacaoPage } from './../pages/notificacao/notificacao';
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
  ToastController, App, LoadingController, AlertController
} from 'ionic-angular';
import { SplashScreen, } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import * as enums from './../model/dominio/ctdEnum';
import { OneSignal } from '@ionic-native/onesignal';



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
  private tokenPushAtual: string = "";

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
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private tokenSrv: TokenDeviceService,
    private oneSignal: OneSignal,
    private mapSrv: MappingsService) {

    this.platform.ready().then(() => {
      var self = this;
      this.statusBar.styleDefault();

      if (window.cordova) {

        setTimeout(function () {
          self.initPushConfigurate();
        }, 1000);

        self.netService.initializeNetworkEvents();
        self.networkDisconnectEvent();
        self.networkConnectionEvent();
        self.appStateEvent();

        //this.checkForUpdate();
        //Inicializa o servico do sqlLite
        //this.sqService.InitDatabase();    

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
          self.createAlert('Desculpe, no momento estamos fazendo a manutenção em nosso servidor. Tente mais tarde!');
        }
      }, 1000);
    }
    else {
      let userCurrent = self.usuaSrv.getLoggedInUser();
      if (userCurrent != null) {
        self.usuaSrv.getUserDetail(userCurrent.uid).then((userRef) => {
          if (userRef != null) {
            self.popularMenu(true, userRef.val());
            self.userLogged = userRef.val();
            self.globalVar.usuarioLogado = self.userLogged;
            self.splashScreen.hide();

            console.log('Uid ' + userCurrent.uid);
            self.saveTokenDevice(userCurrent.uid);
            // self.tokenSrv.saveToken(self.tokenPush, userCurrent.uid);

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
              self.popularMenu(true, userRef.val());
              self.userLogged = userRef.val();
              self.globalVar.usuarioLogado = self.userLogged;

              console.log('Uid ' + userCurrent.uid);
              self.saveTokenDevice(userCurrent.uid);
              // self.tokenSrv.saveToken(self.tokenPush, userCurrent.uid);

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

      if (this.app.getActiveNavs()[0] != null
        && this.app.getActiveNavs()[0].getActive() != null) {
        if (this.app.getActiveNavs()[0].getActive().instance instanceof MensagemPage) {
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

        if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
          this.nav.getActiveChildNavs()[0].select(page.index);
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
          this.tokenSrv.removeToken(this.tokenPushAtual, this.userLogged.usua_sq_id);
          this.usuaSrv.removeToken(this.userLogged.usua_sq_id, this.tokenPushAtual);
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
    let childNav = this.nav.getActiveChildNavs()[0];

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

  public popularMenu(value: boolean, usuarioParam: any) {
    
    var userJson:any = this.mapSrv.getUserJson(usuarioParam);

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

    if (userJson.usua_in_adm == true) {
      console.log(userJson.usua_in_adm);
      this.subpages.push({ title: 'Enviar Notificação', component: EnviarNotificacaoPage, icon: 'md-notifications', typeMenu: enums.ETypeMenu.default });
    }

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

  private initPushConfigurate() {
    var self = this;

    let headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic 075d2576-04aa-4cae-bd52-ae2e9e690abe"
    };
    //Chamado quando recebe uma notificacao com o app aberto
    let notificationReceivedCallback = function (jsonData) {
      console.log('notificationReceivedCallback: ' + JSON.stringify(jsonData));
    };

    //Chamado quando abre um notificacao com a app em background
    let notificationOpenedCallback = function (data: any) {
      self.redirectToPage(data);
    };

    window.plugins.OneSignal
      .startInit("075d2576-04aa-4cae-bd52-ae2e9e690abe", "180769307423")
      .handleNotificationOpened(notificationOpenedCallback)
      .handleNotificationReceived(notificationReceivedCallback)
      .inFocusDisplaying(self.oneSignal.OSInFocusDisplayOption.None)
      .endInit();

  }

  private redirectToPage(data: any) {
    var self = this;
    // alert( JSON.stringify(jsonData));
    let eventType = data.notification.payload.additionalData.eventType

    switch (eventType) {
      case enums.eventTypePush.vitrine: {
        // self.navController.push(VitrinePage);
        self.nav.getActiveChildNavs()[0].select(enums.eventTypePush.vitrine)
        break;
      } case enums.eventTypePush.guia: {
        // self.navController.push(GuiaPage)
        self.nav.getActiveChildNavs()[0].select(enums.eventTypePush.guia)
        break;
      } case enums.eventTypePush.mensagem: {
        // self.navController.push(MensagemListaPage);
        self.nav.getActiveChildNavs()[0].select(enums.eventTypePush.mensagem)
        break;
      }
    }
  }

  saveTokenDevice(userUid: string) {
    let self = this;

    window.plugins.OneSignal.getPermissionSubscriptionState(function (status) {
      self.tokenPushAtual = status.subscriptionStatus.userId;

      console.log("user id token " + self.tokenPushAtual);

      if (self.tokenPushAtual != "") {
        self.usuaSrv.getUserDetail(userUid).then((snapUsuario) => {
          var usuario: UsuarioVO = snapUsuario.val();

          self.pesquisaToken(usuario)
            .then(self.pesquisaTokenUsuario)
            .then(self.salvarTokenUsuario);
        });
      }
    });
  }

  private pesquisaToken = function (usuario: UsuarioVO) {
    let self = this;

    var promise = new Promise(function (resolve, reject) {
      self.tokenSrv.findTokenById(self.tokenPushAtual)
        .then((snapToken) => {
          resolve({ self, snapToken, usuario });
        })
        .catch((error) => {
          reject(error);
        });
    });

    return promise;
  }

  private pesquisaTokenUsuario = function (verificarToken) {
    let self = verificarToken.self;

    //Usuario Vinculado ao Token
    let snapToken = verificarToken.snapToken;

    //Usuario Logado
    let usuarioLogado: UsuarioVO = verificarToken.usuario;

    //Token vinculado ao usuario
    let tokenVinculadoUsuario: string = "";

    let eventoToken: number;

    var promise = new Promise(function (resolve, reject) {
      var usuarioVinculadoToken: string = "";

      if (snapToken.val() != null) {
        usuarioVinculadoToken = Object.keys(snapToken.val())[0];

        if (usuarioVinculadoToken != usuarioLogado.usua_sq_id) {
          eventoToken = enums.eventoTokenPush.usuarioAlterar;
        }
        else {
          eventoToken = enums.eventoTokenPush.usuarioCorreto;
        }

      }
      else {
        eventoToken = enums.eventoTokenPush.usuarioSalvar;
      }

      resolve({ self, eventoToken, usuarioLogado, usuarioVinculadoToken, tokenVinculadoUsuario });

    });

    return promise;
  }

  private salvarTokenUsuario = function (pesquisaTokenUsuario) {
    let self = pesquisaTokenUsuario.self;
    let eventoToken = pesquisaTokenUsuario.eventoToken;
    let usuarioLogado: UsuarioVO = pesquisaTokenUsuario.usuarioLogado;
    let usuarioVinculadoToken: string = pesquisaTokenUsuario.usuarioVinculadoToken;
    let tokenVinculadoUsuario: string = pesquisaTokenUsuario.tokenVinculadoUsuario;

    var promise = new Promise(function (resolve, reject) {

      if (eventoToken == enums.eventoTokenPush.usuarioAlterar) {

        self.tokenSrv.saveToken(self.tokenPushAtual, usuarioLogado.usua_sq_id);

        self.usuaSrv.usersRef.child(usuarioVinculadoToken)
          .child("tokendevice").child(tokenVinculadoUsuario).set(null);

        self.usuaSrv.usersRef.child(usuarioLogado.usua_sq_id)
          .child("tokendevice").set(self.tokenPushAtual);

      }
      else if (eventoToken == enums.eventoTokenPush.usuarioSalvar) {

        self.tokenSrv.saveToken(self.tokenPushAtual, usuarioLogado.usua_sq_id);

        self.usuaSrv.saveToken(usuarioLogado.usua_sq_id, self.tokenPushAtual);
      }
    });

    return promise;
  }
}