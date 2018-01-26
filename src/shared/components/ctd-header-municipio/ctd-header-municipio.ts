import { CtdListaMunicipio } from './../ctd-lista-municipio/ctd-lista-municipio';
import { GlobalVar } from './../../global-var';
import { MappingsService } from './../../../providers/service/_mappings-service';
import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../providers/service/municipio-service';
import { Events, ModalController } from 'ionic-angular';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'ctd-header-municipio',
  templateUrl: 'ctd-header-municipio.html'
})

export class CtdHeaderMunicipio {
  
  @Input()
  public tela: string = "";

  public municipios: MunicipioVO[] = [];
  public municipioSelected:MunicipioVO;
  
  constructor(private muniSrv: MunicipioService,
              private mapSrv: MappingsService,
              private glbVar: GlobalVar,
              private mdlCtrl: ModalController) {
               
    this.municipioSelected = this.glbVar.getMunicipioPadrao();
  }

  public openCidade() {
    let modal = this.mdlCtrl.create(CtdListaMunicipio,{tela: this.tela});
    modal.present();
  }

}
