<<<<<<< HEAD
import { TpDetScrapfashionPage } from './../pages/tp-det-scrapfashion/tp-det-scrapfashion';
import { TpScrapfashionPage } from './../pages/tp-scrapfashion/tp-scrapfashion';
=======
import { MensagemListaPage } from './../pages/mensagem-lista/mensagem-lista';
>>>>>>> 1814775005515acf9fb0a6897bf2a5285e325b57
import { SsScrapfashionPage } from './../pages/ss-scrapfashion/ss-scrapfashion';
import { GuiaListaPage } from './../pages/guia-lista/guia-lista';
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
    GuiaListaPage,
    SsScrapfashionPage,
    TpScrapfashionPage,
    TpDetScrapfashionPage
  ],
  imports: [
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
    GuiaListaPage,
    SsScrapfashionPage,
    TpScrapfashionPage,
    TpDetScrapfashionPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
