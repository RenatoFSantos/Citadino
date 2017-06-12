import { EmpresaVO } from './../../model/empresaVO';
import { EmpresaService } from './../../providers/service/empresa-service';

import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-guia-contato',
  templateUrl: 'guia-contato.html'
})
export class GuiaContatoPage {

  public empresa: EmpresaVO = null;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public emprSrv: EmpresaService) {

    this.empresa = navParams.get("empresa");
  }

  // openSmartSite(site: string) {
  //   switch (site) {
  //     case 'scrapfashion':
  //       this.navCtrl.push(SsScrapfashionPage);
  //     default: {
  //     }
    // }
  // }

  dismiss() {
    this.viewCtrl.dismiss();
  }
}


