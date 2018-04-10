import { SmartSiteCrudPage } from './../pages/smart-site-crud/smart-site-crud';
import { MunicipioService } from './../providers/service/municipio-service';
import { MunicipioVO } from './../model/municipioVO';
import { MeusAnunciosPage } from './../pages/meus-anuncios/meus-anuncios';
import { MeusCuponsPage } from './../pages/meus-cupons/meus-cupons';
import { UsuarioSqlService } from './../providers/database/usuario-sql-service';
import { MeusMarcadosPage } from './../pages/meus_marcados/meus-marcados';
import { ProfilePage } from './../pages/profile/profile';
import { MappingsService } from './../providers/service/_mappings-service';
import { EnviarNotificacaoPage } from './../pages/enviar-notificacao/enviar-notificacao';
import { TokenDeviceService } from './../providers/service/token-device';
import { LoginPage } from './../pages/autenticar/login/login';
import { AjudaPage } from './../pages/ajuda/ajuda';
import { MensagemPage } from './../pages/mensagem/mensagem';
import { MensagemService } from './../providers/service/mensagem-service';
import { UsuarioService } from './../providers/service/usuario-service';
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
import { SplashScreen } from '@ionic-native/splash-screen';
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

  appState = {
    takingPicture: true,
    imageUri: ""
  };

  APP_STORAGE_KEY = "";

  constructor(private platform: Platform,
    private menuCtrl: MenuController,
    private mdlCtrl: ModalController,
    private fbService: FirebaseService,
    private usuaSqlSrv: UsuarioSqlService,
    private usuaSrv: UsuarioService,
    private msgSrv: MensagemService,
    private events: Events,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private netService: NetworkService,
    private toastCtrl: ToastController,
    private glbVar: GlobalVar,
    private app: App,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private tokenSrv: TokenDeviceService,
    private oneSignal: OneSignal,
    private mapSrv: MappingsService,
    private muniSrv: MunicipioService) {

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
        self.bancoDadosOnlineEvent();
        self.glbVar.setIsCordova(window.cordova);

        if (self.platform.is('ios')) {
          self.glbVar.setAppPathStorage(window.cordova.file.dataDirectory);
          self.glbVar.setMyPathStorage("Library/Image");

        }
        else if (self.platform.is('android')) {
          self.glbVar.setAppPathStorage(window.cordova.file.dataDirectory);
          self.glbVar.setMyPathStorage("Image");
        }

        //this.checkForUpdate();
        //Inicializa o servico do sqlLite
        self.usuaSqlSrv.InitDatabase();
      }
    });
  }

  ngOnInit() {
    this.verificarConexao();
    this.userLoggedEvent();
    this.mensagemNovaEvent();
    this.dadosUsuarioAlteradoEvent();

  }

  ionViewDidEnter() {
    console.log("Diretorio Android " + window.cordova.file.dataDirectory);
  }

  verificarConexao() {
    let self = this;

    if (!self.glbVar.getIsFirebaseConnected()) {
      setTimeout(function () {
        self.firebaseConnectionAttempts++;

        if (self.firebaseConnectionAttempts < 10) {
          console.log(self.firebaseConnectionAttempts);
          self.verificarConexao();

        } else {
          self.usuaSrv.pesquisaUsuarioLogadoSq().then((usuLog: UsuarioVO) => {
            if (usuLog != null) {
              self.usuaSrv.pesquisarUsarioSqById(usuLog.usua_id)
                .then((usuario: UsuarioVO) => {
                  if (usuario != null) {
                    self.rotinaConectado(usuario);
                  }
                  else {
                    self.rotinaNaoConectado(false);
                  }
                }).catch(() => {
                  self.rotinaNaoConectado(true);
                });
            } else {
              self.rotinaNaoConectado(false);
            }
          });
        }
      }, 1000);
    }
    else {
      // self.promSrv.salvar();
      self.carregaMunicipio();
      self.rotinaLogandoUsuario(null);
    }
  }

  private rotinaLogandoUsuario(usuarioLocal: UsuarioVO) {
    let self = this;

    if (usuarioLocal == null) {
      var userCurrent = self.usuaSrv.getLoggedInUser();
      if (userCurrent != null) {
        self.usuaSrv.getUserDetail(userCurrent.uid).then((userRef) => {
          if (userRef.val() != null) {
            var usuario: UsuarioVO = self.mapSrv.getUsuario(userRef);
            if (usuario.usua_ds_email == "") {
              self.usuaSrv.atualizaEmail(usuario, userCurrent);
            }

            if (window.cordova) {
              self.usuaSrv.pesquisarUsarioSqByUid(usuario.usua_sq_id).then((result: UsuarioVO) => {
                var usuaLocal = result;
                if (usuaLocal == null) {
                  self.usuaSrv.addUserSQ(usuario, usuario.usua_sq_id).then((result: number) => {
                    self.usuaSrv.inseritUsuarioLogadoSq(result);
                  });
                } else {
                  self.usuaSrv.pesquisaUsuarioLogadoSq().then((usuaLog: UsuarioVO) => {
                    if (usuaLog == null) {
                      self.usuaSrv.inseritUsuarioLogadoSq(usuaLocal.usua_id);
                    }
                  });
                }
              }).catch((error) => {
                console.log(error);
                this.rotinaNaoConectado(true);
              });
            }

            this.rotinaConectado(usuario);
          }
          else {
            this.rotinaNaoConectado(false);
          }
        });
      }
      else {
        this.rotinaNaoConectado(false);
      }
    } else {
      self.usuaSrv.pesquisaUsuarioLogadoSq().then((usuaLog: UsuarioVO) => {
        if (usuaLog == null) {
          self.usuaSrv.inseritUsuarioLogadoSq(usuarioLocal.usua_id);
        }
      });
      this.rotinaConectado(usuarioLocal);
    }
  }

  private rotinaNaoConectado(error: boolean) {

    this.splashScreen.hide();
    this.rootPage = LoginPage;
    // this.fbService.goOffline();    
    if (error == true) {
      this.createAlert('Desculpe, no momento estamos fazendo a manutenção em nosso servidor. Tente mais tarde!');
    }
  }

  //Parameters
  //1=Firebase 2=Local
  private rotinaConectado(usuario: UsuarioVO) {

    this.msgSrv.addMensagemEvent();

    this.userLogged = usuario;
    this.glbVar.usuarioLogado = usuario;
    this.popularMenu(true, usuario);
    this.splashScreen.hide();

    console.log('Uid ' + usuario.usua_sq_id);
    this.saveTokenDevice(usuario.usua_sq_id);
    // self.tokenSrv.saveToken(self.tokenPush, userCurrent.uid);

    if (usuario.usua_in_ajuda == true) {
      // self.rootPage = TabsPage;
      this.app.getRootNav().setRoot(TabsPage);
      // this.app.getActiveNavs()[0].setRoot(TabsPage);
    }
    else {
      // self.rootPage = AjudaPage;
       this.app.getRootNav().setRoot(AjudaPage);      
      // this.app.getActiveNavs()[0].setRoot(AjudaPage);
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
    self.events.subscribe('usuario:logado', (usuRemote, usuLocal) => {
      if (usuRemote != null) {
        self.carregaMunicipio();
        self.rotinaLogandoUsuario(null);
      } else if (usuLocal != null) {
        self.rotinaLogandoUsuario(usuLocal);
      } else {
        // self.popularMenu(true);
        // self.userLogged = this.preencherObjetoUsuario(data);
        // self.nav.setRoot(TabsPage);
        // self.nav.setRoot(LoginPage);
        this.app.getRootNav().setRoot(LoginPage);
        // this.app.getActiveNavs()[0].setRoot(LoginPage);
      }
    });
  }

  dadosUsuarioAlteradoEvent() {
    var self = this;
    self.events.subscribe('dadosUsuario:alterado', (usuario) => {
      self.userLogged.usua_nm_usuario = usuario.usua_nm_usuario;
      self.userLogged.usua_tx_urlprofile = usuario.usua_tx_urlprofile;
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

    let self = this;
    this.events.subscribe('mensagem:alterada', (childSnapshot) => {
      let userCurrent = self.usuaSrv.getLoggedInUser();

      // if (this.app.getActiveNavs()[0] != null
      // && this.app.getActiveNavs()[0].getActive() != null) {
      // if (this.app.getActiveNavs()[0].getActive().instance instanceof MensagemPage) {

      if (self.app.getActiveNav() != null
        && self.app.getActiveNav().getActive() != null) {
        if (self.app.getActiveNav().getActive().instance instanceof MensagemPage) {
          self.usuaSrv.getUsersRef().child(userCurrent.uid)
            .child("mensagem")
            .child(childSnapshot.key).set(false);
        }
        else {
          self.usuaSrv.getMensagens().then((snapMsg) => {
            let totalMensage: number = 0;
            snapMsg.forEach(element => {

              if (element.val() == true) {
                totalMensage = totalMensage + 1;
              }
              self.events.publish('mensagemLista:nova', childSnapshot.key);
              self.events.publish('mensagem:nova', totalMensage);
            });
          });
        }
      }
    });
  }

  openPage(page: IMenu) {
    let params = {};
    let self = this;

    switch (page.typeMenu) {
      case enums.ETypeMenu.default:

        if (page.params != null) {
           params = page.params;
        }

        if (this.nav.getActiveChildNavs()[0] && page.index != undefined) {
          this.nav.getActiveChildNavs()[0].select(page.index);
        } else {
          this.nav.push(page.component, params).catch((err: any) => {
            console.log(`Não pode enviar para a página selecionada: ${err}`);
          });
        }
        break;

      case enums.ETypeMenu.login:
        let loginModal = this.mdlCtrl.create(LoginPage);
        loginModal.present();
        break;

      case enums.ETypeMenu.logout:
        this.timeOutSession = setTimeout(() => {

          this.usuaSrv.signOut(self.glbVar.getIsCordova());

          if (self.glbVar.getIsCordova()) {
            this.tokenSrv.removeToken(this.tokenPushAtual, this.userLogged.usua_sq_id);
            this.usuaSrv.removeToken(this.userLogged.usua_sq_id, this.tokenPushAtual);
          }

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

  public popularMenu(value: boolean, usuario: UsuarioVO) {
    this.pages = [];

    this.pages.push({ title: 'Minha Conta', component: ProfilePage, icon: 'contact', typeMenu: enums.ETypeMenu.default });

    // this.pages.push({ title: 'Smart Site', component: SmartSiteCrudPage, icon: 'ios-home', typeMenu: enums.ETypeMenu.default });


    if (usuario.usua_sg_perfil == "ADM" || this.glbVar.isBtnAdicionarVitrine() == true) {
      this.pages.push({ title: 'Meus Anúncios', component: MeusAnunciosPage, icon: 'md-create', typeMenu: enums.ETypeMenu.default });
    }

    this.pages.push({ title: 'Cupons de Descontos', component: MeusCuponsPage, icon: 'ios-cash-outline', typeMenu: enums.ETypeMenu.default, params:{tipoCupom:1} });

    this.pages.push({ title: 'Cupons de Sorteio', component: MeusCuponsPage, icon: 'md-happy', typeMenu: enums.ETypeMenu.default, params:{tipoCupom:2} });

    this.pages.push({ title: 'Meus Marcados', component: MeusMarcadosPage, icon: 'md-bookmark', typeMenu: enums.ETypeMenu.default });

    this.pages.push({ title: 'Ajuda', component: AjudaPage, icon: 'md-help', typeMenu: enums.ETypeMenu.default });

    if (usuario.usua_sg_perfil == "ADM") {
      this.pages.push({ title: 'Enviar Notificação', component: EnviarNotificacaoPage, icon: 'md-notifications', typeMenu: enums.ETypeMenu.default });
    }

    if (value == true) {
      this.pages.push({ title: 'Sair', component: TabsPage, icon: 'exit', typeMenu: enums.ETypeMenu.logout });
    }
  }

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

    //Producao
    let headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic 02655c01-f40d-4b22-ac0d-07358b012b57"
    };

    //Desenvolvimento
    // let headers = {
    //   "Content-Type": "application/json; charset=utf-8",
    //   "Authorization": "Basic dde460af-2898-4f1a-88b8-ff9fd97be308"
    // };

    //Chamado quando recebe uma notificacao com o app aberto
    let notificationReceivedCallback = function (jsonData) {
      console.log('notificationReceivedCallback: ' + JSON.stringify(jsonData));

    };

    //Chamado quando recebe uma notificacao com a app em background
    let notificationOpenedCallback = function (data: any) {
      self.showAlert(data);
      // self.redirectToPage(data);
    };

    //Producao
    window.plugins.OneSignal
      .startInit("02655c01-f40d-4b22-ac0d-07358b012b57", "960817085241")
      .handleNotificationOpened(notificationOpenedCallback)
      .handleNotificationReceived(notificationReceivedCallback)
      .inFocusDisplaying(self.oneSignal.OSInFocusDisplayOption.None)
      .endInit();

    //Desenvolvimento
  //   window.plugins.OneSignal
  //     .startInit("dde460af-2898-4f1a-88b8-ff9fd97be308", "180769307423")
  //     .handleNotificationOpened(notificationOpenedCallback)
  //     .handleNotificationReceived(notificationReceivedCallback)
  //     .inFocusDisplaying(self.oneSignal.OSInFocusDisplayOption.None)
  //     .endInit();
  }

  private showAlert(data: any) {
    let alert = this.alertCtrl.create({
      title: data.notification.payload.additionalData.dadosNotif.titulo,
      message: data.notification.payload.additionalData.dadosNotif.descricao,
      cssClass:'alertNotif', 
      buttons: ['Fechar']
    });
    alert.present();
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
    if (window.cordova) {
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
    let tokenVinculadoUsuario: string = self.tokenPushAtual;

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
        
        self.tokenSrv.getTokenDeviceRef().child(tokenVinculadoUsuario).child(usuarioVinculadoToken).set(null);

        self.tokenSrv.saveToken(self.tokenPushAtual, usuarioLogado.usua_sq_id);

        // self.usuaSrv.usersRef.child(usuarioVinculadoToken)
        //   .child("tokendevice").child(tokenVinculadoUsuario).set(null);

        if (usuarioLogado != null && usuarioLogado.usua_sq_id != "" && self.tokenPushAtual != "") {
          self.usuaSrv.usersRef.child(usuarioLogado.usua_sq_id)
            .child("tokendevice").set(self.tokenPushAtual).set(true);
        }
      }
      else if (eventoToken == enums.eventoTokenPush.usuarioSalvar) {

        self.tokenSrv.saveToken(self.tokenPushAtual, usuarioLogado.usua_sq_id);

        self.usuaSrv.saveToken(usuarioLogado.usua_sq_id, self.tokenPushAtual);
      }
      else {
        self.usuaSrv.saveToken(usuarioLogado.usua_sq_id, self.tokenPushAtual);
      }
    });

    return promise;
  }

  public bancoDadosOnlineEvent() {
    let self = this;
    this.events.subscribe('firebase:connected', (result: any) => {
      setTimeout(() => {
        if (self.usuaSrv.getLoggedInUser() == null) {
          var usua: any = self.glbVar.usuarioLogado;
          if (usua != null) {
            var resultFindUser: any = self.usuaSrv.signInUserFB(usua.usua_ds_email.toLowerCase(), usua.usua_tx_senha);
            resultFindUser.then((usua: any) => {
              self.usuaSrv.getUserDetail(usua.uid).then((userRef) => {
                if (userRef.val() != null) {
                  var usuario: UsuarioVO = self.mapSrv.getUsuario(userRef);
                  self.userLogged = usuario;
                  self.glbVar.usuarioLogado = usuario;
                }
              }).catch((error) => {
                console.log(error);
              });
            });
          }
        }
        else {
          if (self.glbVar.usuarioLogado.usua_tx_urlprofile == "") {
            self.usuaSrv.getUserDetail(self.usuaSrv.getLoggedInUser().uid).then((userRef) => {
              if (userRef.val() != null) {
                var usuario: UsuarioVO = self.mapSrv.getUsuario(userRef);
                self.userLogged = usuario;
                self.glbVar.usuarioLogado = usuario;
              }
            }).catch((error) => {
              console.log(error);
            });
          }
        }
      }, 1000);
    });
  }

  private carregaMunicipio() {
    let self = this;

    self.muniSrv.listMunicipio().then((snapEmpr) => {
      var munickey: any[] = Object.keys(snapEmpr.val());
      munickey.forEach(element => {
        var munic: MunicipioVO = self.mapSrv.getMunicipio(snapEmpr.val()[element]);
        if (self.glbVar.getMunicipios() == null) {
          self.glbVar.setMunicipios(munic);
        }
        else {
          self.glbVar.getMunicipios().push(munic);
        }
      });
    });
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
}