import { CtdHeaderComponent } from './../components/ctd-header/ctd-header';
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
    CtdHeaderComponent
  ],
  imports: [
    IonicModule.forRoot(MyApp, {
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
    CtdHeaderComponent
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
