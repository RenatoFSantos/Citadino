import { VitrineService } from './../providers/service/vitrine-service';
import { HomeLoginPage } from './../pages/autenticar/homeLogin';
import { CtdHeaderModalComponent } from './../components/ctd-header-modal/ctd-header-modal';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginService } from './../providers/service/login-service';
import { FirebaseService } from './../providers/database/firebase-service';
import { GlobalVar } from './../providers/global-var';
import { SignUpPage } from './../pages/autenticar/signup/signup';
import { LoginPage } from './../pages/autenticar/login/login';
import { TestePage } from './../pages/teste/teste';
import { RelatFidelidadePage } from './../pages/relat-fidelidade/relat-fidelidade';
import { RelatPedidoPage } from './../pages/relat-pedido/relat-pedido';
import { RelatoriosListaPage } from './../pages/relatorios-lista/relatorios-lista';
import { NoticiaFullPage } from './../pages/noticia-full/noticia-full';
import { GuiaContatoPage } from './../pages/guia-contato/guia-contato';
import { TpPedScrapfashionPage } from './../pages/tp-ped-scrapfashion/tp-ped-scrapfashion';
import { TpDetScrapfashionPage } from './../pages/tp-det-scrapfashion/tp-det-scrapfashion';
import { TpScrapfashionPage } from './../pages/tp-scrapfashion/tp-scrapfashion';
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
import { SsScrapfashionPage } from './../pages/ss-scrapfashion/ss-scrapfashion';
import { GuiaListaPage } from './../pages/guia-lista/guia-lista';
import { VitrineAnuncio6Page } from './../pages/vitrine-anuncio-6/vitrine-anuncio-6';
import { VitrineAnuncio5Page } from './../pages/vitrine-anuncio-5/vitrine-anuncio-5';
import { VitrineAnuncio4Page } from './../pages/vitrine-anuncio-4/vitrine-anuncio-4';
import { VitrineAnuncio3Page } from './../pages/vitrine-anuncio-3/vitrine-anuncio-3';
import { VitrineAnuncio2Page } from './../pages/vitrine-anuncio-2/vitrine-anuncio-2';
import { VitrineAnuncio1Page } from './../pages/vitrine-anuncio-1/vitrine-anuncio-1';
import { AnuncioFullPage } from './../pages/anuncio-full/anuncio-full';
import { CtdHeaderComponent } from './../components/ctd-header/ctd-header';
import { CtdButtonsComponent } from './../components/ctd-buttons/ctd-buttons';
import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { VitrinePage } from '../pages/vitrine/vitrine';
import { GuiaPage } from '../pages/guia/guia';
import { MensagemPage } from '../pages/mensagem/mensagem';
import { BrowserModule } from '@angular/platform-browser';


@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    VitrinePage,
    GuiaPage,
    MensagemPage,
    MensagemListaPage,
    CtdHeaderComponent,
    CtdButtonsComponent,
    AnuncioFullPage,
    VitrineAnuncio1Page,
    VitrineAnuncio2Page,
    VitrineAnuncio3Page,
    VitrineAnuncio4Page,
    VitrineAnuncio5Page,
    VitrineAnuncio6Page,
    GuiaListaPage,
    SsScrapfashionPage,
    TpScrapfashionPage,
    TpDetScrapfashionPage,
    TpPedScrapfashionPage,
    GuiaContatoPage,
    NoticiaFullPage,
    RelatoriosListaPage,
    RelatPedidoPage,
    RelatFidelidadePage,
    LoginPage,
    SignUpPage,
    TestePage,
    CtdHeaderModalComponent,
    HomeLoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,
      {
        mode: 'md'
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    VitrinePage,
    GuiaPage,
    MensagemPage,
    MensagemListaPage,
    CtdHeaderComponent,
    CtdButtonsComponent,
    AnuncioFullPage,
    VitrineAnuncio1Page,
    VitrineAnuncio2Page,
    VitrineAnuncio3Page,
    VitrineAnuncio4Page,
    VitrineAnuncio5Page,
    VitrineAnuncio6Page,
    GuiaListaPage,
    SsScrapfashionPage,
    TpScrapfashionPage,
    TpDetScrapfashionPage,
    TpPedScrapfashionPage,
    GuiaContatoPage,
    NoticiaFullPage,
    RelatoriosListaPage,
    RelatPedidoPage,
    RelatFidelidadePage,
    LoginPage,
    SignUpPage,
    TestePage,
    CtdHeaderModalComponent,
    HomeLoginPage
  ],
  providers: [{ provide: ErrorHandler, useClass: IonicErrorHandler },
    FirebaseService,
    LoginService,
    GlobalVar,
    SplashScreen,
    VitrineService
  ]
})
export class AppModule { }
