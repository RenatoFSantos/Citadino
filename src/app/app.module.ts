import { CtdListaMunicipio } from './../shared/components/ctd-lista-municipio/ctd-lista-municipio';
import { CtdBtnPromocaoComponent } from './../shared/components/ctd-btn-promocao/ctd-btn-promocao';
import { AnuncioPromocaoCrudPage } from './../pages/anuncio-promocao-crud/anuncio-promocao-crud';
import { AnuncioClassificadoPage } from './../pages/anuncio-classificado/anuncio-classificado';
import { AnuncioPromocaoPage } from './../pages/anuncio-promocao/anuncio-promocao';
import { AnuncioPublicidadePage } from './../pages/anuncio-publicidade/anuncio-publicidade';
import { MeusAnunciosPage } from './../pages/meus-anuncios/meus-anuncios';
import { VitrinePromocaoPage } from './../pages/vitrine-promocao/vitrine-promocao';
import { MeusCuponsPage } from './../pages/meus-cupons/meus-cupons';
import { VitrinePublicacaoPage } from './../pages/vitrine-publicacao/vitrine-publicacao';
import { VitrineCrudPage } from './../pages/vitrine-crud/vitrine-crud';
import { MeusMarcadosPage } from './../pages/meus_marcados/meus-marcados';
import { SettingsService } from './../shared/settingsService';
import { AutoresizeDirective } from './../shared/components/drt_autoresize/autoresize';
import { ElasticModule } from 'angular2-elastic';
import { ProfilePage } from './../pages/profile/profile';
import { EnviarNotificacaoPage } from './../pages/enviar-notificacao/enviar-notificacao';
import { AjudaPage } from './../pages/ajuda/ajuda';
import { SmartSitePage } from './../pages/smartSite/smartSite';
import { CtdHeaderModalComponent } from './../shared/components/ctd-header-modal/ctd-header-modal';
import { CtdButtonsComponent } from './../shared/components/ctd-buttons/ctd-buttons';
import { CtdHeaderComponent } from './../shared/components/ctd-header/ctd-header';
import { HomeLoginPage } from './../pages/autenticar/homeLogin';
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
import { GuiaListaPage } from './../pages/guia-lista/guia-lista';
import { AnuncioFullPage } from './../pages/anuncio-full/anuncio-full';
import { NgModule,LOCALE_ID } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { VitrinePage } from '../pages/vitrine/vitrine';
import { GuiaPage } from '../pages/guia/guia';
import { MensagemPage } from '../pages/mensagem/mensagem';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { BrMaskerModule } from 'brmasker-ionic-3';
import { CtdHeaderMunicipio } from '../shared/components/ctd-header-municipio/ctd-header-municipio';

registerLocaleData(ptBr)

// providers
import { APP_PROVIDERS } from '../providers/app.providers';

export const firebaseConfig = {
  apiKey: "AIzaSyC0maPdTdMQ7ccxuiXHLcZ1IsgeX7qVD6I",
  authDomain: "citadinodsv.firebaseapp.com",
  databaseURL: "https://citadinodsv.firebaseio.com",
  projectId: "citadinodsv",
  storageBucket: "citadinodsv.appspot.com",
  messagingSenderId: "180769307423"
};

// export const firebaseConfig = {
//   apiKey: "AIzaSyCuOY5Kt7_Zo08khwYFiLsIQC4kFe5LWwE",
//   authDomain: "citadinoprd-13651.firebaseapp.com",
//   databaseURL: "https://citadinoprd-13651.firebaseio.com",
//   projectId: "citadinoprd-13651",
//   storageBucket: "citadinoprd-13651.appspot.com",
//   messagingSenderId: "960817085241"
// };


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
    GuiaListaPage,
    SmartSitePage,
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
    HomeLoginPage,
    AjudaPage,
    EnviarNotificacaoPage,
    ProfilePage,
    MeusMarcadosPage,  
    AutoresizeDirective,
    VitrineCrudPage,
    MeusCuponsPage,
    VitrinePromocaoPage,
    VitrinePublicacaoPage,
    MeusAnunciosPage,
    AnuncioPublicidadePage,
    AnuncioPromocaoPage,
    AnuncioClassificadoPage,
    AnuncioPromocaoCrudPage,
    CtdBtnPromocaoComponent,
    CtdHeaderMunicipio,
    CtdListaMunicipio
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,
      {
        mode: 'md'
      }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    IonicImageViewerModule,
    BrMaskerModule
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
    GuiaListaPage,
    SmartSitePage,
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
    HomeLoginPage,
    AjudaPage,
    EnviarNotificacaoPage,
    ProfilePage,
    MeusMarcadosPage,
    VitrineCrudPage,
    MeusCuponsPage,
    VitrinePromocaoPage,
    VitrinePublicacaoPage,
    MeusAnunciosPage,
    AnuncioPublicidadePage,
    AnuncioPromocaoPage,
    AnuncioClassificadoPage,
    AnuncioPromocaoCrudPage,
    CtdBtnPromocaoComponent,
    CtdHeaderMunicipio,
    CtdListaMunicipio
  ],
  providers: [APP_PROVIDERS,
    {provide: LOCALE_ID, useValue: 'pt-PT'} ]
})
export class AppModule { }
