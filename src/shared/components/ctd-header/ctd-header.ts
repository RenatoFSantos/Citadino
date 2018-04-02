import { GlobalVar } from './../../global-var';
import { MappingsService } from './../../../providers/service/_mappings-service';
import { MunicipioVO } from './../../../model/municipioVO';
import { MunicipioService } from './../../../providers/service/municipio-service';
import { Events } from 'ionic-angular';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ctd-header',
  templateUrl: 'ctd-header.html'
})

export class CtdHeaderComponent {
  @Input()
  public titulo: string = "CITADINO";

  @Input()
  public pathImage: string = "assets/img/icon.png";

  @Input()
  public exibirBotao: boolean = false;

  private municipios: MunicipioVO[] = [];

  constructor(private glb: GlobalVar) {

    if (glb.getMunicipioPadrao() != null) {
      this.titulo = glb.getMunicipioPadrao().muni_nm_municipio;
    }
  }
}
