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
import { SsScrapfashionPage } from './../pages/ss-scrapfashion/ss-scrapfashion';
import { GuiaListaPage } from './../pages/guia-lista/guia-lista';
import { AnuncioFullPage } from './../pages/anuncio-full/anuncio-full';
import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { VitrinePage } from '../pages/vitrine/vitrine';
import { GuiaPage } from '../pages/guia/guia';
import { MensagemPage } from '../pages/mensagem/mensagem';
import { BrowserModule } from '@angular/platform-browser';

// providers
import { APP_PROVIDERS } from '../providers/app.providers';

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
  providers: [APP_PROVIDERS]
})
export class AppModule { }
