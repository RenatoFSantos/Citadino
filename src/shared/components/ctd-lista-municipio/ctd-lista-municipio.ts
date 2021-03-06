import { App } from 'ionic-angular/components/app/app';
import { VitrinePage } from './../../../pages/vitrine/vitrine';
import { Events, NavController, NavParams, ViewController } from 'ionic-angular';
import { GlobalVar } from './../../global-var';
import { MappingsService } from './../../../providers/service/_mappings-service';
import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../providers/service/municipio-service';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-lista-municipio',
  templateUrl: 'ctd-lista-municipio.html'
})

export class CtdListaMunicipio {

  public municSelected: MunicipioVO = new MunicipioVO();
  public municipios: MunicipioVO[] = [];
  private tela: string;

  constructor(private muniSrv: MunicipioService,
    private mapSrv: MappingsService,
    public glbVar: GlobalVar,
    private events: Events,
    private navCtrl: NavController,
    private param: NavParams,
    private viewCtrl: ViewController,
    private app: App) {

    this.tela = param.get("tela");
    this.carregaMunicipio();
    this.municSelected = this.glbVar.getMunicipioPadrao();
  }

  private carregaMunicipio() {

    this.municipios = this.glbVar.getMunicipios();

  }

  public municipioSelecionado(munic: MunicipioVO) {

    if (this.municSelected.muni_sq_id != munic.muni_sq_id) {
      this.glbVar.setMunicipioPadrao(munic);
      this.municSelected = this.glbVar.getMunicipioPadrao();

      if (this.tela == "VITRINE") {
        this.events.publish("vitrine:onChangeMunicipio");
      }
      else if (this.tela == "GUIA") {
        this.events.publish("guia:municipio");
      }
    }

    this.navCtrl.pop();
  }


  ionViewDidLoad() {
    this.closeEvent();
  }

  ionViewWillUnload() {
    this.events.unsubscribe('anuncio_close:true', null);
  }

  private closeEvent() {
    this.events.subscribe("anuncio_close:true", (result) => {
      if (result) {
        this.navCtrl.pop();
      }
    });
  }

}